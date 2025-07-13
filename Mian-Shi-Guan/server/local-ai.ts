// 本地AI替代方案 - 不依赖外部API服务
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

// 基于专业和岗位的题库
const questionDatabase = {
  // 教育专业题库
  education: {
    teacher: [
      {
        title: "如何处理课堂上学生的突发状况？",
        content: "请描述一个具体的情况，比如学生在课堂上发生冲突，你会如何处理？",
        expectedDuration: 180
      },
      {
        title: "你如何激发学生的学习兴趣？",
        content: "请结合具体的教学方法，说明如何让学生主动参与课堂学习。",
        expectedDuration: 200
      },
      {
        title: "如何与家长有效沟通？",
        content: "当学生在学校表现不佳时，你会如何与家长沟通并制定改进计划？",
        expectedDuration: 180
      },
      {
        title: "请描述你的教学理念和方法",
        content: "作为一名教师，你认为最重要的教学原则是什么？请结合具体例子说明你的教学方法。",
        expectedDuration: 240
      },
      {
        title: "如何进行差异化教学？",
        content: "面对学习能力不同的学生，你会如何调整教学策略以确保每个学生都能有所收获？",
        expectedDuration: 200
      },
      {
        title: "如何运用现代技术辅助教学？",
        content: "请说明你会如何在课堂中使用多媒体、网络等现代技术来提升教学效果。",
        expectedDuration: 180
      },
      {
        title: "处理学生学习困难的策略",
        content: "当发现学生在某个知识点上反复出错时，你会采取什么措施帮助他们？",
        expectedDuration: 200
      },
      {
        title: "如何建立良好的师生关系？",
        content: "请分享你建立和维护良好师生关系的方法和经验。",
        expectedDuration: 180
      }
    ],
    education_admin: [
      {
        title: "如何提升学校的教学质量？",
        content: "作为教育管理者，你会采取哪些具体措施来提升整体教学水平？",
        expectedDuration: 240
      },
      {
        title: "如何处理教师之间的工作分歧？",
        content: "当教师团队在教学理念上存在分歧时，你会如何协调？",
        expectedDuration: 200
      }
    ]
  },
  
  preschool_education: {
    preschool_teacher: [
      {
        title: "如何设计适合3-6岁儿童的游戏活动？",
        content: "请描述一个具体的游戏活动设计，说明如何通过游戏促进儿童发展。",
        expectedDuration: 200
      },
      {
        title: "如何处理幼儿的分离焦虑？",
        content: "新入园的幼儿经常出现哭闹，不愿与家长分离，你会如何帮助他们适应？",
        expectedDuration: 180
      },
      {
        title: "如何观察和记录幼儿的发展情况？",
        content: "请说明你会关注幼儿发展的哪些方面，以及如何进行有效记录。",
        expectedDuration: 200
      },
      {
        title: "如何培养幼儿的社交能力？",
        content: "请描述你会采用哪些方法帮助幼儿学会与同伴友好相处和合作。",
        expectedDuration: 180
      },
      {
        title: "如何创设适宜的学习环境？",
        content: "请说明你会如何布置和管理幼儿园教室，以促进幼儿的学习和发展。",
        expectedDuration: 200
      },
      {
        title: "如何处理幼儿的行为问题？",
        content: "当幼儿出现攻击性行为或不遵守规则时，你会采取什么策略？",
        expectedDuration: 180
      },
      {
        title: "如何开展幼儿艺术教育活动？",
        content: "请设计一个美术或音乐活动，说明如何激发幼儿的创造力和想象力。",
        expectedDuration: 240
      },
      {
        title: "如何与家长建立良好的合作关系？",
        content: "请分享你与家长沟通合作的方法，以及如何处理家长的不同意见。",
        expectedDuration: 200
      }
    ],
    early_childhood_educator: [
      {
        title: "如何设计0-3岁婴幼儿的早期教育课程？",
        content: "请结合婴幼儿发展特点，设计一个具体的早教活动方案。",
        expectedDuration: 240
      }
    ]
  },

  // 商科专业题库
  business: {
    management_trainee: [
      {
        title: "如何带领团队完成一个具有挑战性的项目？",
        content: "请描述你的项目管理方法和团队协调策略。",
        expectedDuration: 240
      },
      {
        title: "面对市场变化，你会如何调整业务策略？",
        content: "请结合具体案例说明你的分析思路和应对方案。",
        expectedDuration: 200
      }
    ],
    marketing_specialist: [
      {
        title: "如何为新产品制定营销策略？",
        content: "请选择一个产品类型，详细说明你的市场分析和推广方案。",
        expectedDuration: 300
      },
      {
        title: "如何利用社交媒体进行品牌推广？",
        content: "请描述你会选择哪些平台以及具体的内容策略。",
        expectedDuration: 180
      }
    ]
  },

  // 计算机专业题库
  computer_science: {
    frontend_dev: [
      {
        title: "如何优化网页加载性能？",
        content: "请从技术角度说明你会采用哪些方法来提升用户体验。",
        expectedDuration: 240
      },
      {
        title: "描述一个你开发过的前端项目",
        content: "请详细介绍项目的技术栈、遇到的挑战以及解决方案。",
        expectedDuration: 300
      }
    ],
    backend_dev: [
      {
        title: "如何设计一个高并发的后端系统？",
        content: "请从架构设计、数据库优化等方面说明你的设计思路。",
        expectedDuration: 300
      }
    ]
  },

  // 文科专业题库
  chinese_literature: {
    editor: [
      {
        title: "如何提升文章的可读性和影响力？",
        content: "请从编辑的角度说明你会如何优化一篇文章。",
        expectedDuration: 200
      }
    ],
    chinese_teacher: [
      {
        title: "如何培养学生的语文素养？",
        content: "请结合具体的教学方法，说明如何提升学生的阅读和写作能力。",
        expectedDuration: 240
      }
    ]
  }
};

