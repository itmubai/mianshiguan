import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Target
} from "lucide-react";

interface ResumeAnalyzerProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywordMatching: {
    found: string[];
    missing: string[];
    score: number;
  };
  sections: {
    personalInfo: number;
    education: number;
    experience: number;
    skills: number;
    projects: number;
  };
}

export default function ResumeAnalyzer({ onAnalysisComplete }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;
    
    setIsAnalyzing(true);
    
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 简单的关键词分析
    const techKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', '算法', '数据结构'];
    const softKeywords = ['团队合作', '沟通', '领导', '项目管理', '解决问题', '学习能力'];
    const educationKeywords = ['本科', '硕士', '学士', '计算机', '软件工程', 'GPA'];
    
    const foundTech = techKeywords.filter(keyword => resumeText.includes(keyword));
    const foundSoft = softKeywords.filter(keyword => resumeText.includes(keyword));
    const foundEdu = educationKeywords.filter(keyword => resumeText.includes(keyword));
    
    const hasPersonalInfo = /姓名|电话|邮箱|地址/.test(resumeText);
    const hasEducation = /学历|教育|大学|学院|专业/.test(resumeText);
    const hasExperience = /工作经验|实习|项目经验|经历/.test(resumeText);
    const hasSkills = /技能|能力|掌握|熟悉/.test(resumeText);
    const hasProjects = /项目|作品|开发|设计/.test(resumeText);
    
    const mockAnalysis: ResumeAnalysis = {
      overallScore: Math.floor(Math.random() * 30 + 60), // 60-90分
      strengths: [
        ...foundTech.length > 2 ? ["技术技能丰富"] : [],
        ...foundSoft.length > 1 ? ["软技能表达清晰"] : [],
        ...hasProjects ? ["项目经验充足"] : [],
        ...resumeText.length > 500 ? ["内容详实完整"] : []
      ],
      weaknesses: [
        ...foundTech.length < 3 ? ["技术关键词不足"] : [],
        ...!hasExperience ? ["缺少实际工作经验"] : [],
        ...resumeText.length < 300 ? ["内容过于简短"] : [],
        ...foundSoft.length < 2 ? ["软技能描述不够"] : []
      ],
      suggestions: [
        "添加更多具体的项目成果和数据",
        "使用行业相关的技术关键词",
        "突出解决问题的能力和思路",
        "量化工作成果和贡献",
        "添加获得的认证或奖项"
      ],
      keywordMatching: {
        found: [...foundTech, ...foundSoft],
        missing: ['React Native', 'TypeScript', 'Docker', '微服务', '敏捷开发'],
        score: Math.floor((foundTech.length + foundSoft.length) / (techKeywords.length + softKeywords.length) * 100)
      },
      sections: {
        personalInfo: hasPersonalInfo ? 90 : 40,
        education: hasEducation ? 85 : 30,
        experience: hasExperience ? 80 : 20,
        skills: hasSkills ? 75 : 35,
        projects: hasProjects ? 85 : 25
      }
    };
    
    setAnalysis(mockAnalysis);
    onAnalysisComplete(mockAnalysis);
    setIsAnalyzing(false);
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            简历智能分析
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">目标职位</label>
            <Textarea
              placeholder="例如：前端开发工程师、Java开发工程师、产品经理等..."
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              className="h-20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">简历内容</label>
            <Textarea
              placeholder="请粘贴你的简历内容，包括个人信息、教育背景、工作经验、技能等..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="h-40"
            />
          </div>
          
          <Button 
            onClick={analyzeResume}
            disabled={!resumeText.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? "分析中..." : "开始分析简历"}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* 总体评分 */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </div>
                <div className="text-gray-600 mb-4">简历综合评分</div>
                <Progress value={analysis.overallScore} className="h-3 mb-4" />
                <div className="text-sm text-gray-500">
                  {analysis.overallScore >= 80 ? "优秀简历，符合大部分招聘要求" :
                   analysis.overallScore >= 60 ? "良好简历，还有提升空间" : "需要重点优化和完善"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 各部分评分 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                各部分评分详情
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analysis.sections).map(([section, score]) => {
                const sectionNames = {
                  personalInfo: '个人信息',
                  education: '教育背景',
                  experience: '工作经验',
                  skills: '技能技术',
                  projects: '项目经历'
                };
                
                const icons = {
                  personalInfo: User,
                  education: GraduationCap,
                  experience: Briefcase,
                  skills: Award,
                  projects: TrendingUp
                };
                
                const Icon = icons[section as keyof typeof icons];
                
                return (
                  <div key={section} className="flex items-center gap-4">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{sectionNames[section as keyof typeof sectionNames]}</span>
                        <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* 优势和不足 */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  简历优势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.strengths.length > 0 ? (
                    analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-800">{strength}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">暂未发现明显优势，建议完善简历内容</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  需要改进
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.weaknesses.length > 0 ? (
                    analysis.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-800">{weakness}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">简历整体表现良好</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 关键词匹配 */}
          <Card>
            <CardHeader>
              <CardTitle>关键词匹配分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>匹配度</span>
                <span className={`font-bold ${getScoreColor(analysis.keywordMatching.score)}`}>
                  {analysis.keywordMatching.score}%
                </span>
              </div>
              <Progress value={analysis.keywordMatching.score} className="h-2" />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">已包含关键词</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywordMatching.found.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-orange-600 mb-2">建议添加关键词</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywordMatching.missing.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-orange-300 text-orange-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 优化建议 */}
          <Card>
            <CardHeader>
              <CardTitle>优化建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-blue-800">{suggestion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}