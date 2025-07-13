// 中国软件杯赛题要求的技术领域面试题库
export class CompetitionQuestionBank {
  
  // 人工智能技术领域面试题库
  static aiQuestions = [
    {
      title: "请介绍你对机器学习的理解",
      content: "请说明监督学习、无监督学习和强化学习的区别，并举例说明各自的应用场景。",
      expectedDuration: 240,
      category: "artificial_intelligence",
      difficulty: "medium",
      keywords: ["机器学习", "监督学习", "无监督学习", "强化学习"]
    },
    {
      title: "描述一个你参与的AI项目",
      content: "请详细描述一个你参与的人工智能项目，包括使用的算法、数据处理方法和最终效果。",
      expectedDuration: 300,
      category: "artificial_intelligence",
      difficulty: "hard",
      keywords: ["项目经验", "算法", "数据处理", "模型效果"]
    },
    {
      title: "如何处理机器学习中的过拟合问题？",
      content: "当你的模型在训练集上表现很好但在测试集上表现较差时，你会采取哪些措施？",
      expectedDuration: 180,
      category: "artificial_intelligence",
      difficulty: "medium",
      keywords: ["过拟合", "泛化能力", "正则化", "交叉验证"]
    },
    {
      title: "深度学习和传统机器学习的区别",
      content: "请比较深度学习和传统机器学习方法的优缺点，并说明在什么情况下选择哪种方法。",
      expectedDuration: 200,
      category: "artificial_intelligence",
      difficulty: "medium",
      keywords: ["深度学习", "特征工程", "神经网络", "算法选择"]
    },
    {
      title: "你如何评估AI模型的性能？",
      content: "请介绍几种评估机器学习模型性能的指标，并说明在不同场景下如何选择合适的评估指标。",
      expectedDuration: 180,
      category: "artificial_intelligence",
      difficulty: "medium",
      keywords: ["模型评估", "准确率", "召回率", "F1分数", "AUC"]
    },
    {
      title: "解释神经网络的反向传播算法",
      content: "请详细说明反向传播算法的工作原理，以及它在神经网络训练中的作用。",
      expectedDuration: 220,
      category: "artificial_intelligence",
      difficulty: "hard",
      keywords: ["反向传播", "梯度下降", "链式法则", "权重更新"]
    },
    {
      title: "自然语言处理的主要挑战",
      content: "在自然语言处理任务中，你认为主要面临哪些技术挑战？如何解决这些问题？",
      expectedDuration: 200,
      category: "artificial_intelligence",
      difficulty: "medium",
      keywords: ["NLP", "语义理解", "上下文", "词向量", "Transformer"]
    }
  ];

  // 大数据技术领域面试题库
  static bigDataQuestions = [
    {
      title: "请介绍大数据处理的关键技术",
      content: "请说明Hadoop、Spark、Kafka等大数据技术的特点和适用场景。",
      expectedDuration: 240,
      category: "big_data",
      difficulty: "medium",
      keywords: ["Hadoop", "Spark", "Kafka", "分布式计算"]
    },
    {
      title: "描述一个数据分析项目的完整流程",
      content: "请详细描述从数据收集到最终分析结果的完整数据处理流程，包括遇到的挑战。",
      expectedDuration: 300,
      category: "big_data",
      difficulty: "hard",
      keywords: ["数据处理", "ETL", "数据清洗", "数据分析"]
    },
    {
      title: "如何设计一个数据仓库？",
      content: "假设要为一个电商公司设计数据仓库，你会如何进行架构设计和数据建模？",
      expectedDuration: 220,
      category: "big_data",
      difficulty: "hard",
      keywords: ["数据仓库", "数据建模", "维度建模", "事实表"]
    },
    {
      title: "实时数据处理和批处理的区别",
      content: "请比较实时数据处理和批处理的优缺点，并说明在什么场景下选择哪种方式。",
      expectedDuration: 180,
      category: "big_data",
      difficulty: "medium",
      keywords: ["实时处理", "批处理", "流计算", "延迟"]
    },
    {
      title: "数据质量如何保证？",
      content: "在大数据处理过程中，如何确保数据的准确性、完整性和一致性？",
      expectedDuration: 160,
      category: "big_data",
      difficulty: "medium",
      keywords: ["数据质量", "数据校验", "数据治理", "数据监控"]
    },
    {
      title: "分布式系统的一致性问题",
      content: "请解释CAP定理，并说明在分布式数据系统中如何平衡一致性、可用性和分区容错性。",
      expectedDuration: 200,
      category: "big_data",
      difficulty: "hard",
      keywords: ["CAP定理", "分布式一致性", "最终一致性", "BASE理论"]
    }
  ];

