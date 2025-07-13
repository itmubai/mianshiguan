import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Eye, 
  Mic, 
  Heart,
  TrendingUp,
  Award,
  Target,
  Zap,
  BarChart3,
  Activity,
  Star,
  AlertCircle,
  CheckCircle,
  Users,
  Briefcase,
  BookOpen
} from 'lucide-react';

interface InterviewIntelligenceProps {
  isActive: boolean;
  currentAnswer: string;
  duration: number;
  isRecording: boolean;
  questionCategory: string;
}

export default function InterviewIntelligenceHub({ 
  isActive, 
  currentAnswer, 
  duration,
  isRecording,
  questionCategory 
}: InterviewIntelligenceProps) {
  const [intelligenceData, setIntelligenceData] = useState({
    overallScore: 85,
    dimensions: {
      technical: 88,
      communication: 82,
      leadership: 79,
      problemSolving: 86,
      cultural: 77
    },
    realTime: {
      confidence: 85,
      clarity: 78,
      engagement: 82,
      professionalism: 88
    },
    insights: {
      strengths: ['技术表达清晰', '逻辑思维强'] as string[],
      improvements: ['增加具体案例', '提升表达自信度'] as string[],
      emotion: '专注认真',
      personality: '理性分析型'
    },
    coaching: {
      immediate: '建议使用STAR法则组织回答',
      strategic: '加强行为面试题练习',
      industry: '关注互联网行业最新技术趋势'
    }
  });

  const [performanceHistory, setPerformanceHistory] = useState([
    { metric: '自信度', previous: 78, current: 85, trend: 'up' },
    { metric: '专业度', previous: 82, current: 88, trend: 'up' },
    { metric: '表达力', previous: 75, current: 82, trend: 'up' },
    { metric: '逻辑性', previous: 80, current: 79, trend: 'stable' }
  ]);

  // Realistic AI analysis only when user provides actual responses
  useEffect(() => {
    if (!isActive || !currentAnswer || currentAnswer.length < 10) {
      // Reset to default state when no meaningful input
      setIntelligenceData(prev => ({
        ...prev,
        dimensions: {
          technical: 0,
          communication: 0,
          leadership: 0,
          problemSolving: 0,
          cultural: 0
        },
        overallScore: 0,
        insights: {
          strengths: [] as string[],
          improvements: [] as string[],
          emotion: '准备中',
          personality: '待评估'
        },
        coaching: {
          immediate: '开始录音回答问题后，AI将为您提供实时建议',
          strategic: '完成更多回答后获得个性化提升方案',
          industry: '根据您的专业背景提供行业建议'
        }
      }));
      return;
    }

    const analysisInterval = setInterval(() => {
      const text = currentAnswer.toLowerCase();
      
      // Only analyze if there's substantial content (realistic threshold)
      if (text.length < 20) return;
      
      // Industry-specific keyword analysis
      const techKeywords = ['算法', '架构', '框架', '数据库', '前端', '后端', '微服务', 'api', '代码', '技术', '开发', '编程'];
      const leadershipKeywords = ['团队', '领导', '协调', '管理', '决策', '责任', '带领', '组织'];
      const problemSolvingKeywords = ['解决', '分析', '优化', '改进', '创新', '方案', '思考', '处理'];
      
      const techCount = techKeywords.filter(k => text.includes(k)).length;
      const leadershipCount = leadershipKeywords.filter(k => text.includes(k)).length;
      const problemSolvingCount = problemSolvingKeywords.filter(k => text.includes(k)).length;
      
      // More realistic scoring based on actual content
      const techScore = Math.min(90, Math.max(0, techCount * 15 + (text.length > 50 ? 20 : 0)));
      const leadershipScore = Math.min(90, Math.max(0, leadershipCount * 18 + (text.length > 50 ? 15 : 0)));
      const problemSolvingScore = Math.min(90, Math.max(0, problemSolvingCount * 16 + (text.length > 50 ? 18 : 0)));

      // Communication quality based on structure and length
      const sentences = text.split(/[。！？]/).filter(s => s.trim().length > 0);
      const hasStructure = text.includes('首先') || text.includes('其次') || text.includes('最后') || text.includes('第一');
      const communicationScore = Math.min(90, Math.max(0, 
        (sentences.length > 2 ? 25 : 10) + 
        (hasStructure ? 20 : 0) + 
        (text.length > 100 ? 25 : text.length > 50 ? 15 : 5)
      ));

      // Cultural fit analysis
      const culturalKeywords = ['团队合作', '学习能力', '责任心', '创新', '务实', '效率', '沟通', '协作'];
      const culturalCount = culturalKeywords.filter(k => text.includes(k)).length;
      const culturalScore = Math.min(90, Math.max(0, culturalCount * 20 + (text.length > 50 ? 10 : 0)));

      // Generate realistic insights based on content
      const strengths: string[] = [];
      const improvements: string[] = [];
      
      if (techCount > 0) strengths.push('技术表达清晰');
      if (leadershipCount > 0) strengths.push('领导力体现');
      if (hasStructure) strengths.push('回答逻辑清晰');
      if (text.length > 100) strengths.push('内容详实');
      
      if (techCount === 0 && questionCategory === 'computer_science') improvements.push('增加技术细节');
      if (!hasStructure) improvements.push('建议使用结构化表达');
      if (text.length < 50) improvements.push('内容可以更充实');
      if (culturalCount === 0) improvements.push('体现团队协作能力');

      setIntelligenceData(prev => ({
        ...prev,
        dimensions: {
          technical: techScore,
          communication: communicationScore,
          leadership: leadershipScore,
          problemSolving: problemSolvingScore,
          cultural: culturalScore
        },
        overallScore: Math.round((techScore + communicationScore + leadershipScore + problemSolvingScore + culturalScore) / 5),
        insights: {
          strengths: strengths.length > 0 ? strengths : ['正在分析中...'],
          improvements: improvements.length > 0 ? improvements : ['继续完善回答'],
          emotion: text.length > 50 ? '认真回答' : '准备中',
          personality: techCount > leadershipCount ? '技术导向型' : leadershipCount > 0 ? '团队协作型' : '分析中'
        },
        coaching: {
          immediate: hasStructure ? '回答结构清晰，继续保持' : '建议使用"首先、其次、最后"组织回答',
          strategic: strengths.length > 1 ? '发挥您的优势，补强薄弱环节' : '继续丰富回答内容，展现多维能力',
          industry: techCount > 0 ? '技术表达很好，可以增加实际项目案例' : '建议结合具体技术实践经验'
        }
      }));

    }, 3000);

    return () => clearInterval(analysisInterval);
  }, [isActive, currentAnswer, questionCategory]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case 'technical': return <Zap className="w-4 h-4" />;
      case 'communication': return <Mic className="w-4 h-4" />;
      case 'leadership': return <Users className="w-4 h-4" />;
      case 'problemSolving': return <Target className="w-4 h-4" />;
      case 'cultural': return <Heart className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const dimensionLabels = {
    technical: '技术能力',
    communication: '沟通表达',
    leadership: '领导潜质', 
    problemSolving: '解决问题',
    cultural: '文化契合'
  };

  return (
    <div className="space-y-4">
      {/* AI Intelligence Score */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-purple-600" />
            AI智能评分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {intelligenceData.overallScore}
            </div>
            <div className="text-sm text-slate-600 mb-3">
              {intelligenceData.overallScore >= 85 ? '卓越表现' : 
               intelligenceData.overallScore >= 75 ? '优秀表现' : 
               intelligenceData.overallScore >= 65 ? '良好表现' : '需要提升'}
            </div>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(star => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= Math.floor(intelligenceData.overallScore/20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>

          {/* Dimension Scores */}
          <div className="space-y-3">
            {Object.entries(intelligenceData.dimensions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  {getDimensionIcon(key)}
                  <span>{dimensionLabels[key as keyof typeof dimensionLabels]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                    {Math.round(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Analysis */}
      {isRecording && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-green-800">
              <Activity className="w-5 h-5 animate-pulse" />
              实时分析中
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(intelligenceData.realTime).map(([key, value]) => (
                <div key={key} className="text-center p-2 bg-white rounded-lg">
                  <div className="font-medium text-green-700">{Math.round(value)}%</div>
                  <div className="text-xs text-green-600">
                    {key === 'confidence' ? '自信度' :
                     key === 'clarity' ? '清晰度' :
                     key === 'engagement' ? '参与度' : '专业度'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="w-5 h-5 text-blue-600" />
            智能洞察
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium text-sm">优势识别</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {intelligenceData.insights.strengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-sm">提升建议</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {intelligenceData.insights.improvements.map((improvement, index) => (
                <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                  {improvement}
                </Badge>
              ))}
            </div>
          </div>

          {/* Personality Analysis */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-700">{intelligenceData.insights.emotion}</div>
              <div className="text-xs text-blue-600">情绪状态</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-700">{intelligenceData.insights.personality}</div>
              <div className="text-xs text-purple-600">性格类型</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Coaching */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-amber-600" />
            AI教练建议
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-sm text-amber-800">即时建议</span>
            </div>
            <p className="text-sm text-amber-700 bg-white/60 p-2 rounded">
              {intelligenceData.coaching.immediate}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-sm text-amber-800">能力提升</span>
            </div>
            <p className="text-sm text-amber-700 bg-white/60 p-2 rounded">
              {intelligenceData.coaching.strategic}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            表现趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{item.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{item.previous}</span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    item.trend === 'up' ? 'bg-green-100' : 
                    item.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <TrendingUp className={`w-2 h-2 ${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600 rotate-180' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className="text-sm font-medium">{item.current}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}