import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Trophy, 
  Target, 
  Star, 
  Medal,
  Crown,
  Flame,
  Lock,
  Calendar,
  BarChart3
} from "lucide-react";
import { getCategoryName, getScoreColor } from "@/lib/utils";
import type { UserProgress, Achievement } from "@shared/schema";

export default function Progress() {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">加载进度数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  const progress: UserProgress[] = progressData?.progress || [];
  const achievements: Achievement[] = progressData?.achievements || [];

  // Mock achievements for demonstration
  const allAchievements = [
    {
      id: 1,
      type: "first_perfect",
      title: "首次满分",
      description: "获得第一个100分评价",
      icon: Trophy,
      color: "bg-yellow-500",
      unlocked: achievements.some(a => a.type === "first_perfect"),
    },
    {
      id: 2,
      type: "streak_7",
      title: "连续练习7天",
      description: "坚持练习的好习惯",
      icon: Flame,
      color: "bg-orange-500",
      unlocked: achievements.some(a => a.type === "streak_7"),
    },
    {
      id: 3,
      type: "tech_expert",
      title: "技术达人",
      description: "技术面试平均分超过90",
      icon: Star,
      color: "bg-blue-500",
      unlocked: achievements.some(a => a.type === "tech_expert"),
    },
    {
      id: 4,
      type: "improvement",
      title: "进步之星",
      description: "单月提升超过20分",
      icon: TrendingUp,
      color: "bg-green-500",
      unlocked: achievements.some(a => a.type === "improvement"),
    },
    {
      id: 5,
      type: "interview_master",
      title: "面试高手",
      description: "完成100次练习",
      icon: Medal,
      color: "bg-purple-500",
      unlocked: false,
    },
    {
      id: 6,
      type: "grand_master",
      title: "面试大师",
      description: "所有类型平均分超过95",
      icon: Crown,
      color: "bg-indigo-500",
      unlocked: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">学习进度</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">追踪你的面试技能提升轨迹</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Card */}
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">评分趋势</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">7天</Button>
                    <Button variant="outline" size="sm">30天</Button>
                    <Button size="sm">90天</Button>
                  </div>
                </div>
                
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                  <div className="text-center text-slate-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-medium">评分趋势图</p>
                    <p className="text-sm">显示你的进步轨迹</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-sm border border-slate-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalPractices || 0}</p>
                  <p className="text-sm text-slate-600">总练习次数</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stats?.averageScore || 0}</p>
                  <p className="text-sm text-slate-600">平均得分</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stats?.improvement || "+0%"}</p>
                  <p className="text-sm text-slate-600">本月提升</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{achievements.length}</p>
                  <p className="text-sm text-slate-600">获得成就</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Skills Breakdown */}
          <Card className="shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">技能分析</h3>
              
              <div className="space-y-4">
                {progress.length > 0 ? (
                  progress.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          {getCategoryName(skill.category)}
                        </span>
                        <span className={`text-sm font-bold ${getScoreColor(skill.averageScore)}`}>
                          {skill.averageScore}%
                        </span>
                      </div>
                      <ProgressBar value={skill.averageScore} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>练习次数: {skill.totalPractices}</span>
                        <span>等级: {Math.floor(skill.skillLevel / 20) + 1}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无技能数据</p>
                    <p className="text-sm">开始练习来查看你的技能分析</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mt-8 shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">成就解锁</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {allAchievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`text-center p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked
                        ? `${achievement.color.replace('bg-', 'border-')} bg-opacity-10`
                        : "border-slate-200 bg-slate-50 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        achievement.unlocked ? achievement.color : "bg-slate-300"
                      }`}
                    >
                      {achievement.unlocked ? (
                        <IconComponent className="text-white w-6 h-6" />
                      ) : (
                        <Lock className="text-slate-500 w-6 h-6" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-700 mb-1">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-slate-500 leading-tight">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        已解锁
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Progress */}
        {achievements.length > 0 && (
          <Card className="mt-8 shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">最近成就</h3>
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Trophy className="text-white w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{achievement.title}</p>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
