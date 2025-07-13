import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users,
  TrendingUp,
  Building,
  Heart,
  Star,
  Bookmark
} from "lucide-react";

interface JobMatchingProps {
  userProfile: {
    major: string;
    skills: string[];
    experience: string;
    location?: string;
  };
}

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
  matchScore: number;
  tags: string[];
}

export default function JobMatching({ userProfile }: JobMatchingProps) {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  useEffect(() => {
    // 根据用户专业生成相关职位
    const generateJobs = () => {
      const baseJobs = {
        education: [
          {
            title: "小学语文教师",
            company: "北京市第一小学",
            location: "北京",
            salary: "8K-12K",
            type: "全职",
            description: "负责小学语文教学工作，具备良好的教学能力和沟通技巧",
            requirements: ["教育学相关专业", "教师资格证", "普通话二甲以上", "热爱教育事业"],
            benefits: ["五险一金", "寒暑假", "职业培训", "绩效奖金"],
            tags: ["教育", "稳定", "有编制"]
          },
          {
            title: "课程设计专员",
            company: "新东方教育",
            location: "上海",
            salary: "10K-15K",
            type: "全职",
            description: "负责K12课程内容设计和教学方法研发",
            requirements: ["教育学背景", "课程设计经验", "创新思维", "团队协作"],
            benefits: ["股票期权", "培训机会", "弹性工作", "年度旅游"],
            tags: ["教育科技", "发展空间", "培训"]
          }
        ],
        computer_science: [
          {
            title: "前端开发工程师",
            company: "字节跳动",
            location: "北京",
            salary: "20K-35K",
            type: "全职",
            description: "负责公司核心产品的前端开发和优化工作",
            requirements: ["计算机相关专业", "熟练掌握React/Vue", "JavaScript基础扎实", "有项目经验"],
            benefits: ["股票期权", "免费三餐", "健身房", "弹性工作时间"],
            tags: ["互联网", "技术成长", "高薪"]
          },
          {
            title: "Java后端开发实习生",
            company: "腾讯科技",
            location: "深圳",
            salary: "4K-6K",
            type: "实习",
            description: "参与后端服务开发，学习微服务架构和分布式系统",
            requirements: ["计算机专业在读", "Java基础", "数据库知识", "学习能力强"],
            benefits: ["转正机会", "导师指导", "项目经验", "实习证明"],
            tags: ["实习", "大厂", "学习机会"]
          }
        ]
      };

      const majorJobs = baseJobs[userProfile.major as keyof typeof baseJobs] || [];
      
      return majorJobs.map((job, index) => ({
        id: index + 1,
        posted: `${Math.floor(Math.random() * 7) + 1}天前`,
        matchScore: Math.floor(Math.random() * 30 + 70),
        ...job
      }));
    };

    setJobs(generateJobs());
  }, [userProfile]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || job.location.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            职位推荐与匹配
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="搜索职位或公司..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Input
                placeholder="期望城市..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{userProfile.major}</Badge>
              <Badge variant="secondary">{userProfile.experience}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 职位列表 */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
                      {job.matchScore}% 匹配
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{job.posted}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{job.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">职位要求</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">福利待遇</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-300 text-blue-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSaveJob(job.id)}
                    className={savedJobs.includes(job.id) ? "text-red-600 border-red-300" : ""}
                  >
                    <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                  </Button>
                  
                  <Button size="sm">
                    申请职位
                  </Button>
                </div>
              </div>

              {/* 匹配度详情 */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">匹配度分析</span>
                  <span className="text-sm text-gray-600">{job.matchScore}/100</span>
                </div>
                <Progress value={job.matchScore} className="h-2 mb-2" />
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">专业匹配: </span>
                    <span className="text-green-600">高</span>
                  </div>
                  <div>
                    <span className="font-medium">技能匹配: </span>
                    <span className="text-blue-600">中等</span>
                  </div>
                  <div>
                    <span className="font-medium">经验匹配: </span>
                    <span className="text-orange-600">待提升</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂未找到匹配的职位</p>
              <p className="text-sm mt-2">尝试调整搜索条件或关键词</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 求职建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            求职建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">提升匹配度建议</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 补充相关技术技能和项目经验</li>
                <li>• 准备针对性的自我介绍和案例</li>
                <li>• 了解目标公司的文化和业务</li>
                <li>• 优化简历关键词和格式</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">面试准备重点</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 准备专业相关的技术问题</li>
                <li>• 练习项目介绍和问题解决思路</li>
                <li>• 了解行业发展趋势和热点</li>
                <li>• 准备职业规划和发展目标</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}