// 通用题库（适用于所有专业）
const generalQuestions = [
  {
    title: "请介绍一下你自己",
    content: "请简要介绍你的教育背景、技能特长和职业目标。",
    expectedDuration: 120
  },
  {
    title: "你的优势和不足是什么？",
    content: "请诚实地分析你的个人优势和需要改进的地方。",
    expectedDuration: 180
  },
  {
    title: "为什么选择我们公司？",
    content: "请说明你对我们公司的了解以及选择我们的原因。",
    expectedDuration: 150
  },
  {
    title: "你的职业规划是什么？",
    content: "请描述你未来3-5年的职业发展计划。",
    expectedDuration: 180
  },
  {
    title: "描述一次你克服困难的经历",
    content: "请用STAR法则（情境、任务、行动、结果）来描述。",
    expectedDuration: 240
  }
];

export async function generateInterviewQuestion(
  category: string, 
  difficulty: string, 
  major?: string, 
  position?: string
): Promise<{title: string, content: string, expectedDuration: number}> {
  
  // 根据专业和岗位获取相关题目
  if (major && position) {
    const majorKey = major as keyof typeof questionDatabase;
    if (questionDatabase[majorKey]) {
      const majorQuestions = questionDatabase[majorKey];
      const positionKey = position as keyof typeof majorQuestions;
      if (majorQuestions[positionKey]) {
        const questions = majorQuestions[positionKey] as Array<{title: string, content: string, expectedDuration: number}>;
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        return randomQuestion;
      }
    }
  }

  // 如果没有专业相关题目，使用通用题库
  const randomGeneral = generalQuestions[Math.floor(Math.random() * generalQuestions.length)];
  return randomGeneral;
}

