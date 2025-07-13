import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  BarChart3, 
  PieChart,
  Calendar,
  Award,
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface InterviewAnalyticsProps {
  userId: number;
}

interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  improvementRate: number;
  weakestAreas: string[];
  strongestAreas: string[];
  recentPerformance: Array<{
    date: string;
    score: number;
    category: string;
  }>;
  skillBreakdown: {
    technical: number;
    communication: number;
    problemSolving: number;
    confidence: number;
  };
  timeAnalysis: {
    averageResponseTime: number;
    optimalTimeRange: string;
    timeConsistency: number;
  };
}

export default function InterviewAnalytics({ userId }: InterviewAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    // 模拟获取分析数据
    const mockData: AnalyticsData = {
      totalInterviews: 12,
      averageScore: 73,
      improvementRate: 15.3,
      weakestAreas: ['技术深度', '项目经验', '沟通表达'],
      strongestAreas: ['基础知识', '学习态度', '团队合作'],
      recentPerformance: [
        { date: '2024-01-15', score: 68, category: 'technical' },
        { date: '2024-01-18', score: 75, category: 'behavioral' },
        { date: '2024-01-22', score: 82, category: 'technical' },
        { date: '2024-01-25', score: 79, category: 'comprehensive' },
        { date: '2024-01-28', score: 85, category: 'behavioral' },
      ],
      skillBreakdown: {
        technical: 70,
        communication: 78,
        problemSolving: 65,
        confidence: 82
      },
      timeAnalysis: {
        averageResponseTime: 145,
        optimalTimeRange: '120-180秒',
        timeConsistency: 75
      }
    };
    
    setAnalytics(mockData);
  }, [userId, selectedTimeframe]);

  if (!analytics) {
    return <div>加载中...</div>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (rate: number) => {
    if (rate > 5) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (rate < -5) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 总览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总面试次数</p>
                <p className="text-2xl font-bold">{analytics.totalInterviews}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均分数</p>
                <p className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                  {analytics.averageScore}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">进步幅度</p>
                <div className="flex items-center gap-1">
                  <p className={`text-2xl font-bold ${analytics.improvementRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.improvementRate > 0 ? '+' : ''}{analytics.improvementRate}%
                  </p>
                  {getTrendIcon(analytics.improvementRate)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均用时</p>
                <p className="text-2xl font-bold">{analytics.timeAnalysis.averageResponseTime}s</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">表现分析</TabsTrigger>
          <TabsTrigger value="skills">技能评估</TabsTrigger>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="recommendations">改进建议</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  优势领域
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.strongestAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">{area}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">优秀</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  待提升领域
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.weakestAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">{area}</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">需改进</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                最近表现趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentPerformance.map((performance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">{performance.date}</div>
                      <Badge variant="outline">{performance.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(performance.score)} ${getScoreColor(performance.score)}`}>
                        {performance.score}分
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                技能维度评估
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(analytics.skillBreakdown).map(([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      {skill === 'technical' ? '技术能力' : 
                       skill === 'communication' ? '沟通表达' :
                       skill === 'problemSolving' ? '问题解决' : '自信程度'}
                    </span>
                    <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                  </div>
                  <Progress value={score} className="h-3" />
                  <div className="text-sm text-gray-500">
                    {score >= 80 ? '优秀 - 保持当前水平' :
                     score >= 60 ? '良好 - 可进一步提升' : '需要重点改进'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                时间控制分析
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.timeAnalysis.averageResponseTime}s</div>
                  <div className="text-sm text-blue-800">平均回答时长</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{analytics.timeAnalysis.optimalTimeRange}</div>
                  <div className="text-sm text-green-800">建议时长范围</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analytics.timeAnalysis.timeConsistency}%</div>
                  <div className="text-sm text-purple-800">时间稳定性</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                学习成长轨迹
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">+{analytics.improvementRate}%</div>
                  <div className="text-gray-600">相比上月提升幅度</div>
                  <div className="text-sm text-gray-500 mt-2">持续练习让你越来越优秀！</div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">最近改进最快的技能</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span>沟通表达</span>
                        <span className="text-green-600 font-medium">+12%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span>自信程度</span>
                        <span className="text-green-600 font-medium">+8%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">需要持续关注的领域</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span>技术深度</span>
                        <span className="text-orange-600 font-medium">持平</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span>项目经验</span>
                        <span className="text-orange-600 font-medium">+2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  学习建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold text-blue-800">技术提升</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• 完成2-3个完整项目并准备演示</li>
                      <li>• 深入学习核心算法和数据结构</li>
                      <li>• 关注最新技术趋势和行业动态</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold text-green-800">表达能力</h4>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• 练习STAR方法回答问题</li>
                      <li>• 多参与小组讨论和演讲</li>
                      <li>• 录制视频练习并自我评估</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  实践建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold text-purple-800">模拟练习</h4>
                    <ul className="text-sm text-purple-700 mt-2 space-y-1">
                      <li>• 每周至少进行2次模拟面试</li>
                      <li>• 邀请同学或老师给予反馈</li>
                      <li>• 针对薄弱环节重点练习</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold text-orange-800">实际准备</h4>
                    <ul className="text-sm text-orange-700 mt-2 space-y-1">
                      <li>• 研究目标公司和岗位要求</li>
                      <li>• 准备5-8个不同类型的问题</li>
                      <li>• 整理作品集和项目说明</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>个性化学习计划</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-blue-600">第1周</div>
                    <div className="text-sm text-gray-600 mt-2">基础知识巩固</div>
                    <div className="text-xs text-gray-500 mt-1">专业课程复习</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-green-600">第2周</div>
                    <div className="text-sm text-gray-600 mt-2">项目经验整理</div>
                    <div className="text-xs text-gray-500 mt-1">案例准备</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-purple-600">第3周</div>
                    <div className="text-sm text-gray-600 mt-2">模拟面试强化</div>
                    <div className="text-xs text-gray-500 mt-1">实战练习</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}