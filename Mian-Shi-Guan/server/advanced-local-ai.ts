// 增强版本地AI评测系统 - 完全免费，无需外部API
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

// 关键词词典 - 用于内容分析
const keywordDictionaries = {
  education: {
    positive: [
      '教学方法', '学生', '课堂管理', '教育理念', '因材施教', '启发式', '互动',
      '多媒体', '实践', '创新', '合作学习', '评估', '反思', '专业发展',
      '沟通', '耐心', '责任心', '爱心', '引导', '激发兴趣', '个性化'
    ],
    negative: [
      '不知道', '没想过', '随便', '无所谓', '不care', '不管', '懒得',
      '应付', '敷衍', '混日子', '无聊', '烦人', '讨厌'
    ],
    advanced: [
      '建构主义', '多元智能', '差异化教学', '项目式学习', 'STEAM教育',
      '翻转课堂', '同伴评议', '反思性实践', '行动研究', '循证教学'
    ]
  },
  preschool_education: {
    positive: [
      '儿童发展', '游戏', '观察记录', '家园合作', '环境创设', '安全',
      '情感支持', '社交技能', '语言发展', '创造力', '想象力', '艺术',
      '音乐', '运动', '生活技能', '习惯养成', '个体差异'
    ],
    negative: [
      '不知道', '没想过', '随便', '无所谓', '不care', '哭闹', '难管',
      '调皮', '不听话', '烦人', '幼稚'
    ],
    advanced: [
      '蒙台梭利', '华德福', '瑞吉欧', '高瞻课程', '多元发展评估',
      '支架式教学', '最近发展区', '观察学习', '同伴互动'
    ]
  },
  computer_science: {
    positive: [
      '编程', '算法', '数据结构', '项目', '开源', 'github', '调试',
      '优化', '架构', '设计模式', '敏捷开发', '团队协作', '代码审查',
      '测试', '文档', '学习能力', '解决问题', '创新思维'
    ],
    negative: [
      '不知道', '没学过', '不会', '太难', '放弃', 'copy', '抄袭',
      '混过去', '应付', '不理解'
    ],
    advanced: [
      '机器学习', '深度学习', '微服务', '容器化', 'DevOps', 'CI/CD',
      '云计算', '分布式系统', '区块链', '人工智能', '大数据'
    ]
  }
};

// 语言流畅度分析
function analyzeFluency(answer: string): number {
  const sentences = answer.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
  
  // 检查重复词汇
  const words = answer.split(/\s+/);
  const uniqueWords = new Set(words);
  const vocabularyRichness = uniqueWords.size / words.length;
  
  // 检查连接词使用
  const connectors = ['因为', '所以', '但是', '然而', '此外', '另外', '首先', '其次', '最后', '总之'];
  const connectorCount = connectors.filter(c => answer.includes(c)).length;
  
  let fluencyScore = 70; // 基础分数
  
  // 句子长度适中加分
  if (avgSentenceLength >= 10 && avgSentenceLength <= 30) {
    fluencyScore += 10;
  }
  
  // 词汇丰富度加分
  if (vocabularyRichness > 0.7) {
    fluencyScore += 10;
  }
  
  // 逻辑连接词使用加分
  fluencyScore += Math.min(connectorCount * 2, 10);
  
  return Math.min(fluencyScore, 100);
}

// 专业术语识别
function analyzeProfessionalTerms(answer: string, major: string): number {
  const keywords = keywordDictionaries[major as keyof typeof keywordDictionaries];
  if (!keywords) return 70;
  
  let score = 60;
  let positiveCount = 0;
  let negativeCount = 0;
  let advancedCount = 0;
  
  // 检查积极关键词
  keywords.positive.forEach(keyword => {
    if (answer.includes(keyword)) {
      positiveCount++;
      score += 2;
    }
  });
  
  // 检查消极关键词
  keywords.negative.forEach(keyword => {
    if (answer.includes(keyword)) {
      negativeCount++;
      score -= 5;
    }
  });
  
  // 检查高级术语
  if (keywords.advanced) {
    keywords.advanced.forEach(term => {
      if (answer.includes(term)) {
        advancedCount++;
        score += 5;
      }
    });
  }
  
  // 专业术语使用奖励
  if (positiveCount >= 3) score += 10;
  if (advancedCount >= 1) score += 15;
  
  return Math.max(10, Math.min(score, 100));
}

