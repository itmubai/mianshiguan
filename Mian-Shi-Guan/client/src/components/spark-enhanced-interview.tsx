import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Send,
  Sparkles,
  Brain,
  Target,
  MessageSquare,
  Lightbulb,
  Zap,
  Shield,
  FileText,
  Volume2,
  Camera,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface SparkEvaluationResult {
  overallScore: number;
  coreAbilities: {
    professionalKnowledge: number;
    skillMatching: number;
    communication: number;
    logicalThinking: number;
    innovationAdaptability: number;
    stressResistance: number;
  };
  multiModalAnalysis: {
    textAnalysis: {
      score: number;
      insights: string[];
      metrics: any;
    };
    audioAnalysis: {
      score: number;
      insights: string[];
      metrics: any;
    };
    videoAnalysis: {
      score: number;
      insights: string[];
      metrics: any;
    };
  };
  improvementSuggestions: string[];
  competitiveAdvantages: string[];
  learningPath: Array<{
    area: string;
    resources: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  detailedFeedback: string;
}

const TECHNICAL_DOMAINS = [
  { value: 'ai', label: '人工智能', icon: Brain },
  { value: 'bigdata', label: '大数据', icon: Target },
  { value: 'iot', label: '物联网', icon: Zap },
  { value: 'intelligent', label: '智能系统', icon: Lightbulb },
  { value: 'technical', label: '技术通用', icon: FileText },
  { value: 'product', label: '产品管理', icon: MessageSquare },
  { value: 'devops', label: '运维测试', icon: Shield }
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: '基础', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: '中等', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: '困难', color: 'bg-red-100 text-red-800' }
];

