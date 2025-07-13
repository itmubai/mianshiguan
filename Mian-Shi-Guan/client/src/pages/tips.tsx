import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Eye, 
  MessageCircle, 
  HelpCircle, 
  UserCheck, 
  Brain,
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  Users
} from "lucide-react";
import type { Tip } from "@shared/schema";

export default function Tips() {
  const { data: tips = [], isLoading } = useQuery({
    queryKey: ["/api/tips"],
  });

  // Mock tips data structure to match the design
  const tipCategories = [
    {
      id: "behavioral",
      title: "行为面试技巧",
      icon: Users,
      color: "blue",
      description: "掌握STAR法则和行为问题回答技巧"
    },
    {
      id: "presentation",
      title: "表达技巧",
      icon: Eye,
      color: "green", 
      description: "提升你的语言表达和非语言沟通能力"
    },
    {
      id: "communication",
      title: "沟通技巧",
      icon: MessageCircle,
      color: "purple",
      description: "建立有效的面试对话和互动"
    },
    {
      id: "technical",
      title: "技术面试",
      icon: Brain,
      color: "orange",
      description: "技术问题的回答策略和思路展示"
    },
    {
      id: "preparation",
      title: "面试准备",
      icon: Target,
      color: "pink",
      description: "全面的面试前准备和规划"
    },
    {
      id: "mindset",
      title: "心理准备",
      icon: Zap,
      color: "indigo",
      description: "调整心态，建立面试自信"
    }
  ];

  const detailedTips = [
    {
      id: 1,
      title: "STAR法则",
      content: "使用Situation（情境）、Task（任务）、Action（行动）、Result（结果）的结构来回答行为类问题，让你的回答更有条理和说服力。",
      category: "behavioral",
      icon: "lightbulb",
      color: "blue",
      examples: [
        "描述具体的工作或学习情境",
        "明确说明你需要完成的任务",
        "详细描述你采取的具体行动",
        "量化展示最终取得的成果"
      ]
    },
    {
      id: 2,
      title: "眼神交流技巧",
      content: "保持自然的眼神交流，既不要一直盯着面试官，也不要总是低头或四处张望。适当的眼神接触能展现你的自信和诚意。",
      category: "presentation",
      icon: "eye",
      color: "green",
      examples: [
        "回答问题时看着面试官的眼睛",
        "适当转移视线避免过度凝视",
        "思考时可以短暂移开视线",
        "保持友善和专业的眼神"
      ]
    },
    {
      id: 3,
      title: "语言表达要点",
      content: "语速适中，吐字清晰，避免使用过多的口头禅。适当的停顿可以让你的表达更有节奏感，也给自己思考的时间。",
      category: "communication",
      icon: "comments",
      color: "purple",
      examples: [
        "控制语速，避免过快或过慢",
        "使用简洁明了的词汇",
        "适当停顿组织语言",
        "避免\"嗯\"、\"那个\"等口头禅"
      ]
    },
    {
      id: 4,
      title: "提问环节",
      content: "准备一些有深度的问题向面试官提问，展现你对公司和职位的关注。避免问薪资、假期等基础信息，重点关注工作内容和发展机会。",
      category: "preparation",
      icon: "question-circle",
      color: "orange",
      examples: [
        "询问团队合作模式和工作流程",
        "了解公司的发展方向和挑战",
        "询问岗位的成长空间和学习机会",
        "了解公司文化和团队氛围"
      ]
    },
    {
      id: 5,
      title: "着装建议",
      content: "选择适合行业和公司文化的着装。即使是视频面试，也要保持整洁专业的形象。颜色以深色或中性色为主，避免过于鲜艳或花哨。",
      category: "preparation",
      icon: "user-tie",
      color: "pink",
      examples: [
        "选择合身的正装或商务休闲装",
        "保持整洁的发型和仪容",
        "避免过多装饰品和强烈香水",
        "确保视频背景简洁专业"
      ]
    },
    {
      id: 6,
      title: "心理准备",
      content: "面试前做好充分准备，了解公司背景和职位要求。保持积极的心态，将面试看作双向选择的过程，放松心情展现真实的自己。",
      category: "mindset",
      icon: "brain",
      color: "indigo",
      examples: [
        "充分了解公司和岗位信息",
        "准备常见问题的回答",
        "进行模拟面试练习",
        "保持积极乐观的心态"
      ]
    }
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      lightbulb: Lightbulb,
      eye: Eye,
      comments: MessageCircle,
      "question-circle": HelpCircle,
      "user-tie": UserCheck,
      brain: Brain
    };
    return iconMap[iconName] || Lightbulb;
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-200" },
      green: { bg: "bg-green-500", text: "text-green-500", border: "border-green-200" },
      purple: { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-200" },
      orange: { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-200" },
      pink: { bg: "bg-pink-500", text: "text-pink-500", border: "border-pink-200" },
      indigo: { bg: "bg-indigo-500", text: "text-indigo-500", border: "border-indigo-200" }
    };
    return colorMap[color] || colorMap.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">加载面试技巧中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">面试技巧指导</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            专业的面试指导和准备资料，帮助你在面试中脱颖而出
          </p>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tipCategories.map((category) => {
            const colorClasses = getColorClasses(category.color);
            return (
              <Card key={category.id} className={`shadow-sm border-2 ${colorClasses.border} hover:shadow-md transition-all duration-200 group`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <BookOpen className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{category.description}</p>
                  <Button variant="outline" size="sm" className={`${colorClasses.text} border-current hover:bg-current hover:text-white`}>
                    查看技巧
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Tips */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">详细指导</h2>
            <p className="text-slate-600">深入了解每个技巧的具体应用方法</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {detailedTips.map((tip) => {
              const IconComponent = getIconComponent(tip.icon);
              const colorClasses = getColorClasses(tip.color);
              
              return (
                <Card key={tip.id} className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="text-white w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{tip.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {tipCategories.find(c => c.id === tip.category)?.title}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-4 leading-relaxed">{tip.content}</p>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-900 text-sm">实用要点：</h4>
                          <ul className="space-y-1">
                            {tip.examples.map((example, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-slate-600">
                                <div className={`w-1.5 h-1.5 ${colorClasses.bg} rounded-full mt-2 flex-shrink-0`}></div>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`mt-4 ${colorClasses.text} border-current hover:bg-current hover:text-white`}
                        >
                          了解更多
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Resources */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-4">持续学习</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                面试技能需要不断练习和完善。通过我们的模拟面试系统，将这些技巧应用到实际练习中，获得AI的个性化反馈。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-50"
                >
                  <Target className="w-5 h-5 mr-2" />
                  开始练习
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  更多资源
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