// 回答深度分析
function analyzeDepth(answer: string): number {
  let depthScore = 50;
  
  // 长度分析
  if (answer.length > 200) depthScore += 15;
  if (answer.length > 400) depthScore += 10;
  
  // 结构分析
  const hasExamples = /例如|比如|举例|案例|经历/.test(answer);
  const hasSteps = /首先|其次|然后|最后|第一|第二|第三/.test(answer);
  const hasReflection = /认为|觉得|感受|体会|反思|总结/.test(answer);
  
  if (hasExamples) depthScore += 15;
  if (hasSteps) depthScore += 10;
  if (hasReflection) depthScore += 10;
  
  // 多角度分析
  const perspectives = [
    /理论|概念|原理/, // 理论角度
    /实践|经验|操作/, // 实践角度
    /优点|缺点|利弊/, // 辩证思维
    /未来|发展|趋势/  // 前瞻性
  ];
  
  perspectives.forEach(pattern => {
    if (pattern.test(answer)) depthScore += 5;
  });
  
  return Math.min(depthScore, 100);
}

// 情感态度分析
function analyzeAttitude(answer: string): number {
  let attitudeScore = 70;
  
  // 积极态度词汇
  const positiveWords = [
    '热爱', '喜欢', '兴趣', '激情', '努力', '坚持', '学习', '成长',
    '挑战', '机会', '希望', '相信', '自信', '积极', '主动', '认真'
  ];
  
  // 消极态度词汇
  const negativeWords = [
    '讨厌', '厌烦', '无聊', '放弃', '算了', '不想', '懒得', '应付',
    '混', '凑合', '无所谓', '随便', '不care', '烦死了'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (answer.includes(word)) {
      positiveCount++;
      attitudeScore += 3;
    }
  });
  
  negativeWords.forEach(word => {
    if (answer.includes(word)) {
      negativeCount++;
      attitudeScore -= 8;
    }
  });
  
  // 语气分析
  const enthusiastic = /！/.test(answer);
  const questioning = /\?|？/.test(answer);
  
  if (enthusiastic) attitudeScore += 5;
  if (questioning && positiveCount > 0) attitudeScore += 3; // 积极的疑问
  
  return Math.max(10, Math.min(attitudeScore, 100));
}

// 生成个性化反馈
function generatePersonalizedFeedback(
  answer: string, 
  scores: any, 
  major?: string, 
  position?: string
): string {
  const feedbacks = [];
  
  if (scores.content >= 85) {
    feedbacks.push(`您的回答内容丰富，专业知识掌握扎实，展现了良好的${major}专业素养。`);
  } else if (scores.content >= 70) {
    feedbacks.push(`您的回答有一定的专业基础，建议进一步丰富专业知识的表达。`);
  } else {
    feedbacks.push(`建议加强${major}专业知识的学习，在回答中融入更多专业术语和概念。`);
  }
  
  if (scores.fluency >= 85) {
    feedbacks.push("语言表达流畅自然，逻辑清晰，沟通能力出色。");
  } else if (scores.fluency >= 70) {
    feedbacks.push("表达基本流畅，可以适当增加逻辑连接词的使用。");
  } else {
    feedbacks.push("建议多练习口语表达，提高语言的流畅度和逻辑性。");
  }
  
  if (scores.attitude >= 85) {
    feedbacks.push("展现出积极的工作态度和强烈的职业热情。");
  } else if (scores.attitude >= 70) {
    feedbacks.push("工作态度较为积极，可以进一步展现对职业的热情。");
  } else {
    feedbacks.push("建议培养更积极的工作态度，展现对专业领域的热爱。");
  }
  
  return feedbacks.join(" ");
}

// 生成改进建议
function generateImprovementSuggestions(scores: any, major?: string): string[] {
  const suggestions = [];
  
  if (scores.content < 80) {
    suggestions.push(`加强${major}专业知识学习，多阅读相关理论和案例`);
  }
  
  if (scores.fluency < 80) {
    suggestions.push("多练习口语表达，提高语言流畅度和逻辑性");
  }
  
  if (scores.confidence < 80) {
    suggestions.push("增强自信心，练习在公开场合表达观点");
  }
  
  if (scores.depth < 80) {
    suggestions.push("深化思考，多从不同角度分析问题");
  }
  
  if (scores.attitude < 80) {
    suggestions.push("培养积极主动的工作态度和职业热情");
  }
  
  return suggestions;
}

