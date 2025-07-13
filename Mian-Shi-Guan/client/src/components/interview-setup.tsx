import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  GraduationCap, 
  Building, 
  Code, 
  Users, 
  Shuffle,
  Mic,
  Volume2
} from "lucide-react";
import { playTTS } from '../lib/tts';

interface InterviewSetupProps {
  onStart: (config: InterviewConfig) => void;
  isLoading: boolean;
}

export interface InterviewConfig {
  type: string;
  major: string;
  position: string;
  company: string;
  experience: string;
  voiceEnabled: boolean;
  voiceSpeed: number;
  voiceType: string;
  questionCount: number;
}

export default function InterviewSetup({ onStart, isLoading }: InterviewSetupProps) {
  const [config, setConfig] = useState<InterviewConfig>({
    type: "technical",
    major: "",
    position: "",
    company: "",
    experience: "fresh",
    voiceEnabled: true,
    voiceSpeed: 1.0,
    voiceType: "female",
    questionCount: 5
  });

  const majors = [
    // 工科专业
    { value: "computer_science", label: "计算机科学与技术" },
    { value: "software_engineering", label: "软件工程" },
    { value: "data_science", label: "数据科学" },
    { value: "ai", label: "人工智能" },
    { value: "cybersecurity", label: "网络安全" },
    { value: "electronics", label: "电子工程" },
    { value: "automation", label: "自动化" },
    { value: "mechanical", label: "机械工程" },
    { value: "civil_engineering", label: "土木工程" },
    { value: "chemical", label: "化学工程" },
    { value: "materials", label: "材料科学与工程" },
    
    // 商科专业
    { value: "business", label: "工商管理" },
    { value: "finance", label: "金融学" },
    { value: "marketing", label: "市场营销" },
    { value: "accounting", label: "会计学" },
    { value: "economics", label: "经济学" },
    { value: "international_business", label: "国际商务" },
    { value: "logistics", label: "物流管理" },
    
    // 教育专业
    { value: "education", label: "教育学" },
    { value: "preschool_education", label: "学前教育" },
    { value: "primary_education", label: "小学教育" },
    { value: "special_education", label: "特殊教育" },
    { value: "sports_education", label: "体育教育" },
    { value: "music_education", label: "音乐教育" },
    { value: "art_education", label: "美术教育" },
    
    // 文科专业
    { value: "chinese_literature", label: "汉语言文学" },
    { value: "english", label: "英语" },
    { value: "journalism", label: "新闻学" },
    { value: "law", label: "法学" },
    { value: "philosophy", label: "哲学" },
    { value: "history", label: "历史学" },
    { value: "sociology", label: "社会学" },
    
    // 理科专业
    { value: "mathematics", label: "数学与应用数学" },
    { value: "physics", label: "物理学" },
    { value: "chemistry", label: "化学" },
    { value: "biology", label: "生物科学" },
    { value: "environmental_science", label: "环境科学" },
    
    // 医学专业
    { value: "clinical_medicine", label: "临床医学" },
    { value: "nursing", label: "护理学" },
    { value: "pharmacy", label: "药学" },
    { value: "public_health", label: "预防医学" },
    
    // 艺术设计专业
    { value: "design", label: "设计学" },
    { value: "art", label: "美术学" },
    { value: "music", label: "音乐学" },
    { value: "dance", label: "舞蹈学" },
    { value: "film", label: "影视学" },
    
    // 心理学专业
    { value: "psychology", label: "心理学" },
    { value: "applied_psychology", label: "应用心理学" }
  ];

  // 根据专业动态生成相关岗位
  const getPositionsByMajor = (major: string) => {
    const positionMap: Record<string, Array<{value: string, label: string}>> = {
      // 计算机相关专业
      computer_science: [
        { value: "frontend_dev", label: "前端开发工程师" },
        { value: "backend_dev", label: "后端开发工程师" },
        { value: "fullstack_dev", label: "全栈开发工程师" },
        { value: "mobile_dev", label: "移动端开发工程师" },
        { value: "data_engineer", label: "数据工程师" },
        { value: "system_engineer", label: "系统工程师" },
        { value: "devops", label: "运维工程师" },
        { value: "test_engineer", label: "测试工程师" },
        { value: "product_manager", label: "产品经理" }
      ],
      software_engineering: [
        { value: "frontend_dev", label: "前端开发工程师" },
        { value: "backend_dev", label: "后端开发工程师" },
        { value: "fullstack_dev", label: "全栈开发工程师" },
        { value: "mobile_dev", label: "移动端开发工程师" },
        { value: "software_architect", label: "软件架构师" },
        { value: "test_engineer", label: "测试工程师" },
        { value: "devops", label: "运维工程师" },
        { value: "product_manager", label: "产品经理" }
      ],
      data_science: [
        { value: "data_scientist", label: "数据科学家" },
        { value: "data_analyst", label: "数据分析师" },
        { value: "data_engineer", label: "数据工程师" },
        { value: "ml_engineer", label: "机器学习工程师" },
        { value: "ai_researcher", label: "AI研究员" },
        { value: "business_analyst", label: "业务分析师" }
      ],
      ai: [
        { value: "ai_engineer", label: "AI工程师" },
        { value: "ml_engineer", label: "机器学习工程师" },
        { value: "nlp_engineer", label: "自然语言处理工程师" },
        { value: "computer_vision", label: "计算机视觉工程师" },
        { value: "ai_researcher", label: "AI研究员" },
        { value: "data_scientist", label: "数据科学家" }
      ],
      
      // 教育专业
      education: [
        { value: "teacher", label: "中学教师" },
        { value: "education_admin", label: "教育管理员" },
        { value: "curriculum_designer", label: "课程设计师" },
        { value: "education_consultant", label: "教育咨询师" },
        { value: "training_specialist", label: "培训专员" },
        { value: "education_researcher", label: "教育研究员" }
      ],
      preschool_education: [
        { value: "preschool_teacher", label: "幼儿园教师" },
        { value: "early_childhood_educator", label: "早期教育师" },
        { value: "kindergarten_principal", label: "幼儿园园长" },
        { value: "child_development", label: "儿童发展专员" },
        { value: "family_education", label: "家庭教育指导师" },
        { value: "childcare_director", label: "托育机构负责人" }
      ],
      primary_education: [
        { value: "primary_teacher", label: "小学教师" },
        { value: "class_advisor", label: "班主任" },
        { value: "primary_principal", label: "小学校长" },
        { value: "academic_coordinator", label: "教学协调员" },
        { value: "student_counselor", label: "学生辅导员" }
      ],
      
      // 商科专业
      business: [
        { value: "management_trainee", label: "管理培训生" },
        { value: "project_manager", label: "项目经理" },
        { value: "business_analyst", label: "业务分析师" },
        { value: "operations_manager", label: "运营经理" },
        { value: "consultant", label: "管理咨询师" },
        { value: "product_manager", label: "产品经理" }
      ],
      finance: [
        { value: "financial_analyst", label: "财务分析师" },
        { value: "investment_advisor", label: "投资顾问" },
        { value: "risk_manager", label: "风险管理师" },
        { value: "bank_clerk", label: "银行柜员" },
        { value: "insurance_agent", label: "保险代理人" },
        { value: "financial_planner", label: "理财规划师" }
      ],
      marketing: [
        { value: "marketing_specialist", label: "市场专员" },
        { value: "digital_marketer", label: "数字营销师" },
        { value: "brand_manager", label: "品牌经理" },
        { value: "social_media", label: "新媒体运营" },
        { value: "sales_rep", label: "销售代表" },
        { value: "market_researcher", label: "市场调研员" }
      ],
      accounting: [
        { value: "accountant", label: "会计师" },
        { value: "auditor", label: "审计师" },
        { value: "tax_specialist", label: "税务专员" },
        { value: "finance_manager", label: "财务经理" },
        { value: "cost_analyst", label: "成本分析师" }
      ],
      
      // 文科专业
      chinese_literature: [
        { value: "editor", label: "编辑" },
        { value: "writer", label: "作家/文案" },
        { value: "chinese_teacher", label: "语文教师" },
        { value: "journalist", label: "记者" },
        { value: "copywriter", label: "文案策划" },
        { value: "translator", label: "翻译" }
      ],
      english: [
        { value: "english_teacher", label: "英语教师" },
        { value: "translator", label: "翻译/口译员" },
        { value: "foreign_trade", label: "外贸专员" },
        { value: "tour_guide", label: "导游" },
        { value: "international_business", label: "国际商务专员" }
      ],
      journalism: [
        { value: "journalist", label: "记者" },
        { value: "editor", label: "编辑" },
        { value: "media_planner", label: "媒体策划" },
        { value: "pr_specialist", label: "公关专员" },
        { value: "news_anchor", label: "新闻主播" }
      ],
      law: [
        { value: "lawyer", label: "律师" },
        { value: "legal_advisor", label: "法律顾问" },
        { value: "judge_assistant", label: "法官助理" },
        { value: "paralegal", label: "律师助理" },
        { value: "legal_consultant", label: "法律咨询师" }
      ],
      
      // 理科专业
      mathematics: [
        { value: "math_teacher", label: "数学教师" },
        { value: "data_analyst", label: "数据分析师" },
        { value: "actuary", label: "精算师" },
        { value: "research_scientist", label: "科研人员" },
        { value: "statistician", label: "统计师" }
      ],
      physics: [
        { value: "physics_teacher", label: "物理教师" },
        { value: "research_scientist", label: "科研人员" },
        { value: "engineer", label: "工程师" },
        { value: "lab_technician", label: "实验室技术员" }
      ],
      chemistry: [
        { value: "chemistry_teacher", label: "化学教师" },
        { value: "chemist", label: "化学师" },
        { value: "lab_analyst", label: "实验室分析员" },
        { value: "quality_control", label: "质量控制员" },
        { value: "research_scientist", label: "科研人员" }
      ],
      
      // 医学专业
      clinical_medicine: [
        { value: "doctor", label: "医生" },
        { value: "resident", label: "住院医师" },
        { value: "medical_researcher", label: "医学研究员" },
        { value: "clinical_coordinator", label: "临床协调员" }
      ],
      nursing: [
        { value: "nurse", label: "护士" },
        { value: "head_nurse", label: "护士长" },
        { value: "nursing_supervisor", label: "护理主管" },
        { value: "community_nurse", label: "社区护士" }
      ],
      
      // 艺术设计专业
      design: [
        { value: "ui_designer", label: "UI设计师" },
        { value: "graphic_designer", label: "平面设计师" },
        { value: "product_designer", label: "产品设计师" },
        { value: "interior_designer", label: "室内设计师" },
        { value: "brand_designer", label: "品牌设计师" }
      ],
      art: [
        { value: "artist", label: "艺术家" },
        { value: "art_teacher", label: "美术教师" },
        { value: "art_director", label: "艺术总监" },
        { value: "illustrator", label: "插画师" },
        { value: "curator", label: "策展人" }
      ],
      
      // 心理学专业
      psychology: [
        { value: "psychologist", label: "心理咨询师" },
        { value: "hr_specialist", label: "人力资源专员" },
        { value: "user_researcher", label: "用户研究员" },
        { value: "therapist", label: "心理治疗师" },
        { value: "school_counselor", label: "学校心理老师" }
      ],
      
      // 工程专业
      mechanical: [
        { value: "mechanical_engineer", label: "机械工程师" },
        { value: "design_engineer", label: "设计工程师" },
        { value: "manufacturing_engineer", label: "制造工程师" },
        { value: "quality_engineer", label: "质量工程师" }
      ],
      civil_engineering: [
        { value: "civil_engineer", label: "土木工程师" },
        { value: "structural_engineer", label: "结构工程师" },
        { value: "construction_manager", label: "建筑项目经理" },
        { value: "urban_planner", label: "城市规划师" }
      ]
    };
    
    return positionMap[major] || [
      { value: "general_management", label: "管理岗位" },
      { value: "sales_rep", label: "销售代表" },
      { value: "customer_service", label: "客户服务" },
      { value: "administrative", label: "行政专员" }
    ];
  };

  const availablePositions = config.major ? getPositionsByMajor(config.major) : [];

  // 当专业改变时重置岗位选择
  const handleMajorChange = (major: string) => {
    setConfig(prev => ({
      ...prev,
      major,
      position: "" // 重置岗位选择
    }));
  };

  const interviewTypes = [
    { value: "technical", label: "技术面试", icon: Code, color: "bg-blue-500" },
    { value: "behavioral", label: "行为面试", icon: Users, color: "bg-green-500" },
    { value: "case_study", label: "案例分析", icon: Building, color: "bg-purple-500" },
    { value: "comprehensive", label: "综合面试", icon: Shuffle, color: "bg-orange-500" }
  ];

  const handleStart = () => {
    if (!config.major || !config.position) {
      alert("请选择专业和应聘岗位");
      return;
    }
    onStart(config);
  };

  const testVoice = () => {
    playTTS("你好，我是AI面试官，很高兴为你进行面试");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">面试设置</h1>
        <p className="text-slate-600">
          请选择你的专业背景和应聘岗位，系统将为你定制专业的面试题目
        </p>
      </div>

      {/* Interview Type Selection */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">选择面试类型</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {interviewTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    config.type === type.value
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, type: type.value }))}
                >
                  <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                    <IconComponent className="text-white w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-center text-slate-900">{type.label}</h4>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="major" className="text-sm font-medium text-slate-700 mb-2 block">
                <GraduationCap className="w-4 h-4 inline mr-2" />
                专业背景 *
              </Label>
              <Select value={config.major} onValueChange={handleMajorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择你的专业" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map(major => (
                    <SelectItem key={major.value} value={major.value}>
                      {major.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {config.major && availablePositions.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">正在加载相关岗位...</p>
              )}
            </div>

            <div>
              <Label htmlFor="position" className="text-sm font-medium text-slate-700 mb-2 block">
                <Building className="w-4 h-4 inline mr-2" />
                应聘岗位 *
              </Label>
              <Select 
                value={config.position} 
                onValueChange={(value) => setConfig(prev => ({ ...prev, position: value }))}
                disabled={!config.major || availablePositions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={config.major ? "选择应聘岗位" : "请先选择专业"} />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map(position => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availablePositions.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  共有 {availablePositions.length} 个相关岗位可选择
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-medium text-slate-700 mb-2 block">
                目标企业类型
              </Label>
              <Select value={config.company} onValueChange={(value) => setConfig(prev => ({ ...prev, company: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择目标企业类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internet_giants">互联网大厂 (阿里、腾讯、字节、百度)</SelectItem>
                  <SelectItem value="tech_companies">科技公司 (华为、小米、美团、滴滴)</SelectItem>
                  <SelectItem value="foreign_tech">外资科技 (微软、谷歌、苹果、IBM)</SelectItem>
                  <SelectItem value="state_owned">国有企业 (中移动、国电、中石化)</SelectItem>
                  <SelectItem value="banks">银行金融 (工商银行、招商银行、平安)</SelectItem>
                  <SelectItem value="consulting">咨询公司 (麦肯锡、德勤、普华永道)</SelectItem>
                  <SelectItem value="manufacturing">制造业 (比亚迪、格力、海尔)</SelectItem>
                  <SelectItem value="education">教育行业 (新东方、好未来、学而思)</SelectItem>
                  <SelectItem value="government">政府机关/事业单位</SelectItem>
                  <SelectItem value="startup">创业公司</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience" className="text-sm font-medium text-slate-700 mb-2 block">
                工作经验
              </Label>
              <Select value={config.experience} onValueChange={(value) => setConfig(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh">应届毕业生</SelectItem>
                  <SelectItem value="1-3">1-3年经验</SelectItem>
                  <SelectItem value="3-5">3-5年经验</SelectItem>
                  <SelectItem value="5+">5年以上经验</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="questionCount" className="text-sm font-medium text-slate-700 mb-2 block">
                题目数量
              </Label>
              <Select value={String(config.questionCount)} onValueChange={(value) => setConfig(prev => ({ ...prev, questionCount: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5道题目 (约10分钟)</SelectItem>
                  <SelectItem value="8">8道题目 (约15分钟)</SelectItem>
                  <SelectItem value="10">10道题目 (约20分钟)</SelectItem>
                  <SelectItem value="15">15道题目 (约30分钟)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            <Volume2 className="w-5 h-5 inline mr-2" />
            语音设置
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                启用语音功能
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.voiceEnabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, voiceEnabled: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-600">启用面试官语音问答</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                面试官声音
              </Label>
              <Select value={config.voiceType} onValueChange={(value) => setConfig(prev => ({ ...prev, voiceType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">女声</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                语音速度: {config.voiceSpeed}x
              </Label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={config.voiceSpeed}
                onChange={(e) => setConfig(prev => ({ ...prev, voiceSpeed: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>慢</span>
                <span>正常</span>
                <span>快</span>
              </div>
            </div>
          </div>

          {config.voiceEnabled && (
            <div className="mt-4">
              <Button variant="outline" onClick={testVoice} className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <span>测试语音</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {config.major && config.position && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">面试预览</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{majors.find(m => m.value === config.major)?.label}</Badge>
              <Badge variant="secondary">{availablePositions.find(p => p.value === config.position)?.label}</Badge>
              <Badge variant="secondary">{interviewTypes.find(t => t.value === config.type)?.label}</Badge>
              {config.company && <Badge variant="outline">{config.company}</Badge>}
            </div>
            <p className="text-sm text-slate-600">
              系统将为你生成专门针对 <strong>{majors.find(m => m.value === config.major)?.label}</strong> 专业
              申请 <strong>{availablePositions.find(p => p.value === config.position)?.label}</strong> 岗位的面试题目。
              {config.voiceEnabled && " 面试官将使用语音与你互动。"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Start Button */}
      <div className="text-center">
        <Button
          onClick={handleStart}
          disabled={isLoading || !config.major || !config.position}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              正在生成面试题目...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              开始面试
            </>
          )}
        </Button>
      </div>
    </div>
  );
}