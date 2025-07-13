import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  Star, 
  TrendingUp, 
  Clock, 
  Code, 
  Users, 
  Shuffle,
  ChevronRight,
  Play
} from "lucide-react";
import { formatTimeAgo, getScoreColor, getScoreLevel } from "@/lib/utils";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-primary via-blue-600 to-purple-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              多模态智能模拟面试
              <span className="block text-blue-200">评测系统</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              基于AI技术的智能面试评测平台，帮助高校学生提升面试技能，获得个性化反馈，轻松应对各类面试挑战
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/interview">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
                  <Play className="w-5 h-5 mr-2" />
                  开始模拟面试
                </Button>
              </Link>
              <Link href="/progress">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  查看进度
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-slate-600">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen apple-gradient-surface">
      {/* Hero Section */}
      <section className="apple-gradient-blue py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            多模态智能模拟面试
            <span className="block text-white/80 text-4xl md:text-6xl mt-2">评测系统</span>
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            基于AI技术的智能面试评测平台，帮助高校学生提升面试技能，获得个性化反馈，轻松应对各类面试挑战
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/interview">
              <Button size="lg" className="apple-button-primary bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                <Play className="w-6 h-6 mr-3" />
                开始模拟面试
              </Button>
            </Link>
            <Link href="/progress">
              <Button size="lg" className="apple-button-secondary bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-4">
                <TrendingUp className="w-6 h-6 mr-3" />
                查看进度
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">学习控制台</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">实时追踪你的面试练习进度和表现</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="apple-card-interactive p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2">总练习次数</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalPractices || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Mic className="text-primary w-7 h-7" />
                </div>
              </div>
            </div>

            <div className="apple-card-interactive p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2">平均评分</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.averageScore || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center">
                  <Star className="text-green-500 w-7 h-7" />
                </div>
              </div>
            </div>

            <div className="apple-card-interactive p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2">本月提升</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.improvement || "+0%"}
                  </p>
                </div>
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-purple-500 w-7 h-7" />
                </div>
              </div>
            </div>

            <div className="apple-card-interactive p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2">练习时长</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalTime || "0小时"}
                  </p>
                </div>
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                  <Clock className="text-orange-500 w-7 h-7" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">最近练习</h3>
                <div className="space-y-4">
                  {stats?.recentActivities?.length > 0 ? (
                    stats.recentActivities.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Code className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{activity.title}</p>
                          <p className="text-sm text-slate-600">{activity.time}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${getScoreColor(activity.score)}`}>
                            {activity.score}分
                          </p>
                          <p className="text-xs text-slate-500">
                            {getScoreLevel(activity.score)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>还没有练习记录</p>
                      <p className="text-sm">开始你的第一次模拟面试吧！</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">快速开始</h3>
                <div className="space-y-3">
                  <Link href="/interview?type=technical">
                    <Button 
                      variant="outline" 
                      className="w-full text-left p-4 h-auto border-2 border-dashed border-slate-200 hover:border-primary hover:bg-blue-50 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                          <Code />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">技术面试练习</p>
                          <p className="text-sm text-slate-600">算法、编程、系统设计等</p>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto" />
                      </div>
                    </Button>
                  </Link>

                  <Link href="/interview?type=behavioral">
                    <Button 
                      variant="outline" 
                      className="w-full text-left p-4 h-auto border-2 border-dashed border-slate-200 hover:border-green-500 hover:bg-green-50 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 group-hover:bg-green-500 group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                          <Users />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">行为面试练习</p>
                          <p className="text-sm text-slate-600">团队合作、领导力、解决问题</p>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto" />
                      </div>
                    </Button>
                  </Link>

                  <Link href="/interview?type=random">
                    <Button 
                      variant="outline" 
                      className="w-full text-left p-4 h-auto border-2 border-dashed border-slate-200 hover:border-purple-500 hover:bg-purple-50 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-500 group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                          <Shuffle />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">随机面试</p>
                          <p className="text-sm text-slate-600">AI智能选择适合你的题目</p>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto" />
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