// 主评测函数
export async function evaluateInterviewResponse(
  answer: string,
  duration: number,
  expectedDuration: number,
  major?: string,
  position?: string
): Promise<InterviewEvaluation> {
  
  // 基础检查
  if (!answer || answer.trim().length < 10) {
    return {
      overallScore: 15,
      speechScore: 20,
      contentScore: 10,
      confidenceScore: 15,
      bodyLanguageScore: 60,
      strengths: ["完成了基本回答"],
      improvements: ["需要提供更详细和完整的回答", "建议深入思考问题后再回答"],
      detailedFeedback: "回答过于简短，缺乏具体内容。建议仔细思考问题，提供更详细的回答。",
      nextRecommendations: ["多练习面试题目", "准备充分的回答内容", "提高表达的完整性"]
    };
  }
  
  // 多维度评分
  const contentScore = analyzeProfessionalTerms(answer, major || 'general');
  const fluencyScore = analyzeFluency(answer);
  const depthScore = analyzeDepth(answer);
  const attitudeScore = analyzeAttitude(answer);
  
  // 时长评分
  const timeRatio = duration / expectedDuration;
  let speechScore = 75;
  if (timeRatio >= 0.7 && timeRatio <= 1.3) {
    speechScore += 15;
  } else if (timeRatio < 0.5) {
    speechScore -= 20;
  } else if (timeRatio > 2) {
    speechScore -= 10;
  }
  
  // 自信度评分（基于内容丰富度和语言确定性）
  const confidenceScore = Math.round((attitudeScore + depthScore) / 2);
  
  // 综合评分
  const overallScore = Math.round(
    (contentScore * 0.35 + fluencyScore * 0.25 + depthScore * 0.2 + 
     attitudeScore * 0.15 + speechScore * 0.05)
  );
  
  // 生成优势
  const strengths = [];
  if (contentScore >= 80) strengths.push("专业知识掌握扎实");
  if (fluencyScore >= 80) strengths.push("语言表达流畅自然");
  if (depthScore >= 80) strengths.push("思考深入，分析全面");
  if (attitudeScore >= 80) strengths.push("工作态度积极主动");
  if (speechScore >= 80) strengths.push("回答时长控制得当");
  
  if (strengths.length === 0) {
    strengths.push("完成了面试回答", "展现了基本的表达能力");
  }
  
  // 生成改进建议
  const improvements = generateImprovementSuggestions(
    { content: contentScore, fluency: fluencyScore, confidence: confidenceScore, 
      depth: depthScore, attitude: attitudeScore }, 
    major
  );
  
  // 生成详细反馈
  const detailedFeedback = generatePersonalizedFeedback(
    answer, 
    { content: contentScore, fluency: fluencyScore, attitude: attitudeScore },
    major, 
    position
  );
  
  // 生成后续建议
  const nextRecommendations = [
    "继续练习专业相关的面试题目",
    "多参与实际项目提升专业技能",
    "练习在不同场景下的表达能力",
    "定期进行自我反思和总结"
  ];
  
  return {
    overallScore: Math.max(10, Math.min(overallScore, 100)),
    speechScore: Math.max(10, Math.min(speechScore, 100)),
    contentScore: Math.max(10, Math.min(contentScore, 100)),
    confidenceScore: Math.max(10, Math.min(confidenceScore, 100)),
    bodyLanguageScore: Math.floor(Math.random() * 20) + 70, // 模拟值
    strengths,
    improvements,
    detailedFeedback,
    nextRecommendations
  };
}

// 生成面试问题
export async function generateInterviewQuestion(
  category: string, 
  difficulty: string, 
  major?: string, 
  position?: string
): Promise<{title: string, content: string, expectedDuration: number}> {
  
  // 使用question-generator的逻辑
  const { questionGenerator } = await import('./question-generator');
  const questions = questionGenerator.generateQuestions(major || category, 1);
  
  if (questions.length > 0) {
    return {
      title: questions[0].title,
      content: questions[0].content,
      expectedDuration: questions[0].expectedDuration
    };
  }
  
  // 后备问题
  return {
    title: `请结合${major}专业谈谈你的优势`,
    content: `请从专业知识、实践经验和个人特质等方面，谈谈你在${major}领域的优势和特点。`,
    expectedDuration: 180
  };
}