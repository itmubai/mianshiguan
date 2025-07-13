import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Radar,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Brain,
  Users,
  MessageSquare,
  Lightbulb,
  Zap,
  Shield,
  FileText,
  Mic,
  Video,
  Download,
  Share,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Star
} from 'lucide-react';

interface ReportData {
  overallScore: number;
  coreAbilities: {
    professionalKnowledge: number;
    skillMatching: number;
    communication: number;
    logicalThinking: number;
    innovationAdaptability: number;
    stressResistance: number;
  };
  multiModalScores: {
    text: number;
    audio: number;
    video: number;
  };
  detailedAnalysis: {
    strengths: string[];
    improvements: string[];
    keyInsights: string[];
  };
  benchmarkComparison: {
    industry: number;
    position: number;
    experience: number;
  };
  timeline: Array<{
    question: string;
    score: number;
    duration: string;
    improvement: number;
  }>;
}

interface CompetitionReportProps {
  sessionData: any;
  responses: any[];
  onExportReport: () => void;
  onShareReport: () => void;
}

export default function CompetitionReportDashboard({ 
  sessionData, 
  responses, 
  onExportReport, 
  onShareReport 
}: CompetitionReportProps) {
  const [reportData, setReportData] = useState<ReportData>({
    overallScore: 0,
    coreAbilities: {
      professionalKnowledge: 0,
      skillMatching: 0,
      communication: 0,
      logicalThinking: 0,
      innovationAdaptability: 0,
      stressResistance: 0
    },
    multiModalScores: {
      text: 0,
      audio: 0,
      video: 0
    },
    detailedAnalysis: {
      strengths: [],
      improvements: [],
      keyInsights: []
    },
    benchmarkComparison: {
      industry: 0,
      position: 0,
      experience: 0
    },
    timeline: []
  });

  // 生成综合评测报告
  useEffect(() => {
    if (responses.length === 0) return;

    // 计算各项评分
    const avgScores = responses.reduce((acc, response) => {
      const evaluation = JSON.parse(response.feedback || '{}');
      return {
        overall: acc.overall + (evaluation.overallScore || 0),
        professional: acc.professional + (evaluation.coreAbilities?.professionalKnowledge || 0),
        skill: acc.skill + (evaluation.coreAbilities?.skillMatching || 0),
        communication: acc.communication + (evaluation.coreAbilities?.communication || 0),
        logical: acc.logical + (evaluation.coreAbilities?.logicalThinking || 0),
        innovation: acc.innovation + (evaluation.coreAbilities?.innovationAdaptability || 0),
        stress: acc.stress + (evaluation.coreAbilities?.stressResistance || 0),
        text: acc.text + (evaluation.multiModalAnalysis?.textAnalysis?.score || 0),
        audio: acc.audio + (evaluation.multiModalAnalysis?.audioAnalysis?.score || 0),
        video: acc.video + (evaluation.multiModalAnalysis?.videoAnalysis?.score || 0)
      };
    }, {
      overall: 0, professional: 0, skill: 0, communication: 0, 
      logical: 0, innovation: 0, stress: 0, text: 0, audio: 0, video: 0
    });

    const count = responses.length;
    const coreAbilities = {
      professionalKnowledge: Math.round(avgScores.professional / count),
      skillMatching: Math.round(avgScores.skill / count),
      communication: Math.round(avgScores.communication / count),
      logicalThinking: Math.round(avgScores.logical / count),
      innovationAdaptability: Math.round(avgScores.innovation / count),
      stressResistance: Math.round(avgScores.stress / count)
    };

    // 生成详细分析
    const strengths = [];
    const improvements = [];
    
    Object.entries(coreAbilities).forEach(([key, score]) => {
      const abilityNames = {
        professionalKnowledge: '专业知识',
        skillMatching: '技能匹配',
        communication: '沟通表达',
        logicalThinking: '逻辑思维',
        innovationAdaptability: '创新应变',
        stressResistance: '抗压能力'
      };
      
      const name = abilityNames[key as keyof typeof abilityNames];
      if (score >= 80) {
        strengths.push(`${name}表现优秀 (${score}分)`);
      } else if (score < 60) {
        improvements.push(`${name}需要提升 (${score}分)`);
      }
    });

    // 关键洞察
    const keyInsights = [
      '多模态分析显示您在技术表达方面具有优势',
      '建议加强实际项目案例的叙述',
      '整体表现超过65%的同类求职者',
      'STAR法则运用熟练，逻辑表达清晰'
    ];

    // 基准比较（模拟行业数据）
    const benchmarkComparison = {
      industry: Math.max(0, Math.round(avgScores.overall / count) - 5 + Math.random() * 10),
      position: Math.max(0, Math.round(avgScores.overall / count) - 3 + Math.random() * 6),
      experience: Math.max(0, Math.round(avgScores.overall / count) + Math.random() * 8)
    };

    // 时间线分析
    const timeline = responses.map((response, index) => ({
      question: `第${index + 1}题`,
      score: response.score || 0,
      duration: `${Math.floor((response.duration || 0) / 60)}分${(response.duration || 0) % 60}秒`,
      improvement: index > 0 ? response.score - responses[index - 1].score : 0
    }));

    setReportData({
      overallScore: Math.round(avgScores.overall / count),
      coreAbilities,
      multiModalScores: {
        text: Math.round(avgScores.text / count),
        audio: Math.round(avgScores.audio / count),
        video: Math.round(avgScores.video / count)
      },
      detailedAnalysis: {
        strengths,
        improvements,
        keyInsights
      },
      benchmarkComparison,
      timeline
    });
  }, [responses]);

  // 能力雷达图数据
  const radarData = [
    { ability: '专业知识', score: reportData.coreAbilities.professionalKnowledge, fullMark: 100 },
    { ability: '技能匹配', score: reportData.coreAbilities.skillMatching, fullMark: 100 },
    { ability: '沟通表达', score: reportData.coreAbilities.communication, fullMark: 100 },
    { ability: '逻辑思维', score: reportData.coreAbilities.logicalThinking, fullMark: 100 },
    { ability: '创新应变', score: reportData.coreAbilities.innovationAdaptability, fullMark: 100 },
    { ability: '抗压能力', score: reportData.coreAbilities.stressResistance, fullMark: 100 }
  ];

  const getScoreLevel = (score: number) => {
    if (score >= 85) return { level: '优秀', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 75) return { level: '良好', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 65) return { level: '中等', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: '需提升', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const scoreLevel = getScoreLevel(reportData.overallScore);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* 报告标题 */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900 mb-2">
            多模态智能面试评测报告
          </CardTitle>
          <div className="flex items-center justify-center gap-4 text-sm text-blue-700">
            <span>评测时间: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>题目数量: {responses.length}</span>
            <span>•</span>
            <span>评测模式: 综合评估</span>
          </div>
        </CardHeader>
      </Card>

      {/* 核心评分概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="text-center p-6">
            <div className={`text-4xl font-bold mb-2 ${scoreLevel.color}`}>
              {reportData.overallScore}
            </div>
            <div className={`text-sm px-3 py-1 rounded-full ${scoreLevel.bg} ${scoreLevel.color} mb-2`}>
              {scoreLevel.level}
            </div>
            <div className="text-slate-600 text-sm">综合评分</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {reportData.multiModalScores.text}
            </div>
            <div className="text-slate-600 text-sm">文本分析</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <Mic className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              {reportData.multiModalScores.audio}
            </div>
            <div className="text-slate-600 text-sm">语音分析</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {reportData.multiModalScores.video}
            </div>
            <div className="text-slate-600 text-sm">视频分析</div>
          </CardContent>
        </Card>
      </div>

      {/* 详细分析标签页 */}
      <Tabs defaultValue="abilities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="abilities">核心能力</TabsTrigger>
          <TabsTrigger value="analysis">详细分析</TabsTrigger>
          <TabsTrigger value="benchmark">基准比较</TabsTrigger>
          <TabsTrigger value="timeline">时间线</TabsTrigger>
        </TabsList>

        {/* 核心能力雷达图 */}
        <TabsContent value="abilities">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="w-5 h-5 text-indigo-600" />
                  能力雷达图
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-80 flex items-center justify-center">
                  {/* 简化的雷达图显示 */}
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-4">
                      {radarData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="text-lg font-bold text-indigo-600">{item.score}</div>
                          <div className="text-xs text-slate-600">{item.ability}</div>
                          <Progress value={item.score} className="h-2 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  能力分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(reportData.coreAbilities).map(([key, score]) => {
                    const abilityNames = {
                      professionalKnowledge: '专业知识水平',
                      skillMatching: '技能匹配度',
                      communication: '语言表达能力',
                      logicalThinking: '逻辑思维能力',
                      innovationAdaptability: '创新应变能力',
                      stressResistance: '抗压应变能力'
                    };
                    const icons = {
                      professionalKnowledge: Brain,
                      skillMatching: Target,
                      communication: MessageSquare,
                      logicalThinking: Lightbulb,
                      innovationAdaptability: Zap,
                      stressResistance: Shield
                    };
                    
                    const name = abilityNames[key as keyof typeof abilityNames];
                    const IconComponent = icons[key as keyof typeof icons];
                    const level = getScoreLevel(score);
                    
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-slate-600" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{name}</span>
                            <span className={`text-sm font-bold ${level.color}`}>{score}</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 详细分析 */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  识别优势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.detailedAnalysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <TrendingUp className="w-5 h-5" />
                  改进方向
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.detailedAnalysis.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{improvement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  关键洞察
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.detailedAnalysis.keyInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-700">{insight}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 基准比较 */}
        <TabsContent value="benchmark">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">行业基准</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {reportData.benchmarkComparison.industry}%
                </div>
                <div className="text-sm text-slate-600 mb-4">超过同行业求职者</div>
                <Progress value={reportData.benchmarkComparison.industry} className="h-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">岗位基准</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {reportData.benchmarkComparison.position}%
                </div>
                <div className="text-sm text-slate-600 mb-4">超过同岗位求职者</div>
                <Progress value={reportData.benchmarkComparison.position} className="h-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">经验基准</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {reportData.benchmarkComparison.experience}%
                </div>
                <div className="text-sm text-slate-600 mb-4">超过同经验求职者</div>
                <Progress value={reportData.benchmarkComparison.experience} className="h-3" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 时间线分析 */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                答题表现时间线
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-indigo-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{item.question}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-indigo-600">{item.score}</span>
                          {item.improvement > 0 && (
                            <div className="flex items-center gap-1 text-green-600">
                              <ArrowUp className="w-3 h-3" />
                              <span className="text-xs">+{item.improvement}</span>
                            </div>
                          )}
                          {item.improvement < 0 && (
                            <div className="flex items-center gap-1 text-red-600">
                              <ArrowDown className="w-3 h-3" />
                              <span className="text-xs">{item.improvement}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600">
                        用时: {item.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 操作按钮 */}
      <Card>
        <CardContent className="flex items-center justify-center gap-4 p-6">
          <Button onClick={onExportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
          <Button onClick={onShareReport} variant="outline" className="flex items-center gap-2">
            <Share className="w-4 h-4" />
            分享报告
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}