import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Play, 
  Eye, 
  Bookmark, 
  Clock, 
  Users, 
  Search,
  Filter
} from "lucide-react";
import { Link } from "wouter";
import { 
  getCategoryName, 
  getDifficultyName, 
  getCategoryColor, 
  getDifficultyColor,
  formatDuration 
} from "@/lib/utils";
import type { Question } from "@shared/schema";

export default function Questions() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["/api/questions"],
  });

  const categories = [
    { id: "all", label: "全部" },
    { id: "technical", label: "技术面试" },
    { id: "behavioral", label: "行为面试" },
    { id: "case_study", label: "案例分析" },
    { id: "stress", label: "压力面试" },
  ];

  const filteredQuestions = questions.filter((question: Question) => {
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory;
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">加载题库中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">面试题库</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            覆盖各类面试场景的精选题目，帮助你全面提升面试技能
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="搜索面试题目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question: Question) => (
              <Card key={question.id} className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(question.category)}>
                        {getCategoryName(question.category)}
                      </Badge>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {getDifficultyName(question.difficulty)}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-3 line-clamp-3 min-h-[4.5rem]">
                    {question.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(question.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>已练习: {Math.floor(Math.random() * 2000)}+</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link href={`/interview?question=${question.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        开始练习
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">没有找到相关题目</h3>
            <p className="text-slate-600 mb-4">
              {searchQuery ? "请尝试其他关键词" : "请选择其他分类"}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              重置筛选
            </Button>
          </div>
        )}

        {/* Load More (if needed) */}
        {filteredQuestions.length > 0 && filteredQuestions.length >= 20 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              加载更多题目
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
