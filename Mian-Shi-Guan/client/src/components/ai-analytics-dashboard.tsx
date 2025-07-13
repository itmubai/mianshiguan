import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Activity
} from 'lucide-react';

interface AnalyticsDashboardProps {
  isActive: boolean;
  currentAnswer: string;
  duration: number;
  isRecording: boolean;
}

export default function AIAnalyticsDashboard({ 
  isActive, 
  currentAnswer, 
  duration,
  isRecording 
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState({
    confidence: 85,
    clarity: 78,
    engagement: 82,
    professionalism: 88,
    emotion: '自信',
    speechRate: 145, // words per minute
    fillerWords: 2,
    keyPoints: 0
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentConfidence: 85,
    voiceStability: 92,
    responseStructure: 75,
    technicalAccuracy: 80
  });

  // Advanced AI analysis simulation
  useEffect(() => {
    if (!isActive) return;

    const analysisInterval = setInterval(() => {
      const text = currentAnswer.toLowerCase();
      
      // Advanced sentiment and confidence analysis
      const confidenceIndicators = [
        '我相信', '我确信', '我擅长', '我能够', '我有经验',
        '我负责过', '我主导了', '我成功', '我熟练掌握'
      ];
      
      const uncertaintyIndicators = [
        '可能', '也许', '大概', '应该', '或许', '不太确定',
        '我觉得', '我想', '估计', '差不多'
      ];

      const professionalTerms = [
        '项目管理', '团队协作', '技术架构', '用户体验', '数据分析',
        '算法优化', '系统设计', '代码质量', '业务逻辑', '解决方案'
      ];

      // Calculate confidence score
      const confidenceCount = confidenceIndicators.filter(term => text.includes(term)).length;
      const uncertaintyCount = uncertaintyIndicators.filter(term => text.includes(term)).length;
      const newConfidence = Math.min(95, Math.max(40, 70 + confidenceCount * 8 - uncertaintyCount * 6));

      // Calculate professionalism score
      const professionalCount = professionalTerms.filter(term => text.includes(term)).length;
      const newProfessionalism = Math.min(95, Math.max(50, 65 + professionalCount * 10));

      // Speech rate analysis (Chinese characters per second)
      const speechRate = currentAnswer.length > 0 ? (currentAnswer.length / Math.max(duration, 1)) * 60 : 0;
      const idealRate = speechRate >= 120 && speechRate <= 180;

      // Clarity based on sentence structure
      const sentences = currentAnswer.split(/[。！？]/).filter(s => s.trim().length > 0);
      const avgSentenceLength = sentences.length > 0 ? currentAnswer.length / sentences.length : 0;
      const newClarity = avgSentenceLength > 10 && avgSentenceLength < 50 ? 85 : 65;

      // Key points detection
      const keyPointIndicators = ['首先', '其次', '最后', '第一', '第二', '第三', '总结'];
      const keyPoints = keyPointIndicators.filter(term => text.includes(term)).length;

      setAnalytics(prev => ({
        confidence: newConfidence,
        clarity: newClarity,
        engagement: Math.min(95, Math.max(60, 75 + keyPoints * 5)),
        professionalism: newProfessionalism,
        emotion: newConfidence > 80 ? '自信' : newConfidence > 60 ? '平静' : '紧张',
        speechRate: Math.round(speechRate),
        fillerWords: (text.match(/那个|这个|嗯|呃/g) || []).length,
        keyPoints
      }));

      // Real-time metrics fluctuation
      setRealTimeMetrics({
        currentConfidence: Math.max(50, newConfidence + (Math.random() - 0.5) * 10),
        voiceStability: idealRate ? 90 + Math.random() * 8 : 70 + Math.random() * 15,
        responseStructure: Math.min(95, 60 + keyPoints * 15 + Math.random() * 10),
        technicalAccuracy: Math.min(95, Math.max(50, 65 + professionalCount * 12))
      });

    }, 3000);

    return () => clearInterval(analysisInterval);
  }, [isActive, currentAnswer, duration]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-blue-500 to-cyan-500';
    if (score >= 55) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const overallScore = Math.round((analytics.confidence + analytics.clarity + analytics.engagement + analytics.professionalism) / 4);

  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5 text-blue-600" />
            综合表现评分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${getScoreBg(overallScore)} bg-clip-text text-transparent`}>
              {overallScore}
            </div>
            <div className="text-sm text-slate-600">
              {overallScore >= 85 ? '优秀表现' : overallScore >= 70 ? '良好表现' : '需要提升'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>自信度</span>
              <span className={getScoreColor(analytics.confidence)}>{Math.round(analytics.confidence)}%</span>
            </div>
            <div className="flex justify-between">
              <span>清晰度</span>
              <span className={getScoreColor(analytics.clarity)}>{Math.round(analytics.clarity)}%</span>
            </div>
            <div className="flex justify-between">
              <span>参与度</span>
              <span className={getScoreColor(analytics.engagement)}>{Math.round(analytics.engagement)}%</span>
            </div>
            <div className="flex justify-between">
              <span>专业度</span>
              <span className={getScoreColor(analytics.professionalism)}>{Math.round(analytics.professionalism)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      {isRecording && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-green-800">
              <Activity className="w-5 h-5" />
              实时分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>当前自信度</span>
                <span className="font-medium">{Math.round(realTimeMetrics.currentConfidence)}%</span>
              </div>
              <Progress value={realTimeMetrics.currentConfidence} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>语音稳定性</span>
                <span className="font-medium">{Math.round(realTimeMetrics.voiceStability)}%</span>
              </div>
              <Progress value={realTimeMetrics.voiceStability} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <div className="text-slate-600">回答结构</div>
                <div className="font-medium">{Math.round(realTimeMetrics.responseStructure)}%</div>
              </div>
              <div>
                <div className="text-slate-600">技术准确性</div>
                <div className="font-medium">{Math.round(realTimeMetrics.technicalAccuracy)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Analytics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            高级分析
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.speechRate}</div>
              <div className="text-xs text-slate-600">字/分钟</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.keyPoints}</div>
              <div className="text-xs text-slate-600">关键要点</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                情绪状态
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {analytics.emotion}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Mic className="w-4 h-4 text-green-500" />
                语言流畅度
              </span>
              <span className="text-sm font-medium">
                {analytics.fillerWords <= 2 ? '流畅' : analytics.fillerWords <= 5 ? '一般' : '需改进'}
              </span>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-sm font-medium text-slate-700 mb-2">AI建议</div>
            <div className="text-xs text-slate-600 space-y-1">
              {analytics.confidence < 70 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-orange-500" />
                  <span>尝试使用更肯定的表达方式</span>
                </div>
              )}
              {analytics.keyPoints < 2 && (
                <div className="flex items-center gap-2">
                  <Target className="w-3 h-3 text-blue-500" />
                  <span>建议使用"首先、其次、最后"来组织回答</span>
                </div>
              )}
              {analytics.speechRate < 100 && (
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span>可以适当提高语速以显示自信</span>
                </div>
              )}
              {analytics.fillerWords > 3 && (
                <div className="flex items-center gap-2">
                  <Mic className="w-3 h-3 text-purple-500" />
                  <span>减少"嗯、那个"等填充词的使用</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}