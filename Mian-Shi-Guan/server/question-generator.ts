// 专业化题目生成器，针对中国大学生就业面试
export class QuestionGenerator {
  private usedQuestions = new Set<string>();
  
  // 通用校招面试题库
  private generalQuestions = [
    {
      title: "请简单介绍一下自己",
      content: "请用2-3分钟时间介绍你的基本情况、专业背景、实习经历和个人特长。",
      expectedDuration: 180,
      category: "general"
    },
    {
      title: "为什么选择我们公司？",
      content: "请说明你对我们公司的了解，以及为什么想要加入我们公司工作。",
      expectedDuration: 120,
      category: "general"
    },
    {
      title: "你的职业规划是什么？",
      content: "请谈谈你对未来3-5年的职业发展规划和目标。",
      expectedDuration: 150,
      category: "general"
    },
    {
      title: "描述一次克服困难的经历",
      content: "请分享一个你在学习或实践中遇到挫折并成功克服的具体案例。",
      expectedDuration: 200,
      category: "general"
    },
    {
      title: "你认为自己的优势和不足是什么？",
      content: "请客观分析自己的优势和需要改进的地方，以及你如何提升自己。",
      expectedDuration: 180,
      category: "general"
    },
    {
      title: "如何处理工作中的压力？",
      content: "当面临紧急项目或工作压力时，你会如何调整状态和管理时间？",
      expectedDuration: 150,
      category: "general"
    },
    {
      title: "描述一次团队合作的经历",
      content: "请分享一个你参与团队项目的经历，你在其中承担了什么角色？",
      expectedDuration: 200,
      category: "general"
    }
  ];

  // 教育学专业题库
  private educationQuestions = [
    {
      title: "如何处理课堂上学生的突发状况？",
      content: "请描述一个具体的情况，比如学生在课堂上发生冲突，你会如何处理？",
      expectedDuration: 180,
      category: "education"
    },
    {
      title: "你如何激发学生的学习兴趣？",
      content: "请结合具体的教学方法，说明如何让学生主动参与课堂学习。",
      expectedDuration: 200,
      category: "education"
    },
    {
      title: "如何与家长有效沟通？",
      content: "当学生在学校表现不佳时，你会如何与家长沟通并制定改进计划？",
      expectedDuration: 180,
      category: "education"
    },
    {
      title: "请描述你的教学理念和方法",
      content: "作为一名教师，你认为最重要的教学原则是什么？请结合具体例子说明你的教学方法。",
      expectedDuration: 240,
      category: "education"
    },
    {
      title: "如何进行差异化教学？",
      content: "面对学习能力不同的学生，你会如何调整教学策略以确保每个学生都能有所收获？",
      expectedDuration: 200,
      category: "education"
    },
    {
      title: "如何运用现代技术辅助教学？",
      content: "请说明你会如何在课堂中使用多媒体、网络等现代技术来提升教学效果。",
      expectedDuration: 180,
      category: "education"
    },
    {
      title: "处理学生学习困难的策略",
      content: "当发现学生在某个知识点上反复出错时，你会采取什么措施帮助他们？",
      expectedDuration: 200,
      category: "education"
    },
    {
      title: "如何建立良好的师生关系？",
      content: "请分享你建立和维护良好师生关系的方法和经验。",
      expectedDuration: 180,
      category: "education"
    },
    {
      title: "如何进行有效的课堂管理？",
      content: "请描述你会如何维持课堂秩序，创造良好的学习环境。",
      expectedDuration: 190,
      category: "education"
    },
    {
      title: "你如何评估学生的学习成果？",
      content: "除了传统考试，你会采用哪些方式来全面评估学生的学习情况？",
      expectedDuration: 200,
      category: "education"
    }
  ];