// 本地评分算法
export async function evaluateInterviewResponse(
  question: string,
  answer: string,
  duration: number,
  expectedDuration: number,
  major?: string,
  position?: string
): Promise<InterviewEvaluation> {
  
  // 基础分数计算
  let contentScore = calculateContentScore(answer);
  let speechScore = calculateSpeechScore(answer, duration, expectedDuration);
  let confidenceScore = calculateConfidenceScore(answer);
  
  // 综合评分
  const overallScore = Math.round((contentScore + speechScore + confidenceScore) / 3);
  
  // 生成反馈
  const strengths = generateStrengths(contentScore, speechScore, confidenceScore);
  const improvements = generateImprovements(contentScore, speechScore, confidenceScore);
  const detailedFeedback = generateDetailedFeedback(answer, major, position);
  const nextRecommendations = generateRecommendations(improvements);

  return {
    overallScore,
    speechScore,
    contentScore,
    confidenceScore,
    bodyLanguageScore: Math.random() * 20 + 70, // 模拟值，实际需要视频分析
    strengths,
    improvements,
    detailedFeedback,
    nextRecommendations
  };
}

function calculateContentScore(answer: string): number {
  if (!answer || answer.trim().length === 0) return 0;
  
  const normalizedAnswer = answer.toLowerCase().trim();
  
  // 检查明显的消极回答，直接给低分
  const negativePatterns = [
    '不知道', '不会', '没有', '不清楚', '不了解', '不懂', 
    '不太清楚', '不太了解', '不太懂', '没做过', '没有经验',
    '不确定', '说不上来', '想不出来', '没想过'
  ];
  
  const hasNegativeResponse = negativePatterns.some(pattern => 
    normalizedAnswer.includes(pattern)
  );
  
  if (hasNegativeResponse) {
    // 如果包含消极词汇，但回答较长且有其他内容，给予部分分数
    const wordCount = answer.trim().split(/\s+/).length;
    if (wordCount > 20) {
      return Math.max(25, Math.min(35, wordCount / 10)); // 25-35分
    } else {
      return Math.max(10, wordCount); // 10-20分
    }
  }
  
  // 基于回答长度的评分
  const wordCount = answer.trim().split(/\s+/).length;
  let score = 0;
  
  if (wordCount < 10) {
    score = 20; // 回答太简短
  } else if (wordCount < 30) {
    score = 40; // 回答偏短
  } else if (wordCount < 80) {
    score = 60; // 回答适中
  } else {
    score = 70; // 回答详细
  }
  
  // 关键词加分
  const positiveKeywords = [
    '经验', '学习', '团队', '责任', '目标', '计划', '解决', '改进', 
    '专业', '技能', '能力', '成果', '成功', '挑战', '创新', '合作',
    '沟通', '领导', '分析', '思考', '理解', '掌握', '熟悉', '擅长'
  ];
  
  const keywordCount = positiveKeywords.filter(keyword => 
    normalizedAnswer.includes(keyword)
  ).length;
  
  score += Math.min(keywordCount * 3, 20); // 最多加20分
  
  // 检查是否有具体例子或数据
  if (normalizedAnswer.includes('例如') || normalizedAnswer.includes('比如') || 
      normalizedAnswer.includes('项目') || /\d+/.test(answer)) {
    score += 10; // 有具体例子加10分
  }
  
  return Math.min(Math.round(score), 100);
}

function calculateSpeechScore(answer: string, duration: number, expectedDuration: number): number {
  if (duration === 0) return 50; // 如果没有语音，给中等分
  
  const wordsPerSecond = answer.trim().split(/\s+/).length / duration;
  let score = 70; // 基础分
  
  // 语速评分（理想语速：1-3字/秒）
  if (wordsPerSecond >= 1 && wordsPerSecond <= 3) {
    score += 20;
  } else if (wordsPerSecond < 0.5 || wordsPerSecond > 5) {
    score -= 20;
  }
  
  // 时长适宜性
  const durationRatio = duration / expectedDuration;
  if (durationRatio >= 0.7 && durationRatio <= 1.3) {
    score += 10;
  } else if (durationRatio < 0.3 || durationRatio > 2) {
    score -= 15;
  }
  
  return Math.max(Math.min(Math.round(score), 100), 0);
}

