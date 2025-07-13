import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Clock, 
  Users, 
  Lightbulb,
  CheckCircle,
  Star,
  Briefcase,
  GraduationCap
} from "lucide-react";

interface InterviewPreparationProps {
  major: string;
  position: string;
  company: string;
  onStartInterview: () => void;
}

export default function InterviewPreparation({ 
  major, 
  position, 
  company, 
  onStartInterview 
}: InterviewPreparationProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  // 根据专业提供准备建议
  const getPreparationTips = () => {
    const baseTips = [
      "确保网络连接稳定，避免面试中断",
      "准备一个安静、光线充足的面试环境",
      "提前测试摄像头和麦克风设备",
      "准备一份简历和相关作品集",
      "了解公司背景和职位要求"
    ];

    const majorSpecificTips = {
      education: [
        "准备教学案例和教育理念阐述",
        "回顾教育心理学和教学方法理论",
        "准备处理学生问题的具体策略",
        "思考如何与家长有效沟通"
      ],
      preschool_education: [
        "准备幼儿教育活动设计案例",
        "了解不同年龄段儿童发展特点",
        "准备安全管理和突发事件处理方案",
        "思考如何进行家园共育"
      ],
      computer_science: [
        "准备技术项目经验和代码示例",
        "复习核心算法和数据结构",
        "了解最新技术趋势和框架",
        "准备系统设计和问题解决思路"
      ]
    };

    return {
      基础准备: baseTips,
      专业准备: majorSpecificTips[major as keyof typeof majorSpecificTips] || [
        "回顾专业核心知识和理论",
        "准备相关实践经验和案例",
        "了解行业发展趋势",
        "思考职业发展规划"
      ]
    };
  };

  // 常见面试问题
  const getCommonQuestions = () => {
    const commonQuestions = [
      "请简单介绍一下你自己",
      "为什么选择这个专业/职位？",
      "你的优势和劣势是什么？",
      "你对我们公司了解多少？",
      "你的职业规划是什么？"
    ];

    const majorQuestions = {
      education: [
        "你认为好老师应该具备哪些品质？",
        "如何处理课堂纪律问题？",
        "如何评价学生的学习成果？",
        "如何与家长建立良好关系？"
      ],
      preschool_education: [
        "如何设计适合幼儿的教育活动？",
        "怎样处理幼儿的情绪问题？",
        "如何保证幼儿园的安全？",
        "怎样促进幼儿全面发展？"
      ],
      computer_science: [
        "介绍一个你完成的技术项目",
        "如何解决复杂的技术问题？",
        "你如何学习新技术？",
        "如何进行代码优化？"
      ]
    };

    return [
      ...commonQuestions,
      ...(majorQuestions[major as keyof typeof majorQuestions] || [])
    ];
  };

  // 着装建议
  const getDressCode = () => {
    if (position.includes('teacher') || position.includes('教师')) {
      return {
        建议: "正式商务装",
        详细: ["深色西装或套装", "白色或浅色衬衫", "领带或丝巾", "黑色皮鞋", "整洁的发型"]
      };
    } else if (position.includes('程序员') || position.includes('开发')) {
      return {
        建议: "商务休闲装",
        详细: ["整洁的衬衫或Polo衫", "休闲西装外套", "深色长裤", "舒适的皮鞋", "避免过于随意"]
      };
    } else {
      return {
        建议: "商务正装",
        详细: ["正式套装", "干净整洁", "避免过于鲜艳的颜色", "适当的配饰", "专业的形象"]
      };
    }
  };

  const preparationTips = getPreparationTips();
  const commonQuestions = getCommonQuestions();
  const dressCode = getDressCode();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            面试准备指南
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{major}</Badge>
            <Badge variant="outline">{position}</Badge>
            {company && <Badge variant="outline">{company}</Badge>}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="checklist">准备清单</TabsTrigger>
          <TabsTrigger value="questions">常见问题</TabsTrigger>
          <TabsTrigger value="tips">专业建议</TabsTrigger>
          <TabsTrigger value="dress">着装建议</TabsTrigger>
          <TabsTrigger value="mindset">心理准备</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                面试前准备清单
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preparationTips).map(([category, tips]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold text-slate-700">{category}</h4>
                  <div className="space-y-2">
                    {tips.map((tip, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => toggleCheck(`${category}-${index}`)}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          checkedItems.includes(`${category}-${index}`) 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {checkedItems.includes(`${category}-${index}`) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={checkedItems.includes(`${category}-${index}`) ? 'line-through text-gray-500' : ''}>
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                常见面试问题
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {commonQuestions.map((question, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">{index + 1}. {question}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      建议准备2-3分钟的回答，包含具体例子
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  回答技巧
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">STAR方法</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li><strong>S</strong>ituation - 描述情况</li>
                    <li><strong>T</strong>ask - 说明任务</li>
                    <li><strong>A</strong>ction - 阐述行动</li>
                    <li><strong>R</strong>esult - 总结结果</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">表达要点</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 保持眼神交流</li>
                    <li>• 语速适中，吐字清晰</li>
                    <li>• 举例说明观点</li>
                    <li>• 避免长篇大论</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  互动技巧
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">积极表现</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 主动提问显示兴趣</li>
                    <li>• 认真倾听面试官</li>
                    <li>• 适当表达热情</li>
                    <li>• 展现学习能力</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">避免事项</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 不要批评前雇主</li>
                    <li>• 避免过于紧张</li>
                    <li>• 不要撒谎夸大</li>
                    <li>• 避免消极态度</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                着装建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">推荐风格: {dressCode.建议}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dressCode.详细.map((item, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded text-sm text-center">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">通用建议</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 服装整洁干净，熨烫平整</li>
                    <li>• 颜色搭配协调，避免过于花哨</li>
                    <li>• 注意个人卫生和仪表</li>
                    <li>• 根据公司文化适当调整</li>
                    <li>• 提前一天准备好服装</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mindset" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  心理建设
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">缓解紧张</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 深呼吸放松技巧</li>
                    <li>• 积极心理暗示</li>
                    <li>• 充分准备增信心</li>
                    <li>• 把面试当成交流</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">自信表现</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 相信自己的能力</li>
                    <li>• 展现真实的自己</li>
                    <li>• 积极面对挑战</li>
                    <li>• 保持开放心态</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  面试心态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">正确认知</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 面试是双向选择</li>
                    <li>• 失败是成长机会</li>
                    <li>• 每次都是经验积累</li>
                    <li>• 保持学习心态</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">目标导向</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 明确求职目标</li>
                    <li>• 了解岗位匹配度</li>
                    <li>• 展示成长潜力</li>
                    <li>• 表达长期规划</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button 
          onClick={onStartInterview}
          size="lg"
          className="px-8 py-3"
          disabled={checkedItems.length < 3}
        >
          <Clock className="w-4 h-4 mr-2" />
          {checkedItems.length < 3 ? `完成准备清单开始面试 (${checkedItems.length}/3)` : '开始正式面试'}
        </Button>
      </div>
    </div>
  );
}