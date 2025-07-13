import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Target,
  User,
  Briefcase,
  MessageSquare,
  Lightbulb,
  Star,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

interface PracticalGuideProps {
  currentAnswer: string;
  questionCategory: string;
  isRecording: boolean;
  duration: number;
}

export default function PracticalInterviewGuide({ 
  currentAnswer, 
  questionCategory, 
  isRecording,
  duration 
}: PracticalGuideProps) {
  const [activeTab, setActiveTab] = useState('preparation');

  const preparationTips = [
    {
      title: 'STAR法则',
      description: '情况(Situation) - 任务(Task) - 行动(Action) - 结果(Result)',
      example: '描述具体情况 → 明确任务目标 → 详述采取行动 → 展示具体成果',
      icon: Target,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: '3W1H原则',
      description: 'What(做什么) - Why(为什么) - How(怎么做) - When(什么时候)',
      example: '说明项目内容 → 解释选择理由 → 描述实施方法 → 提及时间节点',
      icon: MessageSquare,
      color: 'bg-green-100 text-green-700'
    },
    {
      title: '具体化表达',
      description: '用数据和事实支撑观点，避免空泛描述',
      example: '"提升了用户体验" → "优化后用户停留时间增加35%，转化率提升15%"',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const categoryAdvice = {
    'computer_science': {
      keywords: ['技术栈', '架构设计', '代码质量', '性能优化', '团队协作'],
      suggestions: [
        '详述使用的技术栈和选择理由',
        '说明遇到的技术难点及解决方案',
        '展示代码质量意识和最佳实践',
        '体现学习能力和技术热情'
      ]
    },
    'business': {
      keywords: ['商业思维', '数据分析', '用户洞察', '市场策略', '团队管理'],
      suggestions: [
        '用数据支撑商业决策过程',
        '展现对市场和用户的深度理解',
        '说明如何平衡各方利益',
        '体现领导力和执行力'
      ]
    },
    'general': {
      keywords: ['问题解决', '团队合作', '学习能力', '抗压能力', '沟通技巧'],
      suggestions: [
        '使用具体案例说明能力',
        '展现积极主动的工作态度',
        '说明持续学习和自我提升',
        '体现良好的人际沟通能力'
      ]
    }
  };

  const currentAdvice = categoryAdvice[questionCategory as keyof typeof categoryAdvice] || categoryAdvice.general;

  // Real-time analysis of user's answer
  const getAnswerAnalysis = () => {
    if (!currentAnswer || currentAnswer.length < 10) {
      return {
        score: 0,
        feedback: '开始回答后获得实时建议',
        suggestions: ['点击"开始回答"按钮开始录音']
      };
    }

    const text = currentAnswer.toLowerCase();
    const hasStructure = text.includes('首先') || text.includes('其次') || text.includes('最后');
    const hasNumbers = /\d+/.test(text);
    const hasKeywords = currentAdvice.keywords.some(keyword => text.includes(keyword.toLowerCase()));
    
    let score = 0;
    const suggestions = [];
    
    if (text.length > 50) score += 25;
    if (hasStructure) score += 30;
    if (hasNumbers) score += 20;
    if (hasKeywords) score += 25;
    
    if (!hasStructure) suggestions.push('建议使用"首先、其次、最后"组织回答');
    if (!hasNumbers) suggestions.push('尝试用具体数据支撑观点');
    if (!hasKeywords) suggestions.push(`结合${questionCategory}相关专业术语`);
    if (text.length < 100) suggestions.push('可以进一步丰富回答内容');

    return {
      score: Math.min(100, score),
      feedback: score >= 80 ? '回答质量很好！' : score >= 60 ? '回答还不错，可以继续优化' : '建议完善回答内容',
      suggestions: suggestions.length > 0 ? suggestions : ['回答质量良好，继续保持']
    };
  };

  const analysis = getAnswerAnalysis();

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === 'preparation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('preparation')}
          className="text-xs"
        >
          <BookOpen className="w-3 h-3 mr-1" />
          回答技巧
        </Button>
        <Button
          variant={activeTab === 'analysis' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('analysis')}
          className="text-xs"
        >
          <Target className="w-3 h-3 mr-1" />
          实时分析
        </Button>
      </div>

      {activeTab === 'preparation' && (
        <div className="space-y-4">
          {/* Preparation Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                面试回答技巧
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preparationTips.map((tip, index) => {
                  const IconComponent = tip.icon;
                  return (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${tip.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{tip.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{tip.description}</p>
                          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                            示例：{tip.example}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category-specific Advice */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
                {questionCategory === 'computer_science' ? '技术面试要点' : 
                 questionCategory === 'business' ? '商业面试要点' : '通用面试要点'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-blue-800 mb-2">关键词建议</div>
                  <div className="flex flex-wrap gap-1">
                    {currentAdvice.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-blue-800 mb-2">回答建议</div>
                  <div className="space-y-1">
                    {currentAdvice.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                        <ArrowRight className="w-3 h-3" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-4">
          {/* Real-time Answer Analysis */}
          <Card className={`${analysis.score >= 80 ? 'border-green-200 bg-green-50' : 
                            analysis.score >= 60 ? 'border-blue-200 bg-blue-50' : 
                            'border-orange-200 bg-orange-50'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" />
                回答质量分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    analysis.score >= 80 ? 'text-green-600' : 
                    analysis.score >= 60 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {analysis.score}
                  </div>
                  <div className="text-sm text-slate-600">{analysis.feedback}</div>
                </div>

                {/* Recording Status */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-red-100 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-700">正在录制 ({duration}秒)</span>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">改进建议</div>
                  <div className="space-y-1">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answer Length Indicator */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">回答长度</span>
                <span className="text-sm text-slate-600">{currentAnswer.length} 字符</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentAnswer.length >= 200 ? 'bg-green-500' : 
                    currentAnswer.length >= 100 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentAnswer.length / 200) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                建议回答长度：200字符以上
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}