function calculateConfidenceScore(answer: string): number {
  let score = 70; // 基础分
  
  // 积极表达加分
  const confidenceWords = ['相信', '确信', '擅长', '有信心', '能够', '会', '可以'];
  const confidenceCount = confidenceWords.filter(word => answer.includes(word)).length;
  score += confidenceCount * 8;
  
  // 消极表达减分
  const hesitationWords = ['可能', '也许', '大概', '应该', '或许', '不太确定'];
  const hesitationCount = hesitationWords.filter(word => answer.includes(word)).length;
  score -= hesitationCount * 5;
  
  return Math.max(Math.min(Math.round(score), 100), 0);
}

function generateStrengths(contentScore: number, speechScore: number, confidenceScore: number): string[] {
  const strengths = [];
  
  if (contentScore >= 85) {
    strengths.push("回答内容深入且具有专业性，展现了扎实的知识基础");
  } else if (contentScore >= 75) {
    strengths.push("回答内容较为充实，逻辑结构清晰");
  } else if (contentScore >= 65) {
    strengths.push("具备基本的专业知识储备");
  }
  
  if (speechScore >= 85) {
    strengths.push("语言表达流畅自然，语速控制得当，体现优秀的沟通能力");
  } else if (speechScore >= 75) {
    strengths.push("表达基本流畅，时间控制较好");
  } else if (speechScore >= 65) {
    strengths.push("能够完整表达自己的观点");
  }
  
  if (confidenceScore >= 85) {
    strengths.push("展现出强烈的自信心和积极的工作态度");
  } else if (confidenceScore >= 75) {
    strengths.push("表现较为自信，态度端正");
  } else if (confidenceScore >= 65) {
    strengths.push("态度认真，愿意积极回答问题");
  }
  
  // 综合表现评价
  const avgScore = (contentScore + speechScore + confidenceScore) / 3;
  if (avgScore >= 80) {
    strengths.push("整体表现优秀，具备进入心仪企业的潜力");
  } else if (avgScore >= 70) {
    strengths.push("面试表现良好，在校招中具有竞争优势");
  }
  
  return strengths.length > 0 ? strengths : ["积极参与面试过程，展现了学习意愿"];
}

function generateImprovements(contentScore: number, speechScore: number, confidenceScore: number): string[] {
  const improvements = [];
  
  if (contentScore < 60) improvements.push("需要加强专业知识储备，丰富回答内容");
  if (speechScore < 60) improvements.push("注意语速控制，提升表达的清晰度");
  if (confidenceScore < 60) improvements.push("增强自信心，避免过多的不确定表达");
  if (contentScore < 80) improvements.push("可以通过具体案例让回答更有说服力");
  if (speechScore < 80) improvements.push("适当调整语调，让表达更有感染力");
  
  return improvements.length > 0 ? improvements : ["继续保持，可以更加自信地表达观点"];
}

function generateDetailedFeedback(answer: string, major?: string, position?: string): string {
  const sentences = answer.split(/[。！？]/).filter(s => s.trim().length > 0);
  const hasExamples = answer.includes('例如') || answer.includes('比如') || answer.includes('举例') || answer.includes('案例');
  const hasStructure = answer.includes('首先') || answer.includes('其次') || answer.includes('最后') || answer.includes('第一') || answer.includes('第二');
  const hasQuantitativeData = /\d+%|\d+倍|\d+年|\d+个月/.test(answer);
  const hasPersonalExperience = answer.includes('我') && (answer.includes('经历') || answer.includes('参与') || answer.includes('负责'));
  
  let feedback = [];
  
  // 内容深度分析
  if (sentences.length >= 5 && hasExamples) {
    feedback.push("✓ 回答内容充实，举例恰当，体现了良好的表达能力");
  } else if (sentences.length < 3) {
    feedback.push("○ 建议增加回答深度，可以从多个角度分析问题");
  }
  
  // 结构逻辑分析
  if (hasStructure) {
    feedback.push("✓ 回答逻辑清晰，层次分明，体现了良好的思维条理");
  } else {
    feedback.push("○ 建议采用'首先-其次-最后'的结构来组织回答，提升逻辑性");
  }
  
  // 专业性分析
  if (hasQuantitativeData) {
    feedback.push("✓ 使用了具体数据支撑观点，增强了说服力");
  }
  
  if (hasPersonalExperience) {
    feedback.push("✓ 结合个人经历回答，真实可信，符合面试官期望");
  } else {
    feedback.push("○ 建议结合个人实际经历或项目经验来回答");
  }
  
  // 专业相关建议
  const professionalAdvice = getProfessionalAdvice(major, answer);
  if (professionalAdvice) {
    feedback.push(professionalAdvice);
  }
  
  // 面试技巧建议
  feedback.push("💡 面试建议：保持自信的语调，适当的停顿有助于思考和表达");
  
  return feedback.join('\n');
}