  // 学前教育专业题库
  private preschoolQuestions = [
    {
      title: "如何设计适合3-6岁儿童的游戏活动？",
      content: "请描述一个具体的游戏活动设计，说明如何通过游戏促进儿童发展。",
      expectedDuration: 200,
      category: "preschool_education"
    },
    {
      title: "如何处理幼儿的分离焦虑？",
      content: "新入园的幼儿经常出现哭闹，不愿与家长分离，你会如何帮助他们适应？",
      expectedDuration: 180,
      category: "preschool_education"
    },
    {
      title: "如何观察和记录幼儿的发展情况？",
      content: "请说明你会关注幼儿发展的哪些方面，以及如何进行有效记录。",
      expectedDuration: 200,
      category: "preschool_education"
    },
    {
      title: "如何培养幼儿的社交能力？",
      content: "请描述你会采用哪些方法帮助幼儿学会与同伴友好相处和合作。",
      expectedDuration: 180,
      category: "preschool_education"
    },
    {
      title: "如何创设适宜的学习环境？",
      content: "请说明你会如何布置和管理幼儿园教室，以促进幼儿的学习和发展。",
      expectedDuration: 200,
      category: "preschool_education"
    },
    {
      title: "如何处理幼儿的行为问题？",
      content: "当幼儿出现攻击性行为或不遵守规则时，你会采取什么策略？",
      expectedDuration: 180,
      category: "preschool_education"
    },
    {
      title: "如何开展幼儿艺术教育活动？",
      content: "请设计一个美术或音乐活动，说明如何激发幼儿的创造力和想象力。",
      expectedDuration: 240,
      category: "preschool_education"
    },
    {
      title: "如何与家长建立良好的合作关系？",
      content: "请分享你与家长沟通合作的方法，以及如何处理家长的不同意见。",
      expectedDuration: 200,
      category: "preschool_education"
    },
    {
      title: "如何促进幼儿语言发展？",
      content: "请说明你会采用哪些活动和方法来提升幼儿的语言表达能力。",
      expectedDuration: 190,
      category: "preschool_education"
    },
    {
      title: "如何培养幼儿的自理能力？",
      content: "请描述你会如何帮助幼儿养成良好的生活习惯和自理能力。",
      expectedDuration: 180,
      category: "preschool_education"
    }
  ];

  // 计算机科学题库
  private computerScienceQuestions = [
    {
      title: "请介绍一个你完成的编程项目",
      content: "请详细描述一个你参与或独立完成的编程项目，包括技术栈、遇到的挑战和解决方案。",
      expectedDuration: 240,
      category: "computer_science"
    },
    {
      title: "如何优化程序性能？",
      content: "请谈谈你在编程中如何发现和解决性能问题，有哪些常用的优化策略？",
      expectedDuration: 200,
      category: "computer_science"
    },
    {
      title: "你对哪种编程语言最熟悉？",
      content: "请选择一种你最熟悉的编程语言，说明它的特点和你使用它的经验。",
      expectedDuration: 180,
      category: "computer_science"
    },
    {
      title: "如何设计一个数据库？",
      content: "假设要为一个电商网站设计数据库，你会考虑哪些表结构和关系？",
      expectedDuration: 200,
      category: "computer_science"
    },
    {
      title: "前端和后端的区别是什么？",
      content: "请说明前端开发和后端开发的职责分工，以及你更偏向哪个方向？",
      expectedDuration: 150,
      category: "computer_science"
    },
    {
      title: "如何确保代码质量？",
      content: "请分享你在项目开发中如何保证代码质量，包括测试、代码审查等方面。",
      expectedDuration: 180,
      category: "computer_science"
    }
  ];

  // 工商管理题库
  private businessQuestions = [
    {
      title: "如何分析市场竞争环境？",
      content: "请说明你会采用哪些方法来分析一个行业的竞争状况和市场机会。",
      expectedDuration: 200,
      category: "business"
    },
    {
      title: "描述一次成功的团队领导经历",
      content: "请分享一个你担任团队负责人的经历，你是如何协调团队完成目标的？",
      expectedDuration: 180,
      category: "business"
    },
    {
      title: "如何制定商业计划？",
      content: "假设要开展一个新业务，你会如何制定详细的商业计划和实施策略？",
      expectedDuration: 240,
      category: "business"
    },
    {
      title: "你如何理解企业文化？",
      content: "请谈谈企业文化对组织发展的重要性，以及如何建设良好的企业文化。",
      expectedDuration: 150,
      category: "business"
    },
    {
      title: "如何进行成本控制？",
      content: "在企业运营中，你认为应该如何有效控制成本并提高运营效率？",
      expectedDuration: 180,
      category: "business"
    }
  ];

