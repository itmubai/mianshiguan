import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  User,
  Bot
} from "lucide-react";

interface AIInterviewerVideoProps {
  isActive: boolean;
  isSpeaking: boolean;
  onToggleVideo: () => void;
  onToggleMic: () => void;
  onToggleAudio: () => void;
  videoEnabled: boolean;
  micEnabled: boolean;
  audioEnabled: boolean;
}

export default function AIInterviewerVideo({
  isActive,
  isSpeaking,
  onToggleVideo,
  onToggleMic,
  onToggleAudio,
  videoEnabled,
  micEnabled,
  audioEnabled
}: AIInterviewerVideoProps) {
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'speaking' | 'listening'>('neutral');

  useEffect(() => {
    if (isSpeaking) {
      setCurrentExpression('speaking');
    } else if (isActive) {
      setCurrentExpression('listening');
    } else {
      setCurrentExpression('neutral');
    }
  }, [isSpeaking, isActive]);

  // AI面试官虚拟形象
  const AIInterviewerAvatar = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
      {videoEnabled ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-white">
          {/* AI面试官头像 */}
          <div className={`w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 transition-all duration-300 ${
            currentExpression === 'speaking' ? 'scale-110 bg-green-400/30' : 
            currentExpression === 'listening' ? 'scale-105 bg-blue-400/30' : 'scale-100'
          }`}>
            <Bot className={`w-12 h-12 transition-all duration-300 ${
              currentExpression === 'speaking' ? 'text-green-200' : 
              currentExpression === 'listening' ? 'text-blue-200' : 'text-white'
            }`} />
          </div>
          
          {/* 状态指示 */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">AI面试官</h3>
            <p className="text-sm opacity-80">
              {currentExpression === 'speaking' ? '正在提问...' : 
               currentExpression === 'listening' ? '正在聆听...' : '待机中'}
            </p>
          </div>
          
          {/* 音频波形动画 */}
          {isSpeaking && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/60 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.5s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-white text-center">
          <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-60" />
          <p className="text-sm opacity-60">视频已关闭</p>
        </div>
      )}
    </div>
  );

  // 用户视频区域
  const UserVideoArea = () => (
    <div className="relative w-full h-full bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
      {videoEnabled ? (
        <div className="relative w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto mb-2 opacity-60" />
            <p className="text-sm opacity-60">你的摄像头</p>
            <p className="text-xs opacity-40 mt-1">实际项目中可接入真实摄像头</p>
          </div>
          
          {/* 录音指示 */}
          {micEnabled && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center space-x-2 bg-red-500/20 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-200">表情分析中</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-white text-center">
          <VideoOff className="w-8 h-8 mx-auto mb-2 opacity-60" />
          <p className="text-sm opacity-60">视频已关闭</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
      {/* AI面试官视频区域 */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0 h-full">
          <AIInterviewerAvatar />
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            AI面试官
          </div>
        </CardContent>
      </Card>

      {/* 用户视频区域 */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0 h-full">
          <UserVideoArea />
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            你
          </div>
        </CardContent>
      </Card>

      {/* 控制按钮 */}
      <div className="col-span-1 md:col-span-2 flex justify-center space-x-4">
        <Button
          onClick={onToggleVideo}
          variant={videoEnabled ? "default" : "destructive"}
          size="sm"
          className="flex items-center space-x-2"
        >
          {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          <span>{videoEnabled ? "关闭视频" : "开启视频"}</span>
        </Button>

        <Button
          onClick={onToggleMic}
          variant={micEnabled ? "default" : "destructive"}
          size="sm"
          className="flex items-center space-x-2"
        >
          {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          <span>{micEnabled ? "静音" : "取消静音"}</span>
        </Button>

        <Button
          onClick={onToggleAudio}
          variant={audioEnabled ? "default" : "secondary"}
          size="sm"
          className="flex items-center space-x-2"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{audioEnabled ? "关闭音频" : "开启音频"}</span>
        </Button>
      </div>
    </div>
  );
}