function getProfessionalAdvice(major?: string, answer?: string): string {
  if (!major) return "";
  
  switch (major) {
    case 'computer_science':
    case 'software_engineering':
      if (!answer?.includes('技术') && !answer?.includes('项目') && !answer?.includes('代码')) {
        return "○ 建议结合具体的技术栈、编程语言或项目经验来回答";
      }
      return "✓ 体现了良好的技术思维";
      
    case 'business':
    case 'marketing':
      if (!answer?.includes('市场') && !answer?.includes('商业') && !answer?.includes('客户')) {
        return "○ 建议从商业角度分析，如市场环境、客户需求等";
      }
      return "✓ 展现了商业思维能力";
      
    case 'education':
    case 'preschool_education':
      if (!answer?.includes('学生') && !answer?.includes('教学') && !answer?.includes('教育')) {
        return "○ 建议结合教育理论和实际教学场景来回答";
      }
      return "✓ 展现了教育工作者的专业思考";
      
    case 'finance':
    case 'accounting':
      if (!answer?.includes('财务') && !answer?.includes('金融') && !answer?.includes('数据')) {
        return "○ 建议从财务分析和风险控制角度思考问题";
      }
      return "✓ 体现了金融专业素养";
      
    case 'engineering':
    case 'mechanical':
      if (!answer?.includes('设计') && !answer?.includes('方案') && !answer?.includes('技术')) {
        return "○ 建议从工程设计和技术方案角度分析问题";
      }
      return "✓ 体现了工程思维和解决问题的能力";
      
    default:
      return "○ 建议结合专业背景和实践经验来丰富回答内容";
  }
}

function generateRecommendations(improvements: string[]): string[] {
  const baseRecommendations = [
    "使用STAR法则(情境-任务-行动-结果)来组织回答结构",
    "准备3-5个具体的项目经历或实习案例",
    "关注目标行业的最新发展趋势和热点话题",
    "练习常见面试问题，提前准备标准答案框架"
  ];
  
  const specificRecommendations = [];
  
  if (improvements.some(imp => imp.includes('专业知识') || imp.includes('内容'))) {
    specificRecommendations.push(
      "深入学习专业核心技能，考虑获得相关行业认证",
      "通过实习、项目实践来积累专业经验",
      "阅读行业报告和专业书籍，丰富知识储备"
    );
  }
  
  if (improvements.some(imp => imp.includes('表达') || imp.includes('语速'))) {
    specificRecommendations.push(
      "参加演讲社团或辩论队提升口语表达能力",
      "录制自己的模拟面试视频，反复练习和改进",
      "与同学进行模拟面试练习，互相反馈"
    );
  }
  
  if (improvements.some(imp => imp.includes('自信') || imp.includes('态度'))) {
    specificRecommendations.push(
      "通过成功的小目标建立自信心",
      "学习正面的自我表达技巧",
      "参加社团活动增强人际交往能力"
    );
  }
  
  // 针对中国校招的特殊建议
  const chinaSpecificAdvice = [
    "准备简洁有力的一分钟自我介绍",
    "了解目标企业的企业文化和价值观",
    "关注校招时间节点，提前准备简历和作品集"
  ];
  
  return [...baseRecommendations, ...specificRecommendations, ...chinaSpecificAdvice].slice(0, 8);
}