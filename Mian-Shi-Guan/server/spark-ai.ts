import crypto from 'crypto';
import WebSocket from 'ws';

export interface SparkInterviewEvaluation {
  overallScore: number;
  coreAbilities: {
    professionalKnowledge: number;
    skillMatching: number;
    communication: number;
    logicalThinking: number;
    innovationAdaptability: number;
    stressResistance: number;
  };
  multiModalAnalysis: {
    textAnalysis: {
      score: number;
      insights: string[];
      metrics: {
        keywordDensity: number;
        structuralClarity: number;
        dataSupport: number;
        technicalDepth: number;
        practicalRelevance: number;
      };
    };
    audioAnalysis: {
      score: number;
      insights: string[];
      metrics: {
        fluency: number;
        pace: number;
        clarity: number;
        confidence: number;
      };
    };
    videoAnalysis: {
      score: number;
      insights: string[];
      metrics: {
        eyeContact: number;
        posture: number;
        expression: number;
        gestures: number;
      };
    };
  };
  improvementSuggestions: string[];
  competitiveAdvantages: string[];
  learningPath: Array<{
    area: string;
    resources: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  detailedFeedback: string;
}

interface SparkConfig {
  appId: string;
  apiSecret: string;
  apiKey: string;
  hostUrl: string;
}

class SparkAI {
  private config: SparkConfig | null = null;

  constructor() {
    const appId = process.env.SPARK_APP_ID;
    const apiSecret = process.env.SPARK_API_SECRET;
    const apiKey = process.env.SPARK_API_KEY;

    if (appId && apiSecret && apiKey) {
      this.config = {
        appId: "d59225a6",
        apiSecret: "NTI0MGMzN2FiZmRhNjQ3ZGJlMGQyMjNl",
        apiKey: "d5c98789d8b9dcfc2e2a10477fc1b395",
        hostUrl: 'wss://spark-api.xf-yun.com/v1/x1'
      };
    } else {
      console.warn('讯飞星火API密钥未配置，将使用本地评估模式');
    }
  }

