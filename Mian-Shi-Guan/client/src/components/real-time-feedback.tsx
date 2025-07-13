import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Eye, 
  Mic, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';

interface RealTimeFeedbackProps {
  isActive: boolean;
  currentAnswer: string;
  duration: number;
  expectedDuration: number;
}

export default function RealTimeFeedback({ 
  isActive, 
  currentAnswer, 
  duration, 
  expectedDuration 
}: RealTimeFeedbackProps) {
  const [confidenceScore, setConfidenceScore] = useState(75);
  const [speechPace, setSpeechPace] = useState(85);
  const [contentQuality, setContentQuality] = useState(70);
  const [eyeContact, setEyeContact] = useState(80);

  // 模拟实时AI分析更新
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // 基于回答内容动态调整分数
      const answerLength = currentAnswer.length;
      const hasStructure = currentAnswer.includes('首先') || currentAnswer.includes('其次');
      const hasExamples = currentAnswer.includes('例如') || currentAnswer.includes('比如');
      
      // 自信度分析
      const confidenceWords = ['相信', '确信', '能够', '擅长', '熟练'];
      const hesitationWords = ['可能', '也许', '大概', '应该'];
      const confidenceCount = confidenceWords.filter(word => currentAnswer.includes(word)).length;
      const hesitationCount = hesitationWords.filter(word => currentAnswer.includes(word)).length;
      
      setConfidenceScore(Math.min(95, 65 + confidenceCount * 8 - hesitationCount * 5 + Math.random() * 10));
      
      // 语速分析
      const wordsPerSecond = answerLength / Math.max(duration, 1);
      setSpeechPace(Math.min(95, 60 + Math.min(30, wordsPerSecond * 10) + Math.random() * 10));
      
      // 内容质量分析
      let quality = 50;
      if (answerLength > 50) quality += 20;
      if (hasStructure) quality += 15;
      if (hasExamples) quality += 15;
      setContentQuality(Math.min(95, quality + Math.random() * 10));
      
      // 眼神接触模拟
      setEyeContact(Math.min(95, 70 + Math.random() * 20));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, currentAnswer, duration]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metrics = [
    {
      icon: Brain,
      label: '自信度',
      score: confidenceScore,
      description: '语调和用词自信程度'
    },
    {
      icon: Mic,
      label: '语速',
      score: speechPace,
      description: '语速适中性评估'
    },
    {
      icon: Target,
      label: '内容质量',
      score: contentQuality,
      description: '回答结构和深度'
    },
    {
      icon: Eye,
      label: '眼神交流',
      score: eyeContact,
      description: '与镜头的眼神接触'
    }
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">实时AI分析</h3>
          {isActive && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
              分析中
            </Badge>
          )}
        </div>

        {isActive ? (
          <div className="space-y-6">
            {/* 综合评分 */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {Math.round((confidenceScore + speechPace + contentQuality + eyeContact) / 4)}
              </div>
              <div className="text-sm text-slate-600">综合表现分数</div>
            </div>

            {/* 详细指标 */}
            <div className="space-y-4">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">
                          {metric.label}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(metric.score)}`}>
                        {Math.round(metric.score)}%
                      </span>
                    </div>
                    <Progress 
                      value={metric.score} 
                      className="h-2"
                    />
                    <div className="text-xs text-slate-500">
                      {metric.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 实时建议 */}
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">实时建议</span>
              </div>
              <div className="text-sm text-yellow-700">
                {contentQuality < 70 && "建议增加具体例子支撑观点"}
                {confidenceScore < 70 && "可以更自信地表达您的观点"}
                {speechPace < 70 && "适当调整语速，保持流畅"}
                {eyeContact < 70 && "注意与镜头的眼神交流"}
                {Math.min(contentQuality, confidenceScore, speechPace, eyeContact) >= 70 && "表现很好，继续保持！"}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">
              开始回答后将启动AI实时分析
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}