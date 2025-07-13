import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  MessageSquare, 
  Lightbulb, 
  Users, 
  Zap, 
  Shield, 
  TrendingUp,
  Eye,
  Mic,
  Video,
  FileText,
  BarChart3,
  Radar,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface EvaluationProps {
  currentAnswer: string;
  videoAnalysis: any;
  audioAnalysis: any;
  questionCategory: string;
  duration: number;
  isRecording: boolean;
}

interface CoreAbility {
  id: string;
  name: string;
  score: number;
  weight: number;
  icon: any;
  color: string;
  description: string;
  subMetrics: {
    name: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export default function CompetitionEvaluationSystem({ 
  currentAnswer, 
  videoAnalysis, 
  audioAnalysis, 
  questionCategory, 
  duration,
  isRecording 
}: EvaluationProps) {
  const [evaluationData, setEvaluationData] = useState({
    overallScore: 0,
    coreAbilities: [] as CoreAbility[],
    multiModalAnalysis: {
      textAnalysis: { score: 0, insights: [] as string[] },
      audioAnalysis: { score: 0, insights: [] as string[] },
      videoAnalysis: { score: 0, insights: [] as string[] }
    },
    improvementSuggestions: [] as string[],
    competitiveAdvantages: [] as string[],
    learningPath: [] as any[]
  });

  // 五大核心能力指标评估
  const initializeCoreAbilities = (): CoreAbility[] => [
    {
      id: 'professional_knowledge',
      name: '专业知识水平',
      score: 0,
      weight: 0.25,
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      description: '专业技术深度与广度',
      subMetrics: [
        { name: '技术理论', score: 0, trend: 'stable' },
        { name: '实践应用', score: 0, trend: 'stable' },
        { name: '前沿认知', score: 0, trend: 'stable' }
      ]
    },
    {
      id: 'skill_matching',
      name: '技能匹配度',
      score: 0,
      weight: 0.2,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      description: '与岗位需求的匹配程度',
      subMetrics: [
        { name: '核心技能', score: 0, trend: 'stable' },
        { name: '工具熟练度', score: 0, trend: 'stable' },
        { name: '经验相关性', score: 0, trend: 'stable' }
      ]
    },
    {
      id: 'communication',
      name: '语言表达能力',
      score: 0,
      weight: 0.2,
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      description: '口头表达与沟通技巧',
      subMetrics: [
        { name: '表达清晰度', score: 0, trend: 'stable' },
        { name: '逻辑结构', score: 0, trend: 'stable' },
        { name: '语音语调', score: 0, trend: 'stable' }
      ]
    },
    {
      id: 'logical_thinking',
      name: '逻辑思维能力',
      score: 0,
      weight: 0.15,
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      description: '问题分析与解决能力',
      subMetrics: [
        { name: '问题理解', score: 0, trend: 'stable' },
        { name: '思路清晰', score: 0, trend: 'stable' },
        { name: '解决方案', score: 0, trend: 'stable' }
      ]
    },
    {
      id: 'innovation_adaptability',
      name: '创新应变能力',
      score: 0,
      weight: 0.1,
      icon: Zap,
      color: 'from-indigo-500 to-purple-500',
      description: '创新思维与应变能力',
      subMetrics: [
        { name: '创新思维', score: 0, trend: 'stable' },
        { name: '应变能力', score: 0, trend: 'stable' },
        { name: '学习适应', score: 0, trend: 'stable' }
      ]
    },
    {
      id: 'stress_resistance',
      name: '抗压应变能力',
      score: 0,
      weight: 0.1,
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      description: '压力处理与情绪控制',
      subMetrics: [
        { name: '情绪稳定', score: 0, trend: 'stable' },
        { name: '压力应对', score: 0, trend: 'stable' },
        { name: '自信表现', score: 0, trend: 'stable' }
      ]
    }
  ];

  // 多模态数据分析
  useEffect(() => {
    if (!currentAnswer || currentAnswer.length < 10) {
      setEvaluationData(prev => ({
        ...prev,
        overallScore: 0,
        coreAbilities: initializeCoreAbilities()
      }));
      return;
    }

    const analysisInterval = setInterval(() => {
      const textAnalysis = analyzeTextContent(currentAnswer, questionCategory);
      const audioData = analyzeAudioFeatures(audioAnalysis, duration);
      const videoData = analyzeVideoFeatures(videoAnalysis);
      
      const coreAbilities = calculateCoreAbilities(textAnalysis, audioData, videoData, questionCategory);
      const overallScore = calculateOverallScore(coreAbilities);
      
      setEvaluationData({
        overallScore,
        coreAbilities,
        multiModalAnalysis: {
          textAnalysis: textAnalysis,
          audioAnalysis: audioData,
          videoAnalysis: videoData
        },
        improvementSuggestions: generateImprovementSuggestions(coreAbilities, textAnalysis),
        competitiveAdvantages: identifyStrengths(coreAbilities),
        learningPath: generateLearningPath(coreAbilities, questionCategory)
      });
    }, 3000);

    return () => clearInterval(analysisInterval);
  }, [currentAnswer, audioAnalysis, videoAnalysis, questionCategory, duration]);

  // 文本内容分析
  function analyzeTextContent(text: string, category: string) {
    const lowerText = text.toLowerCase();
    
    // 技术关键词分析
    const techKeywords = {
      'artificial_intelligence': ['机器学习', 'ai', '算法', '模型', '神经网络', '深度学习'],
      'big_data': ['大数据', 'hadoop', 'spark', '数据分析', '数据挖掘', '分布式'],
      'iot': ['物联网', '传感器', '嵌入式', '边缘计算', '协议', '设备'],
      'intelligent_systems': ['智能系统', '控制', '自动化', '决策', '优化'],
      'technical': ['编程', '开发', '架构', '系统', '技术', '项目']
    };
    
    const relevantKeywords = techKeywords[category as keyof typeof techKeywords] || techKeywords.technical;
    const keywordMatches = relevantKeywords.filter(keyword => lowerText.includes(keyword)).length;
    
    // STAR结构分析
    const starIndicators = ['情况', '任务', '行动', '结果', '首先', '其次', '最后', '具体来说'];
    const hasStructure = starIndicators.some(indicator => lowerText.includes(indicator));
    
    // 数据支撑分析
    const hasNumbers = /\d+[%个项次年月]/.test(text);
    const hasMetrics = /提升|增长|下降|改进|优化/.test(lowerText);
    
    // 专业深度分析
    const technicalTerms = /架构|框架|算法|性能|优化|设计模式|数据结构/.test(lowerText);
    const practicalExperience = /项目|实习|开发|实现|负责|参与/.test(lowerText);
    
    const baseScore = Math.min(90, 
      (text.length > 100 ? 25 : text.length / 4) +
      (keywordMatches * 10) +
      (hasStructure ? 20 : 0) +
      (hasNumbers ? 15 : 0) +
      (hasMetrics ? 10 : 0) +
      (technicalTerms ? 15 : 0) +
      (practicalExperience ? 10 : 0)
    );

    return {
      score: Math.round(baseScore),
      insights: [
        ...(keywordMatches > 0 ? [`专业词汇运用良好 (${keywordMatches}个关键词)`] : ['建议增加专业术语']),
        ...(hasStructure ? ['回答结构清晰'] : ['建议使用STAR法则组织回答']),
        ...(hasNumbers ? ['数据支撑充分'] : ['建议增加具体数据']),
        ...(technicalTerms ? ['技术深度体现良好'] : ['可以深入技术细节']),
        ...(practicalExperience ? ['实践经验丰富'] : ['建议结合实际项目经验'])
      ],
      metrics: {
        keywordDensity: (keywordMatches / relevantKeywords.length) * 100,
        structuralClarity: hasStructure ? 85 : 45,
        dataSupport: hasNumbers ? 80 : 30,
        technicalDepth: technicalTerms ? 75 : 35,
        practicalRelevance: practicalExperience ? 80 : 40
      }
    };
  }

  // 音频特征分析
  function analyzeAudioFeatures(audioData: any, duration: number) {
    // 基于录制时长和预期回答质量的评估
    const expectedDuration = 120; // 2分钟
    const durationScore = duration > 0 ? Math.min(90, (duration / expectedDuration) * 100) : 0;
    
    // 模拟音频分析结果
    const fluencyScore = duration > 30 ? Math.min(85, 60 + Math.random() * 25) : 0;
    const paceScore = duration > 60 ? Math.min(80, 65 + Math.random() * 15) : 0;
    const clarityScore = duration > 20 ? Math.min(90, 70 + Math.random() * 20) : 0;
    
    const averageScore = (durationScore + fluencyScore + paceScore + clarityScore) / 4;
    
    return {
      score: Math.round(averageScore),
      insights: [
        ...(duration > 60 ? ['语音时长适中'] : ['建议延长回答时间']),
        ...(fluencyScore > 70 ? ['表达流畅度良好'] : ['可以提升表达流畅度']),
        ...(paceScore > 70 ? ['语速适中'] : ['建议调整语速']),
        ...(clarityScore > 70 ? ['发音清晰'] : ['注意发音清晰度'])
      ],
      metrics: {
        duration: duration,
        fluency: fluencyScore,
        pace: paceScore,
        clarity: clarityScore
      }
    };
  }

  // 视频特征分析
  function analyzeVideoFeatures(videoData: any) {
    // 模拟视频分析结果
    const isRecordingActive = isRecording;
    const eyeContactScore = isRecordingActive ? Math.min(85, 65 + Math.random() * 20) : 0;
    const postureScore = isRecordingActive ? Math.min(80, 70 + Math.random() * 10) : 0;
    const expressionScore = isRecordingActive ? Math.min(90, 75 + Math.random() * 15) : 0;
    const confidenceScore = isRecordingActive ? Math.min(85, 70 + Math.random() * 15) : 0;
    
    const averageScore = (eyeContactScore + postureScore + expressionScore + confidenceScore) / 4;
    
    return {
      score: Math.round(averageScore),
      insights: [
        ...(eyeContactScore > 70 ? ['眼神交流良好'] : ['建议增加眼神交流']),
        ...(postureScore > 70 ? ['坐姿端正'] : ['注意坐姿表现']),
        ...(expressionScore > 70 ? ['表情自然'] : ['表情可以更自然']),
        ...(confidenceScore > 70 ? ['展现自信'] : ['建议增强自信表现'])
      ],
      metrics: {
        eyeContact: eyeContactScore,
        posture: postureScore,
        expression: expressionScore,
        confidence: confidenceScore
      }
    };
  }

  // 计算核心能力评分
  function calculateCoreAbilities(textAnalysis: any, audioAnalysis: any, videoAnalysis: any, category: string): CoreAbility[] {
    const abilities = initializeCoreAbilities();
    
    abilities.forEach(ability => {
      switch (ability.id) {
        case 'professional_knowledge':
          ability.score = Math.round((textAnalysis.metrics.keywordDensity + textAnalysis.metrics.technicalDepth) / 2);
          ability.subMetrics[0].score = textAnalysis.metrics.technicalDepth;
          ability.subMetrics[1].score = textAnalysis.metrics.practicalRelevance;
          ability.subMetrics[2].score = textAnalysis.metrics.keywordDensity;
          break;
        
        case 'skill_matching':
          ability.score = Math.round((textAnalysis.metrics.practicalRelevance + textAnalysis.metrics.keywordDensity) / 2);
          ability.subMetrics[0].score = textAnalysis.metrics.keywordDensity;
          ability.subMetrics[1].score = textAnalysis.metrics.technicalDepth;
          ability.subMetrics[2].score = textAnalysis.metrics.practicalRelevance;
          break;
        
        case 'communication':
          ability.score = Math.round((audioAnalysis.metrics.fluency + audioAnalysis.metrics.clarity + textAnalysis.metrics.structuralClarity) / 3);
          ability.subMetrics[0].score = audioAnalysis.metrics.clarity;
          ability.subMetrics[1].score = textAnalysis.metrics.structuralClarity;
          ability.subMetrics[2].score = audioAnalysis.metrics.pace;
          break;
        
        case 'logical_thinking':
          ability.score = Math.round((textAnalysis.metrics.structuralClarity + textAnalysis.metrics.dataSupport) / 2);
          ability.subMetrics[0].score = textAnalysis.score > 60 ? 80 : 50;
          ability.subMetrics[1].score = textAnalysis.metrics.structuralClarity;
          ability.subMetrics[2].score = textAnalysis.metrics.dataSupport;
          break;
        
        case 'innovation_adaptability':
          ability.score = Math.round((textAnalysis.score + videoAnalysis.metrics.confidence) / 2);
          ability.subMetrics[0].score = textAnalysis.score > 70 ? 75 : 50;
          ability.subMetrics[1].score = videoAnalysis.metrics.confidence;
          ability.subMetrics[2].score = textAnalysis.metrics.practicalRelevance;
          break;
        
        case 'stress_resistance':
          ability.score = Math.round((videoAnalysis.metrics.confidence + audioAnalysis.metrics.fluency + videoAnalysis.metrics.expression) / 3);
          ability.subMetrics[0].score = videoAnalysis.metrics.expression;
          ability.subMetrics[1].score = videoAnalysis.metrics.confidence;
          ability.subMetrics[2].score = audioAnalysis.metrics.fluency;
          break;
      }
      
      // 设置趋势
      ability.subMetrics.forEach(metric => {
        if (metric.score > 75) metric.trend = 'up';
        else if (metric.score < 50) metric.trend = 'down';
        else metric.trend = 'stable';
      });
    });
    
    return abilities;
  }

  // 计算总体评分
  function calculateOverallScore(abilities: CoreAbility[]): number {
    const weightedSum = abilities.reduce((sum, ability) => sum + (ability.score * ability.weight), 0);
    return Math.round(weightedSum);
  }

  // 生成改进建议
  function generateImprovementSuggestions(abilities: CoreAbility[], textAnalysis: any) {
    const suggestions = [];
    
    abilities.forEach(ability => {
      if (ability.score < 70) {
        switch (ability.id) {
          case 'professional_knowledge':
            suggestions.push('深入学习专业技术知识，关注行业前沿发展');
            break;
          case 'skill_matching':
            suggestions.push('提升与目标岗位相关的核心技能');
            break;
          case 'communication':
            suggestions.push('加强口头表达训练，提升沟通技巧');
            break;
          case 'logical_thinking':
            suggestions.push('使用STAR法则组织回答，增强逻辑性');
            break;
          case 'innovation_adaptability':
            suggestions.push('培养创新思维，增强问题解决能力');
            break;
          case 'stress_resistance':
            suggestions.push('提升心理素质，增强面试自信心');
            break;
        }
      }
    });
    
    if (textAnalysis.metrics.dataSupport < 50) {
      suggestions.push('在回答中增加具体数据和案例支撑');
    }
    
    return suggestions;
  }

  // 识别优势
  function identifyStrengths(abilities: CoreAbility[]) {
    return abilities
      .filter(ability => ability.score >= 75)
      .map(ability => `${ability.name}表现优秀 (${ability.score}分)`);
  }

  // 生成学习路径
  function generateLearningPath(abilities: CoreAbility[], category: string) {
    const weakAreas = abilities.filter(ability => ability.score < 70);
    const path = [];
    
    if (weakAreas.some(a => a.id === 'professional_knowledge')) {
      path.push({
        area: '专业知识提升',
        resources: ['技术文档深度学习', '开源项目源码分析', '技术社区参与讨论'],
        priority: 'high'
      });
    }
    
    if (weakAreas.some(a => a.id === 'communication')) {
      path.push({
        area: '表达能力训练',
        resources: ['演讲练习', '面试模拟训练', '逻辑思维训练'],
        priority: 'medium'
      });
    }
    
    if (weakAreas.some(a => a.id === 'logical_thinking')) {
      path.push({
        area: '逻辑思维强化',
        resources: ['STAR法则练习', '案例分析训练', '结构化思维培训'],
        priority: 'high'
      });
    }
    
    return path;
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-green-500" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-red-500" />;
      default: return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 总体评分卡片 */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Award className="w-6 h-6 text-blue-600" />
            多模态智能评测
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(evaluationData.overallScore)}`}>
              {evaluationData.overallScore}
            </div>
            <div className="text-lg text-slate-600">
              {evaluationData.overallScore >= 85 ? '优秀' : 
               evaluationData.overallScore >= 75 ? '良好' : 
               evaluationData.overallScore >= 65 ? '中等' : '需提升'}
            </div>
          </div>

          {/* 多模态分析概览 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <FileText className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="font-bold text-blue-600">{evaluationData.multiModalAnalysis.textAnalysis.score}</div>
              <div className="text-xs text-slate-600">文本分析</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <Mic className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="font-bold text-green-600">{evaluationData.multiModalAnalysis.audioAnalysis.score}</div>
              <div className="text-xs text-slate-600">语音分析</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <Video className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <div className="font-bold text-purple-600">{evaluationData.multiModalAnalysis.videoAnalysis.score}</div>
              <div className="text-xs text-slate-600">视频分析</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 核心能力雷达图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-indigo-600" />
            核心能力评估
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluationData.coreAbilities.map((ability) => {
              const IconComponent = ability.icon;
              return (
                <div key={ability.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${ability.color}`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{ability.name}</div>
                        <div className="text-xs text-slate-500">{ability.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(ability.score)}`}>
                        {ability.score}
                      </div>
                      <div className="text-xs text-slate-500">权重 {(ability.weight * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  
                  <div className="ml-12">
                    <Progress value={ability.score} className="h-2 mb-2" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {ability.subMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-1 bg-slate-50 rounded">
                          <span className="text-slate-600">{metric.name}</span>
                          <div className="flex items-center gap-1">
                            <span className={getScoreColor(metric.score)}>{metric.score}</span>
                            {getTrendIcon(metric.trend)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 改进建议 */}
      {evaluationData.improvementSuggestions.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="w-5 h-5" />
              改进建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {evaluationData.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-orange-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 竞争优势 */}
      {evaluationData.competitiveAdvantages.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              竞争优势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {evaluationData.competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>{advantage}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 个性化学习路径 */}
      {evaluationData.learningPath.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              个性化学习路径
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluationData.learningPath.map((path, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{path.area}</h4>
                    <Badge variant={path.priority === 'high' ? 'destructive' : 'secondary'}>
                      {path.priority === 'high' ? '高优先级' : '中优先级'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {path.resources.map((resource, resIndex) => (
                      <div key={resIndex} className="text-sm text-slate-600">
                        • {resource}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}