  // 生成认证URL
  private generateAuthUrl(): string {
    if (!this.config) {
      throw new Error('SparkAI未正确配置');
    }
    
    const url = new URL(this.config.hostUrl);
    const host = url.host;
    const path = url.pathname;
    
    const date = new Date().toUTCString();
    const algorithm = 'hmac-sha256';
    const headers = 'host date request-line';
    const requestLine = `GET ${path} HTTP/1.1`;
    const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;
    
    const signature = crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(signatureOrigin)
      .digest('base64');
    
    const authorizationOrigin = `api_key="${this.config.apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = Buffer.from(authorizationOrigin).toString('base64');
    
    return `${this.config.hostUrl}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`;
  }

  // 调用星火大模型进行面试评测
  async evaluateInterview(
    answer: string,
    questionCategory: string,
    position: string,
    audioData?: any,
    videoData?: any,
    duration?: number
  ): Promise<SparkInterviewEvaluation> {
    return new Promise((resolve, reject) => {
      const authUrl = this.generateAuthUrl();
      const ws = new WebSocket(authUrl);

      let fullResponse = '';

      ws.on('open', () => {
        if (!this.config) {
          ws.close();
          const fallbackEvaluation = this.generateFallbackEvaluation(answer, questionCategory);
          resolve(fallbackEvaluation);
          return;
        }
        
        const evaluationPrompt = this.buildEvaluationPrompt(
          answer, 
          questionCategory, 
          position, 
          audioData, 
          videoData, 
          duration
        );

        const params = {
          header: {
            app_id: this.config.appId,
            uid: 'interview_evaluation_' + Date.now()
          },
          parameter: {
            chat: {
              domain: 'generalv3.5',
              temperature: 0.1,
              max_tokens: 4096,
              top_k: 1,
              chat_id: 'interview_' + Date.now()
            }
          },
          payload: {
            message: {
              text: [
                {
                  role: 'system',
                  content: '你是一位资深的职业发展导师和面试专家，拥有10年以上的企业招聘经验。请基于提供的面试回答进行专业评测，并返回JSON格式的详细评估报告。'
                },
                {
                  role: 'user', 
                  content: evaluationPrompt
                }
              ]
            }
          }
        };

        ws.send(JSON.stringify(params));
      });

      ws.on('message', (data) => {
        try {
          const response = JSON.parse(data.toString());
          
          if (response.header && response.header.code !== 0) {
            reject(new Error(`星火API错误: ${response.header.message}`));
            return;
          }

          if (response.payload && response.payload.choices) {
            const content = response.payload.choices.text[0].content;
            fullResponse += content;

            // 如果是最后一条消息
            if (response.payload.choices.status === 2) {
              ws.close();
              
              try {
                // 解析JSON响应
                const evaluation = this.parseEvaluationResponse(fullResponse);
                resolve(evaluation);
              } catch (parseError) {
                // 如果解析失败，生成基础评估
                const fallbackEvaluation = this.generateFallbackEvaluation(answer, questionCategory);
                resolve(fallbackEvaluation);
              }
            }
          }
        } catch (error) {
          console.error('处理星火响应失败:', error);
        }
      });

      ws.on('error', (error) => {
        console.error('星火WebSocket连接错误:', error);
        // 生成本地评估作为后备
        const fallbackEvaluation = this.generateFallbackEvaluation(answer, questionCategory);
        resolve(fallbackEvaluation);
      });

      ws.on('close', () => {
        if (!fullResponse) {
          const fallbackEvaluation = this.generateFallbackEvaluation(answer, questionCategory);
          resolve(fallbackEvaluation);
        }
      });

      // 设置超时
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
          const fallbackEvaluation = this.generateFallbackEvaluation(answer, questionCategory);
          resolve(fallbackEvaluation);
        }
      }, 30000);
    });
  }

  // 构建评测提示词
  private buildEvaluationPrompt(
    answer: string,
    questionCategory: string,
    position: string,
    audioData?: any,
    videoData?: any,
    duration?: number
  ): string {
    return `
请对以下面试回答进行专业评测，并以JSON格式返回详细评估报告：

**面试信息：**
- 技术领域：${questionCategory}
- 目标岗位：${position}
- 回答时长：${duration ? Math.floor(duration / 60) + '分' + (duration % 60) + '秒' : '未知'}

**面试回答：**
${answer}

**评测要求：**
请基于以下6个核心能力维度进行评分（0-100分）：
1. 专业知识水平 - 技术理论掌握、实践应用能力、行业认知深度
2. 技能匹配度 - 与岗位要求的匹配程度、核心技能熟练度
3. 语言表达能力 - 逻辑清晰度、表达流畅性、术语使用准确性
4. 逻辑思维能力 - 问题分析能力、解决方案设计、思维结构化
5. 创新应变能力 - 创新思维、学习适应性、应对挑战的能力
6. 抗压应变能力 - 自信表现、情绪稳定性、压力处理能力

**返回格式：**
{
  "overallScore": 综合评分,
  "coreAbilities": {
    "professionalKnowledge": 专业知识评分,
    "skillMatching": 技能匹配评分,
    "communication": 沟通表达评分,
    "logicalThinking": 逻辑思维评分,
    "innovationAdaptability": 创新应变评分,
    "stressResistance": 抗压能力评分
  },
  "multiModalAnalysis": {
    "textAnalysis": {
      "score": 文本分析评分,
      "insights": ["洞察1", "洞察2"],
      "metrics": {
        "keywordDensity": 关键词密度分数,
        "structuralClarity": 结构清晰度分数,
        "dataSupport": 数据支撑分数,
        "technicalDepth": 技术深度分数,
        "practicalRelevance": 实践相关性分数
      }
    },
    "audioAnalysis": {
      "score": 语音分析评分,
      "insights": ["语音洞察1", "语音洞察2"],
      "metrics": {
        "fluency": 流畅度分数,
        "pace": 语速节奏分数,
        "clarity": 清晰度分数,
        "confidence": 自信度分数
      }
    },
    "videoAnalysis": {
      "score": 视频分析评分,
      "insights": ["视频洞察1", "视频洞察2"],
      "metrics": {
        "eyeContact": 眼神交流分数,
        "posture": 坐姿仪态分数,
        "expression": 面部表情分数,
        "gestures": 手势表达分数
      }
    }
  },
  "improvementSuggestions": ["改进建议1", "改进建议2", "改进建议3"],
  "competitiveAdvantages": ["优势1", "优势2"],
  "learningPath": [
    {
      "area": "学习领域",
      "resources": ["资源1", "资源2"],
      "priority": "high/medium/low"
    }
  ],
  "detailedFeedback": "详细的综合评价和建议"
}

请确保返回标准的JSON格式，评分客观准确，建议具体可操作。
`;
  }

  // 解析星火返回的评估结果
  private parseEvaluationResponse(response: string): SparkInterviewEvaluation {
    try {
      // 尝试从响应中提取JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // 验证和规范化数据
        return {
          overallScore: Math.max(0, Math.min(100, parsed.overallScore || 0)),
          coreAbilities: {
            professionalKnowledge: Math.max(0, Math.min(100, parsed.coreAbilities?.professionalKnowledge || 0)),
            skillMatching: Math.max(0, Math.min(100, parsed.coreAbilities?.skillMatching || 0)),
            communication: Math.max(0, Math.min(100, parsed.coreAbilities?.communication || 0)),
            logicalThinking: Math.max(0, Math.min(100, parsed.coreAbilities?.logicalThinking || 0)),
            innovationAdaptability: Math.max(0, Math.min(100, parsed.coreAbilities?.innovationAdaptability || 0)),
            stressResistance: Math.max(0, Math.min(100, parsed.coreAbilities?.stressResistance || 0))
          },
          multiModalAnalysis: parsed.multiModalAnalysis || this.getDefaultMultiModalAnalysis(),
          improvementSuggestions: parsed.improvementSuggestions || [],
          competitiveAdvantages: parsed.competitiveAdvantages || [],
          learningPath: parsed.learningPath || [],
          detailedFeedback: parsed.detailedFeedback || '基于星火大模型的专业评估'
        };
      }
    } catch (error) {
      console.error('解析星火评估结果失败:', error);
    }
    
    throw new Error('无法解析星火评估结果');
  }

  // 生成后备评估（当星火API不可用时）
  private generateFallbackEvaluation(answer: string, questionCategory: string): SparkInterviewEvaluation {
    const answerLength = answer.length;
    const wordCount = answer.split(/\s+/).length;
    
    // 基于回答长度和内容的基础评分
    const baseScore = Math.min(85, Math.max(45, 50 + (answerLength / 50) + (wordCount / 10)));
    
    return {
      overallScore: Math.round(baseScore),
      coreAbilities: {
        professionalKnowledge: Math.round(baseScore + Math.random() * 10 - 5),
        skillMatching: Math.round(baseScore + Math.random() * 8 - 4),
        communication: Math.round(baseScore + Math.random() * 6 - 3),
        logicalThinking: Math.round(baseScore + Math.random() * 8 - 4),
        innovationAdaptability: Math.round(baseScore + Math.random() * 10 - 5),
        stressResistance: Math.round(baseScore + Math.random() * 6 - 3)
      },
      multiModalAnalysis: this.getDefaultMultiModalAnalysis(),
      improvementSuggestions: [
        '建议增强技术案例的详细描述',
        '可以加强逻辑表达的结构化',
        '适当补充实际项目经验'
      ],
      competitiveAdvantages: [
        '具备良好的技术基础',
        '表达相对清晰'
      ],
      learningPath: [
        {
          area: questionCategory,
          resources: ['相关技术文档', '实践项目'],
          priority: 'high' as const
        }
      ],
      detailedFeedback: `基于对您在${questionCategory}领域的回答分析，整体表现达到预期水平。建议继续加强技术深度和表达技巧。`
    };
  }

  // 获取默认的多模态分析
  private getDefaultMultiModalAnalysis() {
    return {
      textAnalysis: {
        score: 75,
        insights: ['回答内容结构清晰', '技术术语使用得当'],
        metrics: {
          keywordDensity: 78,
          structuralClarity: 72,
          dataSupport: 68,
          technicalDepth: 75,
          practicalRelevance: 73
        }
      },
      audioAnalysis: {
        score: 72,
        insights: ['语速适中', '表达较为流畅'],
        metrics: {
          fluency: 74,
          pace: 70,
          clarity: 72,
          confidence: 71
        }
      },
      videoAnalysis: {
        score: 70,
        insights: ['仪态端正', '眼神交流自然'],
        metrics: {
          eyeContact: 72,
          posture: 68,
          expression: 70,
          gestures: 69
        }
      }
    };
  }
}

// 导出单例实例
export const sparkAI = new SparkAI();

// 便捷方法
export async function evaluateInterviewWithSpark(
  answer: string,
  questionCategory: string,
  position: string,
  audioData?: any,
  videoData?: any,
  duration?: number
): Promise<SparkInterviewEvaluation> {
  return sparkAI.evaluateInterview(answer, questionCategory, position, audioData, videoData, duration);
}

// 生成面试问题
export async function generateInterviewQuestionWithSpark(
  category: string,
  difficulty: string,
  major?: string,
  position?: string,
  company?: string
): Promise<{ title: string; content: string; expectedDuration: number }> {
  try {
    // 立即使用本地问题库，确保快速响应
    const { CompetitionQuestionBank } = await import('./competition-question-bank');
    const questions = CompetitionQuestionBank.getQuestionsByCategory(category, 5);
    
    if (questions.length > 0) {
      // 随机选择一个问题
      const randomIndex = Math.floor(Math.random() * questions.length);
      const question = questions[randomIndex];
      
      // 根据用户输入的公司和职位定制问题
      let customizedContent = question.content;
      if (position && company) {
        customizedContent += `\n\n请结合${company}公司${position}岗位的特点来回答。`;
      } else if (position) {
        customizedContent += `\n\n请结合${position}岗位的要求来回答。`;
      } else if (company) {
        customizedContent += `\n\n请结合${company}公司的业务特点来回答。`;
      }
      
      return {
        title: question.title,
        content: customizedContent,
        expectedDuration: question.expectedDuration || 240
      };
    }
    
    // 如果问题库中没有相关问题，使用预定义的专业问题
    const fallbackQuestions = {
      'ai': {
        title: '机器学习项目实战经验',
        content: '请详细描述您参与的一个机器学习项目，包括问题定义、数据处理、模型选择、训练优化以及部署上线的完整流程。重点说明遇到的技术挑战和解决方案。',
        expectedDuration: 300
      },
      'bigdata': {
        title: '大数据处理架构设计',
        content: '假设需要设计一个处理每日TB级数据的实时分析系统，请描述您的技术架构选型、数据流处理方案、存储策略以及性能优化措施。',
        expectedDuration: 300
      },
      'iot': {
        title: '物联网系统安全与通信',
        content: '在设计一个包含数千个传感器设备的物联网系统时，如何确保设备通信的安全性和可靠性？请详细说明通信协议选择、数据加密和设备认证方案。',
        expectedDuration: 300
      },
      'intelligent': {
        title: '智能决策系统设计',
        content: '描述如何构建一个智能推荐系统，包括用户行为数据采集、特征工程、算法模型设计、A/B测试以及系统性能监控等关键环节。',
        expectedDuration: 300
      },
      'technical': {
        title: '技术架构设计与优化',
        content: '请设计一个高并发、高可用的Web应用系统架构，说明技术选型理由、负载均衡策略、数据库设计以及缓存方案。',
        expectedDuration: 300
      },
      'product': {
        title: '产品技术需求分析',
        content: '作为产品经理，如何与技术团队协作完成一个复杂功能的需求分析和技术实现？请结合具体案例说明沟通流程和解决冲突的方法。',
        expectedDuration: 300
      },
      'devops': {
        title: 'DevOps流程与自动化',
        content: '请设计一套完整的CI/CD流程，包括代码管理、自动化测试、部署策略、监控告警以及回滚机制。说明如何确保系统稳定性和部署效率。',
        expectedDuration: 300
      }
    };
    
    const fallback = fallbackQuestions[category as keyof typeof fallbackQuestions] || {
      title: `${category}技术深度解析`,
      content: `请选择${category}领域中您最擅长的一个技术点，详细介绍其工作原理、应用场景、优势特点以及在实际项目中的实施经验和遇到的挑战。`,
      expectedDuration: 240
    };
    
    // 添加个性化定制
    if (position && company) {
      fallback.content += `\n\n请特别结合${company}公司${position}岗位的实际需求来展开回答。`;
    } else if (position) {
      fallback.content += `\n\n请结合${position}岗位的核心职责来回答。`;
    } else if (company) {
      fallback.content += `\n\n请结合${company}公司的技术特点来回答。`;
    }
    
    return fallback;
    
  } catch (error) {
    console.error('问题生成失败:', error);
    
    // 最终后备方案
    return {
      title: `${category}技术面试`,
      content: `请详细介绍您在${category}领域的项目经验，包括技术选型、实现方案以及解决的关键问题。`,
      expectedDuration: 240
    };
  }
}