  // 市场营销题库
  private marketingQuestions = [
    {
      title: "如何制定营销策略？",
      content: "请描述一个完整的营销策略制定过程，包括目标受众分析和渠道选择。",
      expectedDuration: 200,
      category: "marketing"
    },
    {
      title: "数字化营销的重要性",
      content: "请谈谈社交媒体和数字化平台在现代营销中的作用和优势。",
      expectedDuration: 180,
      category: "marketing"
    },
    {
      title: "如何分析消费者行为？",
      content: "请说明你会通过哪些方法来了解和分析目标消费者的需求和偏好。",
      expectedDuration: 190,
      category: "marketing"
    },
    {
      title: "品牌建设的关键要素",
      content: "你认为成功的品牌建设需要考虑哪些关键因素？请举例说明。",
      expectedDuration: 180,
      category: "marketing"
    },
    {
      title: "如何衡量营销效果？",
      content: "请分享你会使用哪些指标和方法来评估营销活动的成效。",
      expectedDuration: 150,
      category: "marketing"
    }
  ];

  // 电子工程题库
  private engineeringQuestions = [
    {
      title: "请介绍一个你参与的工程项目",
      content: "请详细描述一个你参与设计或实施的工程项目，包括技术方案和解决的问题。",
      expectedDuration: 240,
      category: "engineering"
    },
    {
      title: "如何进行电路设计和优化？",
      content: "请说明你在电路设计中的思路和方法，如何确保电路的稳定性和效率。",
      expectedDuration: 200,
      category: "engineering"
    },
    {
      title: "新技术在工程中的应用",
      content: "请谈谈物联网、人工智能等新技术在电子工程领域的应用前景。",
      expectedDuration: 180,
      category: "engineering"
    },
    {
      title: "工程项目的质量控制",
      content: "在工程项目实施过程中，你会采用哪些方法来确保项目质量？",
      expectedDuration: 180,
      category: "engineering"
    },
    {
      title: "如何解决技术难题？",
      content: "当在工程项目中遇到技术瓶颈时，你会采用什么方法来分析和解决问题？",
      expectedDuration: 180,
      category: "engineering"
    }
  ];

  generateQuestions(major: string, count: number): Array<{title: string, content: string, expectedDuration: number, category: string}> {
    let questionPool: any[] = [];
    
    switch (major) {
      case "general":
        questionPool = [...this.generalQuestions];
        break;
      case "education":
        questionPool = [...this.educationQuestions];
        break;
      case "preschool_education":
        questionPool = [...this.preschoolQuestions];
        break;
      case "computer_science":
        questionPool = [...this.computerScienceQuestions];
        break;
      case "business":
        questionPool = [...this.businessQuestions];
        break;
      case "marketing":
        questionPool = [...this.marketingQuestions];
        break;
      case "engineering":
        questionPool = [...this.engineeringQuestions];
        break;
      default:
        // 通用题库
        questionPool = [
          {
            title: `请结合${major}专业背景介绍一下你自己`,
            content: `请简要介绍一下你的${major}专业学习经历、相关实践经验和个人特点。`,
            expectedDuration: 150,
            category: major
          },
          {
            title: `你对这个职位的理解是什么？`,
            content: `请谈谈你对这个工作职责的理解，以及你认为需要具备哪些关键能力。`,
            expectedDuration: 180,
            category: major
          },
          {
            title: `你在${major}专业学习中最大的收获是什么？`,
            content: `请分享一个你在专业学习过程中印象最深刻的经历和收获。`,
            expectedDuration: 200,
            category: major
          }
        ];
    }

    // 从题库中随机选择不重复的题目
    const selectedQuestions: any[] = [];
    const availableQuestions = questionPool.filter(q => !this.usedQuestions.has(q.title));
    
    // 如果可用题目不够，重置已使用题目集合
    if (availableQuestions.length < count) {
      this.usedQuestions.clear();
      availableQuestions.push(...questionPool);
    }
    
    for (let i = 0; i < count && availableQuestions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const selectedQuestion = availableQuestions.splice(randomIndex, 1)[0];
      selectedQuestions.push(selectedQuestion);
      this.usedQuestions.add(selectedQuestion.title);
    }
    
    return selectedQuestions;
  }

  // 重置已使用题目（用于新的面试会话）
  reset() {
    this.usedQuestions.clear();
  }
}

// 导出单例实例
export const questionGenerator = new QuestionGenerator();