export default function SparkEnhancedInterview() {
  const { toast } = useToast();
  
  // 配置状态
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  
  // 面试状态
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [phase, setPhase] = useState<'setup' | 'interview' | 'results'>('setup');
  
  // 评测结果
  const [evaluation, setEvaluation] = useState<SparkEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // 媒体状态
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioDataRef = useRef<Blob[]>([]);
  const videoDataRef = useRef<Blob[]>([]);
  
  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime]);

  // 生成星火AI问题
  const generateQuestionMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await apiRequest('POST', '/api/spark/interview/generate-question', config);
      return response.json();
    },
    onSuccess: (data: any) => {
      setCurrentQuestion(data.question);
      setPhase('interview');
      toast({
        title: "问题生成成功",
        description: "讯飞星火已为您生成专业面试题目"
      });
    },
    onError: (error: any) => {
      toast({
        title: "问题生成失败",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // 星火AI评测
  const evaluateMutation = useMutation({
    mutationFn: async (evaluationData: any) => {
      const response = await apiRequest('POST', '/api/spark/interview/evaluate', evaluationData);
      return response.json();
    },
    onSuccess: (data: any) => {
      setEvaluation(data.evaluation);
      setPhase('results');
      setIsEvaluating(false);
      toast({
        title: "评测完成",
        description: "讯飞星火已生成详细评测报告"
      });
    },
    onError: (error: any) => {
      setIsEvaluating(false);
      toast({
        title: "评测失败",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // 开始面试
  const handleStartInterview = () => {
    if (!selectedDomain) {
      toast({
        title: "请选择技术领域",
        variant: "destructive"
      });
      return;
    }

    generateQuestionMutation.mutate({
      category: selectedDomain,
      difficulty: selectedDifficulty,
      position,
      company
    });
  };

  // 开始录制
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: isVideoEnabled 
      });
      
      if (isVideoEnabled && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioDataRef.current = [];
      videoDataRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioDataRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStartTime(new Date());
      
      toast({
        title: "开始录制",
        description: "请开始回答问题"
      });
    } catch (error) {
      toast({
        title: "录制失败",
        description: "无法访问麦克风或摄像头",
        variant: "destructive"
      });
    }
  };

  // 停止录制
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // 停止所有媒体轨道
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // 提交评测
  const handleSubmitEvaluation = () => {
    if (!answer.trim()) {
      toast({
        title: "请输入回答内容",
        variant: "destructive"
      });
      return;
    }

    setIsEvaluating(true);
    
    // 准备评测数据
    const evaluationData = {
      answer: answer.trim(),
      questionCategory: selectedDomain,
      position: position || "技术岗位",
      audioData: audioDataRef.current,
      videoData: isVideoEnabled ? videoDataRef.current : null,
      duration
    };

    evaluateMutation.mutate(evaluationData);
  };

  // 重新开始
  const handleRestart = () => {
    setPhase('setup');
    setCurrentQuestion(null);
    setAnswer('');
    setEvaluation(null);
    setIsRecording(false);
    setStartTime(null);
    setDuration(0);
    audioDataRef.current = [];
    videoDataRef.current = [];
  };

  // 获取评分等级
  const getScoreLevel = (score: number) => {
    if (score >= 85) return { level: '优秀', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 75) return { level: '良好', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 65) return { level: '中等', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: '需提升', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* 现代化标题区域 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold">星火智能面试</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              AI驱动的专业面试评测系统，助您在求职路上脱颖而出
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span>多模态分析</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>实时评测</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>专业反馈</span>
              </div>
            </div>
          </div>
          {/* 装饰性几何图形 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {phase === 'setup' && (
          <div className="space-y-8">
            {/* 技术领域选择 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                  <Brain className="w-6 h-6" />
                </div>
                选择技术领域
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {TECHNICAL_DOMAINS.map((domain) => {
                  const IconComponent = domain.icon;
                  const isSelected = selectedDomain === domain.value;
                  return (
                    <div
                      key={domain.value}
                      onClick={() => setSelectedDomain(domain.value)}
                      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                        isSelected 
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg scale-105' 
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`p-3 rounded-xl mx-auto mb-3 w-fit ${
                          isSelected ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">{domain.label}</h3>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">难度等级</label>
                  <div className="space-y-2">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <div
                        key={level.value}
                        onClick={() => setSelectedDifficulty(level.value)}
                        className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedDifficulty === level.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 bg-white hover:border-purple-300'
                        }`}
                      >
                        <Badge className={level.color} variant="secondary">
                          {level.label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">目标岗位</label>
                  <Textarea
                    placeholder="如：前端开发工程师、数据分析师..."
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    rows={4}
                    className="rounded-xl border-slate-200 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">目标公司</label>
                  <Textarea
                    placeholder="如：阿里巴巴、腾讯、字节跳动..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    rows={4}
                    className="rounded-xl border-slate-200 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* 评测模式选择 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white">
                  <Video className="w-6 h-6" />
                </div>
                评测模式配置
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                    isVideoEnabled 
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-teal-50' 
                      : 'border-slate-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      isVideoEnabled ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">视频分析</h3>
                      <p className="text-sm text-slate-600">分析面部表情和肢体语言</p>
                    </div>
                    {isVideoEnabled && (
                      <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500 text-white">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">语音分析</h3>
                      <p className="text-sm text-slate-600">自动启用，分析语调和流畅度</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-blue-500 ml-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* 开始按钮 */}
            <div className="text-center">
              <Button 
                onClick={handleStartInterview}
                disabled={generateQuestionMutation.isPending || !selectedDomain}
                className="px-12 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                size="lg"
              >
                {generateQuestionMutation.isPending ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                    星火AI正在生成问题...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-3" />
                    开始星火面试
                  </>
                )}
              </Button>
              {!selectedDomain && (
                <p className="text-sm text-red-500 mt-3">请先选择技术领域</p>
              )}
            </div>
          </div>
        )}

        {phase === 'interview' && currentQuestion && (
          <div className="space-y-6">
            {/* 问题展示 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">面试题目</h2>
                <Badge variant="outline" className="ml-auto border-purple-300 text-purple-700">
                  星火AI生成
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800">
                  {currentQuestion.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {currentQuestion.content}
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-500 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    建议时长: {Math.floor(currentQuestion.expectedDuration / 60)}分钟
                  </div>
                  {startTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      已用时: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 录制和回答区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 录制控制 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  录制控制
                </h3>
                
                <div className="space-y-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    className="w-full py-3 text-lg font-semibold"
                    size="lg"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        停止录制
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        开始录制
                      </>
                    )}
                  </Button>

                  {isVideoEnabled && (
                    <div className="space-y-2">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-40 bg-slate-100 rounded-xl object-cover border-2 border-slate-200"
                      />
                      <p className="text-xs text-slate-500 text-center">
                        视频预览（仅用于分析，不会存储）
                      </p>
                    </div>
                  )}

                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                      <span className="font-medium">正在录制中...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 文字回答 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  文字回答
                </h3>
                
                <Textarea
                  placeholder="请在此输入您的回答内容，详细描述您的想法和解决方案..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={10}
                  className="w-full text-base rounded-xl border-slate-200 focus:border-purple-500"
                />
                <div className="flex justify-between items-center mt-3 text-sm text-slate-500">
                  <span>字数: {answer.length}</span>
                  <span className={answer.length >= 200 ? 'text-green-600' : 'text-orange-500'}>
                    建议200字以上
                  </span>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="text-center">
              <Button
                onClick={handleSubmitEvaluation}
                disabled={isEvaluating || !answer.trim()}
                size="lg"
                className="px-12 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                    星火AI正在评测...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    提交星火评测
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {phase === 'results' && evaluation && (
          <div className="space-y-8">
            {/* 评测概览 */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold">星火AI评测报告</h2>
                </div>
                <p className="text-xl text-white/90 mb-6">
                  基于讯飞星火大模型的专业多模态分析
                </p>
                <div className="text-6xl font-bold mb-4">
                  {evaluation.overallScore}
                </div>
                <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold bg-white/20 backdrop-blur-sm`}>
                  {getScoreLevel(evaluation.overallScore).level}
                </div>
              </div>
            </div>

            {/* 详细分析 */}
            <Tabs defaultValue="abilities" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm rounded-2xl p-2">
                <TabsTrigger value="abilities" className="rounded-xl">核心能力</TabsTrigger>
                <TabsTrigger value="multimodal" className="rounded-xl">多模态分析</TabsTrigger>
                <TabsTrigger value="feedback" className="rounded-xl">改进建议</TabsTrigger>
                <TabsTrigger value="learning" className="rounded-xl">学习路径</TabsTrigger>
              </TabsList>

              <TabsContent value="abilities">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(evaluation.coreAbilities).map(([key, score]) => {
                    const abilityNames = {
                      professionalKnowledge: { name: '专业知识', icon: Brain },
                      skillMatching: { name: '技能匹配', icon: Target },
                      communication: { name: '沟通表达', icon: MessageSquare },
                      logicalThinking: { name: '逻辑思维', icon: Lightbulb },
                      innovationAdaptability: { name: '创新应变', icon: Zap },
                      stressResistance: { name: '抗压能力', icon: Shield }
                    };
                    
                    const ability = abilityNames[key as keyof typeof abilityNames];
                    const IconComponent = ability.icon;
                    const level = getScoreLevel(score);
                    
                    return (
                      <div key={key} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800">{ability.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-2xl font-bold text-indigo-600">{score}</span>
                              <Badge className={`${level.bg} ${level.color}`}>
                                {level.level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Progress value={score} className="h-3 rounded-full" />
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="multimodal">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">文本分析</h3>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                      {evaluation.multiModalAnalysis.textAnalysis.score}
                    </div>
                    <div className="space-y-2">
                      {evaluation.multiModalAnalysis.textAnalysis.insights.map((insight, index) => (
                        <div key={index} className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">语音分析</h3>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-4">
                      {evaluation.multiModalAnalysis.audioAnalysis.score}
                    </div>
                    <div className="space-y-2">
                      {evaluation.multiModalAnalysis.audioAnalysis.insights.map((insight, index) => (
                        <div key={index} className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">视频分析</h3>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-4">
                      {evaluation.multiModalAnalysis.videoAnalysis.score}
                    </div>
                    <div className="space-y-2">
                      {evaluation.multiModalAnalysis.videoAnalysis.insights.map((insight, index) => (
                        <div key={index} className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="feedback">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-xl border border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-orange-800">改进建议</h3>
                    </div>
                    <div className="space-y-3">
                      {evaluation.improvementSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3 text-orange-700">
                          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-green-800">竞争优势</h3>
                    </div>
                    <div className="space-y-3">
                      {evaluation.competitiveAdvantages.map((advantage, index) => (
                        <div key={index} className="flex items-start gap-3 text-green-700">
                          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-purple-800">星火AI详细反馈</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {evaluation.detailedFeedback}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="learning">
                <div className="space-y-4">
                  {evaluation.learningPath.map((path, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">{path.area}</h3>
                        <Badge 
                          variant={path.priority === 'high' ? 'destructive' : path.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-sm"
                        >
                          {path.priority === 'high' ? '高优先级' : path.priority === 'medium' ? '中优先级' : '低优先级'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {path.resources.map((resource, resIndex) => (
                          <div key={resIndex} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* 操作按钮 */}
            <div className="text-center">
              <Button onClick={handleRestart} size="lg" className="px-12 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
                <RotateCcw className="w-5 h-5 mr-3" />
                开始新的面试
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}