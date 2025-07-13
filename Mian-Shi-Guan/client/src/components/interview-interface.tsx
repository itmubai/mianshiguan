import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Settings, 
  Pause, 
  StopCircle,
  Clock,
  Tag,
  User
} from "lucide-react";
import { formatDuration, getCategoryName, getDifficultyColor, getDifficultyName } from "@/lib/utils";
import type { Question } from "@shared/schema";

interface InterviewInterfaceProps {
  question: Question;
  onResponse: (answer: string, duration: number) => void;
  onEnd: () => void;
  sessionStartTime: Date;
}

export default function InterviewInterface({ 
  question, 
  onResponse, 
  onEnd, 
  sessionStartTime 
}: InterviewInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [answerTimer, setAnswerTimer] = useState(0);
  const [answer, setAnswer] = useState("");
  const [realTimeFeedback, setRealTimeFeedback] = useState({
    clarity: 85,
    logic: 72,
    confidence: 91
  });

  // Update session timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setSessionTimer(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, isPaused]);

  // Update answer timer when recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setAnswerTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  // Simulate real-time feedback updates
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRealTimeFeedback(prev => ({
          clarity: Math.max(60, Math.min(100, prev.clarity + (Math.random() - 0.5) * 10)),
          logic: Math.max(60, Math.min(100, prev.logic + (Math.random() - 0.5) * 8)),
          confidence: Math.max(60, Math.min(100, prev.confidence + (Math.random() - 0.5) * 6))
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setAnswerTimer(0);
    setAnswer("");
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (answer.trim()) {
      onResponse(answer, answerTimer);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEndInterview = () => {
    if (isRecording) {
      stopRecording();
    }
    onEnd();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Video Interface */}
      <Card className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative">
          {/* Main video area */}
          <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
            <div className="text-center text-white">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="AI Interviewer" 
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500" 
              />
              <p className="text-xl mb-2">AI面试官 - Lisa</p>
              <p className="text-blue-300">
                {isPaused ? "面试已暂停" : isRecording ? "请回答当前问题" : "准备好了吗？我们开始面试吧"}
              </p>
            </div>
            
            {/* User video (corner) */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-700 rounded-lg border-2 border-blue-500 flex items-center justify-center">
              <div className="text-white text-xs text-center">
                {isVideoOff ? (
                  <VideoOff className="w-8 h-8 mx-auto mb-1" />
                ) : (
                  <User className="w-8 h-8 mx-auto mb-1" />
                )}
                <p>你</p>
              </div>
            </div>

            {/* Recording indicator */}
            {isRecording && !isPaused && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm">录制中</span>
              </div>
            )}

            {/* Session timer */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded">
              <span className="text-white text-sm">{formatDuration(sessionTimer)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  size="lg"
                  variant={isMuted ? "destructive" : "secondary"}
                  className="w-12 h-12 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  size="lg"
                  variant={isVideoOff ? "secondary" : "outline"}
                  className="w-12 h-12 rounded-full"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-12 h-12 rounded-full"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isPaused}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    开始回答
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    停止回答
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handlePause}
                  className="text-white border-white hover:bg-white hover:text-slate-800"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  {isPaused ? "继续" : "暂停"}
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleEndInterview}
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  结束面试
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Question */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">Q</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">当前问题</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                {question.content}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>建议回答时间: {Math.floor(question.duration / 60)}-{Math.ceil(question.duration / 60) + 1}分钟</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(question.category)}>
                    {getCategoryName(question.category)}
                  </Badge>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {getDifficultyName(question.difficulty)}
                  </Badge>
                </div>
              </div>
              {isRecording && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <div className="flex items-center justify-between text-sm text-blue-800">
                    <span>回答时间: {formatDuration(answerTimer)}</span>
                    <span>建议时间: {formatDuration(question.duration)}</span>
                  </div>
                  <Progress 
                    value={(answerTimer / question.duration) * 100} 
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Input (for demo purposes) */}
      {isRecording && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">回答内容 (模拟输入)</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="请在这里输入你的回答内容..."
              className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-slate-500 mt-2">
              * 在实际应用中，这里会是语音识别的实时转录
            </p>
          </CardContent>
        </Card>
      )}

      {/* Real-time Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">语音清晰度</span>
              <span className="text-sm font-bold text-green-600">{Math.round(realTimeFeedback.clarity)}%</span>
            </div>
            <Progress value={realTimeFeedback.clarity} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">回答逻辑</span>
              <span className="text-sm font-bold text-orange-500">{Math.round(realTimeFeedback.logic)}%</span>
            </div>
            <Progress value={realTimeFeedback.logic} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">信心指数</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(realTimeFeedback.confidence)}%</span>
            </div>
            <Progress value={realTimeFeedback.confidence} className="h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    technical: "bg-blue-100 text-blue-800",
    behavioral: "bg-green-100 text-green-800",
    case_study: "bg-purple-100 text-purple-800",
    stress: "bg-red-100 text-red-800",
  };
  return colorMap[category] || "bg-gray-100 text-gray-800";
}