  // 物联网技术领域面试题库
  static iotQuestions = [
    {
      title: "请介绍物联网系统架构",
      content: "请说明物联网系统的层次架构，包括感知层、网络层、应用层的功能和技术。",
      expectedDuration: 220,
      category: "iot",
      difficulty: "medium",
      keywords: ["物联网架构", "感知层", "网络层", "应用层"]
    },
    {
      title: "描述一个你参与的物联网项目",
      content: "请详细描述一个你参与的物联网项目，包括硬件选型、通信协议和软件开发。",
      expectedDuration: 300,
      category: "iot",
      difficulty: "hard",
      keywords: ["物联网项目", "硬件选型", "通信协议", "嵌入式开发"]
    },
    {
      title: "物联网中的数据安全如何保障？",
      content: "在物联网系统中，设备和数据面临哪些安全威胁？你会如何设计安全防护方案？",
      expectedDuration: 200,
      category: "iot",
      difficulty: "medium",
      keywords: ["物联网安全", "设备认证", "数据加密", "安全协议"]
    },
    {
      title: "边缘计算在物联网中的作用",
      content: "请解释边缘计算的概念，并说明它在物联网系统中如何提升性能和降低延迟。",
      expectedDuration: 180,
      category: "iot",
      difficulty: "medium",
      keywords: ["边缘计算", "雾计算", "本地处理", "延迟优化"]
    },
    {
      title: "物联网设备的功耗优化",
      content: "对于电池供电的物联网设备，你会采用哪些方法来优化功耗，延长设备使用寿命？",
      expectedDuration: 160,
      category: "iot",
      difficulty: "medium",
      keywords: ["功耗优化", "低功耗设计", "睡眠模式", "能源管理"]
    },
    {
      title: "物联网通信协议的选择",
      content: "请比较WiFi、蓝牙、LoRa、NB-IoT等通信协议的特点，并说明在不同场景下如何选择。",
      expectedDuration: 200,
      category: "iot",
      difficulty: "medium",
      keywords: ["通信协议", "WiFi", "蓝牙", "LoRa", "NB-IoT"]
    }
  ];

  // 智能系统技术领域面试题库
  static intelligentSystemQuestions = [
    {
      title: "请介绍智能控制系统的设计原理",
      content: "请说明智能控制系统与传统控制系统的区别，并介绍几种常见的智能控制算法。",
      expectedDuration: 240,
      category: "intelligent_systems",
      difficulty: "medium",
      keywords: ["智能控制", "PID控制", "模糊控制", "神经网络控制"]
    },
    {
      title: "描述一个智能系统的开发经历",
      content: "请详细描述一个你参与开发的智能系统项目，包括系统架构、核心算法和实现效果。",
      expectedDuration: 300,
      category: "intelligent_systems",
      difficulty: "hard",
      keywords: ["智能系统", "系统架构", "算法设计", "项目实施"]
    },
    {
      title: "人机交互在智能系统中的重要性",
      content: "请分析人机交互设计对智能系统用户体验的影响，并举例说明优秀的交互设计。",
      expectedDuration: 200,
      category: "intelligent_systems",
      difficulty: "medium",
      keywords: ["人机交互", "用户体验", "界面设计", "交互模式"]
    },
    {
      title: "智能系统的可解释性问题",
      content: "在智能系统决策过程中，如何提高系统的可解释性，让用户理解系统的决策逻辑？",
      expectedDuration: 180,
      category: "intelligent_systems",
      difficulty: "medium",
      keywords: ["可解释AI", "决策透明", "算法解释", "用户信任"]
    },
    {
      title: "智能系统的鲁棒性设计",
      content: "如何设计智能系统来应对不确定的环境变化和异常情况，确保系统的稳定性？",
      expectedDuration: 200,
      category: "intelligent_systems",
      difficulty: "medium",
      keywords: ["系统鲁棒性", "异常处理", "容错设计", "自适应系统"]
    },
    {
      title: "多智能体系统的协调机制",
      content: "在多智能体系统中，如何设计协调机制使各个智能体能够有效协作完成复杂任务？",
      expectedDuration: 220,
      category: "intelligent_systems",
      difficulty: "hard",
      keywords: ["多智能体", "协调机制", "分布式智能", "任务分配"]
    }
  ];

  // 通用技术岗位面试题库
  static technicalQuestions = [
    {
      title: "描述你的技术栈和项目经验",
      content: "请介绍你熟悉的技术栈，并详细描述一个最有代表性的技术项目。",
      expectedDuration: 300,
      category: "technical",
      difficulty: "medium",
      keywords: ["技术栈", "项目经验", "技术能力", "开发经验"]
    },
    {
      title: "如何进行系统性能优化？",
      content: "当系统出现性能瓶颈时，你会从哪些方面进行分析和优化？",
      expectedDuration: 200,
      category: "technical",
      difficulty: "medium",
      keywords: ["性能优化", "系统调优", "瓶颈分析", "监控"]
    },
    {
      title: "软件开发生命周期管理",
      content: "请介绍你在软件开发过程中使用的开发方法论和项目管理工具。",
      expectedDuration: 180,
      category: "technical",
      difficulty: "easy",
      keywords: ["SDLC", "敏捷开发", "项目管理", "版本控制"]
    },
    {
      title: "如何保证代码质量？",
      content: "在软件开发过程中，你会采用哪些方法和工具来确保代码的质量和可维护性？",
      expectedDuration: 160,
      category: "technical",
      difficulty: "medium",
      keywords: ["代码质量", "代码审查", "单元测试", "重构"]
    }
  ];

