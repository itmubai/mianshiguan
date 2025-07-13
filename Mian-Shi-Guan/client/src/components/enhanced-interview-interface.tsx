import { useState, useEffect, useRef } from "react";
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
  Volume2,
  VolumeX,
  User,
  Play
} from "lucide-react";
import { formatDuration, getCategoryName, getDifficultyColor, getDifficultyName } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { Question } from "@shared/schema";
import type { InterviewConfig } from "./interview-setup";
import { playTTS } from '../lib/tts';

interface EnhancedInterviewInterfaceProps {
  question: Question;
  config: InterviewConfig;
  onResponse: (answer: string, duration: number) => void;
  onEnd: () => void;
  sessionStartTime: Date;
}

export default function EnhancedInterviewInterface({ 
  question, 
  config,
  onResponse, 
  onEnd, 
  sessionStartTime 
}: EnhancedInterviewInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [answerTimer, setAnswerTimer] = useState(0);
  const [hasSpokenQuestion, setHasSpokenQuestion] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechSupported
  } = useSpeechRecognition();

  // Speak the question when interface loads
  useEffect(() => {
    if (config.voiceEnabled && !hasSpokenQuestion && 'speechSynthesis' in window) {
      speakQuestion();
      setHasSpokenQuestion(true);
    }
  }, [config.voiceEnabled, hasSpokenQuestion]);

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

  const speakQuestion = () => {
    setIsAISpeaking(true);
    playTTS(question.content).then(() => setIsAISpeaking(false));
  };

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthesis.cancel();
      setIsAISpeaking(false);
    }
  };

  const startRecording = () => {
    if (speechSupported && !isMuted) {
      startListening();
    }
    setIsRecording(true);
    setAnswerTimer(0);
    resetTranscript();
  };

  const stopRecording = () => {
    if (isListening) {
      stopListening();
    }
    setIsRecording(false);
    
    const finalAnswer = transcript.trim() || "未能识别到语音内容";
    if (finalAnswer) {
      onResponse(finalAnswer, answerTimer);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && isRecording && speechSupported) {
      startListening();
    } else if (!isPaused && isListening) {
      stopListening();
    }
  };

  const handleEndInterview = () => {
    if (isRecording) {
      stopRecording();
    }
    if (isAISpeaking) {
      stopSpeaking();
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
                className={`w-48 h-48 rounded-full mx-auto mb-4 object-cover border-4 ${
                  isAISpeaking ? 'border-green-500 animate-pulse' : 'border-blue-500'
                }`}
              />
              <p className="text-xl mb-2">AI面试官 - {config.voiceType === 'female' ? 'Lisa' : 'David'}</p>
              <p className="text-blue-300">
                {isPaused ? "面试已暂停" : 
                 isAISpeaking ? "正在提问..." :
                 isRecording ? "请回答当前问题" : 
                 "准备好了吗？我们开始面试吧"}
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
                <span className="text-white text-sm">
                  {speechSupported ? "语音识别中" : "录制中"}
                </span>
              </div>
            )}

            {/* AI Speaking indicator */}
            {isAISpeaking && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full">
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
                <span className="text-white text-sm">面试官发言中</span>
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
                  disabled={!speechSupported}
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
                  onClick={config.voiceEnabled ? (isAISpeaking ? stopSpeaking : speakQuestion) : undefined}
                  disabled={!config.voiceEnabled}
                >
                  {isAISpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
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
                    disabled={isPaused || isAISpeaking}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {speechSupported ? "开始语音回答" : "开始录制"}
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    完成回答
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">当前问题</h3>
                {config.voiceEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isAISpeaking ? stopSpeaking : speakQuestion}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    {isAISpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isAISpeaking ? "停止播放" : "重新播放"}
                  </Button>
                )}
              </div>
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

      {/* Speech Recognition Display */}
      {isRecording && speechSupported && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">实时语音识别</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-slate-600">
                  {isListening ? "正在监听..." : "未监听"}
                </span>
              </div>
            </div>
            <div className="min-h-32 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <p className="text-slate-700 leading-relaxed">
                {transcript || "开始说话，系统将实时识别您的语音..."}
              </p>
            </div>
            {!speechSupported && (
              <p className="text-sm text-amber-600 mt-2">
                您的浏览器不支持语音识别，建议使用Chrome浏览器获得最佳体验
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Professional Context Display */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">面试背景</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-600">专业：</span>
              <span className="font-medium text-slate-900">{config.major}</span>
            </div>
            <div>
              <span className="text-slate-600">岗位：</span>
              <span className="font-medium text-slate-900">{config.position}</span>
            </div>
            {config.company && (
              <div>
                <span className="text-slate-600">公司：</span>
                <span className="font-medium text-slate-900">{config.company}</span>
              </div>
            )}
            <div>
              <span className="text-slate-600">经验：</span>
              <span className="font-medium text-slate-900">
                {config.experience === 'fresh' ? '应届生' : config.experience === '1-3' ? '1-3年' : '3年以上'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    technical: "bg-blue-100 text-blue-800",
    behavioral: "bg-green-100 text-green-800",
    case_study: "bg-purple-100 text-purple-800",
    comprehensive: "bg-orange-100 text-orange-800",
  };
  return colorMap[category] || "bg-gray-100 text-gray-800";
}