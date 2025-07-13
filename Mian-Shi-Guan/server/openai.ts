import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface InterviewEvaluation {
  overallScore: number;
  speechScore: number;
  contentScore: number;
  confidenceScore: number;
  bodyLanguageScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  nextRecommendations: string[];
}

export async function evaluateInterviewResponse(
  question: string,
  answer: string,
  duration: number,
  category: string,
  major?: string,
  position?: string
): Promise<InterviewEvaluation> {
  try {
    const prompt = `
你是一位资深的面试官，请对以下面试回答进行专业评估：

面试信息：
- 问题类型：${category}
- 专业背景：${major || '未指定'}
- 应聘岗位：${position || '未指定'}
- 面试问题：${question}
- 候选人回答：${answer}
- 回答时长：${duration}秒

评估要求：
1. 请仔细分析回答内容的质量和相关性
2. 如果回答"不会"、"不知道"或内容空洞，应给予较低分数
3. 根据专业背景和岗位要求调整评分标准
4. 考虑回答的逻辑性、完整性和专业性

评分维度（每项0-100分）：
- 内容质量：回答的准确性、完整性、专业性
- 表达能力：语言组织、逻辑清晰度、流畅性
- 专业匹配：回答与岗位、专业的匹配程度
- 信心表现：表达的自信度和积极性

特别注意：
- 如果回答"不会"或"不知道"，内容质量应给予20-40分
- 空洞、无关的回答应得到相应的低分
- 优秀的回答应体现专业知识和思考深度

请返回JSON格式，包含：
{
  "overallScore": 综合评分(0-100),
  "contentScore": 内容质量分数(0-100),
  "speechScore": 表达能力分数(0-100),
  "professionalScore": 专业匹配分数(0-100),
  "confidenceScore": 信心表现分数(0-100),
  "strengths": ["优点1", "优点2", "优点3"],
  "improvements": ["改进建议1", "改进建议2", "改进建议3"],
  "detailedFeedback": "详细反馈文字(100-200字)",
  "nextRecommendations": ["学习建议1", "学习建议2", "学习建议3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是一位经验丰富的面试评估专家，专门为高校学生提供专业的面试指导和评估。请提供建设性的、具体的反馈建议。返回JSON格式的结果。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overallScore: Math.max(0, Math.min(100, Math.round(result.overallScore || 60))),
      speechScore: Math.max(0, Math.min(100, Math.round(result.speechScore || result.speechScore === 0 ? 0 : 60))),
      contentScore: Math.max(0, Math.min(100, Math.round(result.contentScore || result.contentScore === 0 ? 0 : 60))),
      confidenceScore: Math.max(0, Math.min(100, Math.round(result.confidenceScore || result.confidenceScore === 0 ? 0 : 60))),
      bodyLanguageScore: Math.max(0, Math.min(100, Math.round(result.professionalScore || result.professionalScore === 0 ? 0 : 60))),
      strengths: Array.isArray(result.strengths) ? result.strengths : ["表达基本清晰"],
      improvements: Array.isArray(result.improvements) ? result.improvements : ["需要提供更具体的回答", "增强专业知识储备", "提升表达的逻辑性"],
      detailedFeedback: result.detailedFeedback || "回答需要更多深度和专业性，建议结合具体案例和专业知识来丰富答案内容。",
      nextRecommendations: Array.isArray(result.nextRecommendations) ? result.nextRecommendations : ["加强专业知识学习", "练习结构化表达", "准备相关案例"]
    };
  } catch (error) {
    console.error("AI evaluation failed:", error);
    
    // Fallback evaluation if AI fails
    return {
      overallScore: 75,
      speechScore: 75,
      contentScore: 75,
      confidenceScore: 75,
      bodyLanguageScore: 75,
      strengths: ["回答内容相关", "表达较为清晰"],
      improvements: ["可以增加更多具体例子", "注意回答的逻辑结构"],
      detailedFeedback: "由于技术原因，本次评估采用了基础评分。建议继续练习以提升面试技能。",
      nextRecommendations: ["练习STAR法则", "准备更多实例", "提升语言表达能力"]
    };
  }
}

export async function generateInterviewQuestion(category: string, difficulty: string, major?: string, position?: string, company?: string): Promise<{title: string, content: string, expectedDuration: number}> {
  try {
    const prompt = `
请为${category}类型的面试生成一个${difficulty}难度的专业面试问题。

候选人信息：
- 专业背景：${major || '通用'}
- 应聘岗位：${position || '通用岗位'}
- 目标公司：${company || '互联网公司'}

要求：
1. 问题必须与候选人的专业背景和应聘岗位高度相关
2. 体现岗位的核心技能要求
3. 适合中国高校学生的知识水平
4. 问题要具体、实用，能检验真实能力
5. 符合当前行业发展趋势

问题类型说明：
- technical: 专业技术问题，考查专业知识和技能
- behavioral: 行为面试问题，考查软技能和经历
- case_study: 案例分析问题，考查解决问题能力
- comprehensive: 综合性问题，结合多个方面

请以JSON格式返回：
{
  "title": "问题标题",
  "content": "详细问题内容(包含具体场景和要求)",
  "expectedDuration": 回答时长（秒，根据问题复杂度设定）
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是一位专业的面试官，专门为高校学生设计合适的面试问题。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "请介绍一下你自己",
      content: result.content || "请简单介绍一下你自己，包括你的专业背景、兴趣爱好和职业规划。",
      expectedDuration: result.expectedDuration || 180
    };
  } catch (error) {
    console.error("Question generation failed:", error);
    return {
      title: "请介绍一下你自己",
      content: "请简单介绍一下你自己，包括你的专业背景、兴趣爱好和职业规划。",
      expectedDuration: 180
    };
  }
}
