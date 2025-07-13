import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Square, 
  Mic, 
  MicOff,
  ChevronRight,
  Clock,
  CheckCircle
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import AIInterviewerVideo from "./ai-interviewer-video";
import CameraPreview from "./camera-preview";
import CompetitionEvaluationSystem from "./competition-evaluation-system";
import { playTTS } from '../lib/tts';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Question {
  id: number;
  title: string;
  content: string;
  duration: number;
  category: string;
  difficulty: string;
  tags: string[] | null;
  isActive: boolean | null;
}

interface InterviewConfig {
  type: string;
  major: string;
  position: string;
  company: string;
  experience: string;
  voiceEnabled: boolean;
  voiceSpeed: number;
  voiceType: string;
  questionCount: number;
}

interface MultiQuestionInterviewProps {
  questions: Question[];
  config: InterviewConfig;
  onComplete: (responses: InterviewResponse[]) => void;
  sessionId: number;
}

interface InterviewResponse {
  questionId: number;
  answer: string;
  duration: number;
  timestamp: Date;
}

export default function MultiQuestionInterview({ 
  questions, 
  config, 
  onComplete,
  sessionId 
}: MultiQuestionInterviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userVideoBlob, setUserVideoBlob] = useState<Blob | null>(null);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useSpeechRecognition();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (config.voiceEnabled && currentQuestion) {
      speakQuestion(currentQuestion.content);
    }
  }, [currentQuestionIndex, config.voiceEnabled]);

  useEffect(() => {
    if (transcript) {
      setCurrentAnswer(transcript);
    }
  }, [transcript]);

  // 监听全局事件，弹出摄像头权限弹窗
  useEffect(() => {
    const handler = () => setCameraDialogOpen(true);
    window.addEventListener('request-camera-permission', handler);
    return () => window.removeEventListener('request-camera-permission', handler);
  }, []);

  const speakQuestion = (text: string) => {
    if (config.voiceEnabled && audioEnabled) {
      setAiSpeaking(true);
      playTTS(text).then(() => setAiSpeaking(false));
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setStartTime(Date.now());
    resetTranscript();
    if (isSupported) {
      startListening();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (isListening) {
      stopListening();
    }
  };

  const handleNextQuestion = () => {
    if (!startTime) return;

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const response: InterviewResponse = {
      questionId: currentQuestion.id,
      answer: currentAnswer || transcript,
      duration,
      timestamp: new Date()
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // 重置当前题目状态
    setCurrentAnswer("");
    resetTranscript();
    setStartTime(null);
    stopRecording();

    if (currentQuestionIndex < questions.length - 1) {
      // 进入下一题
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 所有题目完成
      setIsCompleted(true);
      onComplete(newResponses);
    }
  };

  const handleSkipQuestion = () => {
    const response: InterviewResponse = {
      questionId: currentQuestion.id,
      answer: "跳过此题",
      duration: 0,
      timestamp: new Date()
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // 重置状态并进入下一题
    setCurrentAnswer("");
    resetTranscript();
    setStartTime(null);
    stopRecording();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
      onComplete(newResponses);
    }
  };

  if (isCompleted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">面试完成！</h2>
          <p className="text-slate-600 mb-6">
            您已完成所有 {questions.length} 道面试题目，系统正在为您生成综合评分报告...
          </p>
          <div className="animate-pulse">
            <div className="bg-slate-200 h-4 rounded w-3/4 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen w-full flex flex-row gap-8 px-6 py-8 justify-center items-start bg-[url('/assets/bg-curtain.jpg'),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(230,240,255,0.85))] bg-cover bg-center" style={{backgroundBlendMode:'lighten'}}> 
      {/* 左侧栏 */}
      <aside className="w-64 flex-shrink-0 flex flex-col gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">题目进度</h3>
            <Progress value={progress} className="mb-4" />
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div key={q.id} className={`flex items-center gap-2 ${idx === currentQuestionIndex ? 'font-bold text-blue-600' : 'text-slate-600'}`}> 
                  <span>{idx + 1}.</span>
                  <span>{q.title || q.content.slice(0, 10) + '...'}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={handleSkipQuestion} variant="outline" disabled={isCompleted}>跳过本题</Button>
          <Button onClick={handleNextQuestion} disabled={isCompleted || !isRecording}>下一题</Button>
        </div>
      </aside>
      {/* 主内容区：纵向堆叠，宽敞居中 */}
      <main className="flex-1 max-w-4xl flex flex-col gap-8 mx-auto">
        {/* AI面试官卡片 */}
        <Card className="rounded-3xl shadow-xl relative">
          <CardContent className="p-6 h-64 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">AI面试官</h3>
              <Button size="icon" variant="ghost" className="absolute top-4 right-4" onClick={() => setCameraDialogOpen(true)} title="摄像头权限">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
              </Button>
            </div>
            <AIInterviewerVideo
              isActive={!isCompleted}
              isSpeaking={aiSpeaking}
              onToggleVideo={() => setVideoEnabled(!videoEnabled)}
              onToggleMic={() => {
                setMicEnabled(!micEnabled);
                if (micEnabled && isListening) stopListening();
              }}
              onToggleAudio={() => setAudioEnabled(!audioEnabled)}
              videoEnabled={videoEnabled}
              micEnabled={micEnabled}
              audioEnabled={audioEnabled}
            />
          </CardContent>
        </Card>
        {/* 当前题目与答题区 */}
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-8">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">第 {currentQuestionIndex + 1} 题</Badge>
              <span className="font-semibold text-lg">{currentQuestion?.title || currentQuestion?.content?.slice(0, 20) + '...'}</span>
            </div>
            <div className="mb-4 text-slate-700">{currentQuestion?.content}</div>
            <div className="flex items-center gap-4 mb-4">
              <Button onClick={startRecording} disabled={isRecording || isCompleted} variant="default">
                <Mic className="w-4 h-4 mr-2" /> 开始答题
              </Button>
              <Button onClick={stopRecording} disabled={!isRecording || isCompleted} variant="outline">
                <Square className="w-4 h-4 mr-2" /> 停止答题
              </Button>
              <span className="text-xs text-slate-500 flex items-center"><Clock className="w-4 h-4 mr-1" />{startTime ? `${Math.floor((Date.now() - startTime) / 1000)}s` : '0s'}</span>
            </div>
            <textarea
              className="w-full h-24 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              placeholder="可在此补充或修正语音识别内容..."
              disabled={isCompleted}
            />
            <div className="text-xs text-slate-400 mb-2">* 你可以用语音或手动输入作答</div>
            {/* 语音转写实时显示 */}
            <div className="bg-slate-100 rounded p-2 text-xs text-slate-600 mb-2">
              <span className="font-semibold">语音转写：</span>{transcript || '（等待语音输入...）'}
            </div>
          </CardContent>
        </Card>
      </main>
      {/* 右侧栏 */}
      <aside className="w-64 flex-shrink-0 flex flex-col gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">多模态智能评测</h3>
            <div className="text-slate-500 text-sm">评测分数、表情分析、语音分析等...</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">核心能力评估</h3>
            <div className="text-slate-500 text-sm">专业、表达、思维、抗压等能力分数...</div>
          </CardContent>
        </Card>
      </aside>
      {/* 摄像头权限弹窗 */}
      <Dialog open={cameraDialogOpen} onOpenChange={setCameraDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle>需要摄像头权限</DialogTitle>
          <div className="text-slate-600 mb-4">为获得更真实的面试体验，建议立即开启摄像头权限。</div>
          <DialogFooter>
            <Button onClick={() => { setCameraDialogOpen(false); /* 触发摄像头权限 */ window.dispatchEvent(new CustomEvent('trigger-camera-permission')); }} variant="default">立即打开</Button>
            <Button onClick={() => setCameraDialogOpen(false)} variant="outline">稍后尝试</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}