  // 产品岗位面试题库
  static productQuestions = [
    {
      title: "如何进行产品需求分析？",
      content: "请描述你在产品需求分析过程中使用的方法和工具，以及如何优先级排序。",
      expectedDuration: 220,
      category: "product",
      difficulty: "medium",
      keywords: ["需求分析", "用户调研", "需求优先级", "产品规划"]
    },
    {
      title: "描述一个产品设计项目",
      content: "请详细描述一个你参与的产品设计项目，包括用户研究、原型设计和迭代过程。",
      expectedDuration: 300,
      category: "product",
      difficulty: "hard",
      keywords: ["产品设计", "用户研究", "原型设计", "产品迭代"]
    },
    {
      title: "如何衡量产品成功？",
      content: "请说明你会使用哪些指标来评估产品的成功，以及如何进行数据分析。",
      expectedDuration: 180,
      category: "product",
      difficulty: "medium",
      keywords: ["产品指标", "KPI", "数据分析", "用户增长"]
    },
    {
      title: "产品竞争分析方法",
      content: "当面对竞争对手时，你会如何进行竞品分析，找出自己产品的差异化优势？",
      expectedDuration: 200,
      category: "product",
      difficulty: "medium",
      keywords: ["竞品分析", "差异化", "市场定位", "竞争策略"]
    }
  ];

  // 运维测试岗位面试题库
  static devopsQuestions = [
    {
      title: "描述你的DevOps实践经验",
      content: "请介绍你在持续集成/持续部署(CI/CD)方面的实践经验和使用的工具。",
      expectedDuration: 240,
      category: "devops",
      difficulty: "medium",
      keywords: ["DevOps", "CI/CD", "自动化部署", "Jenkins", "Docker"]
    },
    {
      title: "如何设计系统监控方案？",
      content: "请描述你会如何设计一个完整的系统监控方案，包括监控指标和告警机制。",
      expectedDuration: 200,
      category: "devops",
      difficulty: "medium",
      keywords: ["系统监控", "监控指标", "告警", "运维自动化"]
    },
    {
      title: "容器化技术的应用",
      content: "请说明Docker和Kubernetes在现代应用部署中的作用，以及你的使用经验。",
      expectedDuration: 180,
      category: "devops",
      difficulty: "medium",
      keywords: ["容器化", "Docker", "Kubernetes", "微服务"]
    },
    {
      title: "自动化测试策略设计",
      content: "请描述你会如何设计一个完整的自动化测试策略，包括单元测试、集成测试等。",
      expectedDuration: 220,
      category: "devops",
      difficulty: "medium",
      keywords: ["自动化测试", "测试策略", "单元测试", "集成测试"]
    }
  ];

  // 获取指定技术领域的题目
  static getQuestionsByCategory(category: string, count: number = 5) {
    const questionMap = {
      'artificial_intelligence': this.aiQuestions,
      'big_data': this.bigDataQuestions,
      'iot': this.iotQuestions,
      'intelligent_systems': this.intelligentSystemQuestions,
      'technical': this.technicalQuestions,
      'product': this.productQuestions,
      'devops': this.devopsQuestions
    };

    const questions = questionMap[category as keyof typeof questionMap] || [];
    return questions.slice(0, count).map((q, index) => ({
      id: index + 1,
      ...q,
      isActive: true,
      tags: q.keywords
    }));
  }

  // 获取所有技术领域的混合题目
  static getMixedTechnicalQuestions(count: number = 5) {
    const allQuestions = [
      ...this.aiQuestions,
      ...this.bigDataQuestions,
      ...this.iotQuestions,
      ...this.intelligentSystemQuestions
    ];
    
    // 随机打乱并选择指定数量
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((q, index) => ({
      id: index + 1,
      ...q,
      isActive: true,
      tags: q.keywords
    }));
  }

  // 根据难度获取题目
  static getQuestionsByDifficulty(difficulty: string, count: number = 5) {
    const allQuestions = [
      ...this.aiQuestions,
      ...this.bigDataQuestions,
      ...this.iotQuestions,
      ...this.intelligentSystemQuestions,
      ...this.technicalQuestions
    ];
    
    const filtered = allQuestions.filter(q => q.difficulty === difficulty);
    return filtered.slice(0, count).map((q, index) => ({
      id: index + 1,
      ...q,
      isActive: true,
      tags: q.keywords
    }));
  }

  // 获取支持的技术领域列表
  static getSupportedDomains() {
    return [
      { id: 'artificial_intelligence', name: '人工智能', description: 'AI、机器学习、深度学习相关技术' },
      { id: 'big_data', name: '大数据', description: '大数据处理、分析、存储技术' },
      { id: 'iot', name: '物联网', description: '物联网系统、嵌入式、边缘计算' },
      { id: 'intelligent_systems', name: '智能系统', description: '智能控制、自动化系统、多智能体' },
      { id: 'technical', name: '通用技术', description: '软件开发、系统架构、性能优化' },
      { id: 'product', name: '产品岗位', description: '产品设计、需求分析、用户研究' },
      { id: 'devops', name: '运维测试', description: 'DevOps、系统运维、自动化测试' }
    ];
  }
}