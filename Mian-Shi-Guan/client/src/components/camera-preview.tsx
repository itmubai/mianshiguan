import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCamera } from '@/hooks/use-camera';
import { 
  Camera, 
  CameraOff, 
  Settings, 
  Video, 
  VideoOff,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

interface CameraPreviewProps {
  isInterviewActive?: boolean;
  onRecordingStart?: () => void;
  onRecordingStop?: (videoBlob: Blob | null) => void;
  className?: string;
}

export default function CameraPreview({ 
  isInterviewActive = false, 
  onRecordingStart,
  onRecordingStop,
  className = ""
}: CameraPreviewProps) {
  const {
    videoRef,
    isRecording,
    isPermissionGranted,
    startRecording,
    stopRecording,
    requestPermission,
    getRecordedVideo,
    error
  } = useCamera();

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    if (isInterviewActive && isPermissionGranted && !isRecording) {
      handleStartRecording();
    } else if (!isInterviewActive && isRecording) {
      handleStopRecording();
    }
  }, [isInterviewActive, isPermissionGranted]);

  const handleStartRecording = async () => {
    await startRecording();
    onRecordingStart?.();
  };

  const handleStopRecording = () => {
    stopRecording();
    const videoBlob = getRecordedVideo();
    onRecordingStop?.(videoBlob);
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {/* 状态指示器 */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              录制中
            </Badge>
          )}
          {isPermissionGranted && !error && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              摄像头已连接
            </Badge>
          )}
          {error && (
            <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" />
              权限错误
            </Badge>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {isPermissionGranted && (
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleVideo}
              className="bg-black/20 hover:bg-black/30 text-white"
            >
              {isVideoEnabled ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={requestPermission}
            className="bg-black/20 hover:bg-black/30 text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* 视频预览区域 */}
        <div className="relative aspect-video bg-slate-900">
          {isPermissionGranted ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ 
                  transform: 'scaleX(-1)', // 镜像效果
                  display: isVideoEnabled ? 'block' : 'none'
                }}
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="text-center text-white">
                    <CameraOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">摄像头已关闭</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                {error ? (
                  <>
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <h3 className="text-lg font-medium mb-2">摄像头访问失败</h3>
                    <p className="text-sm opacity-75 mb-4">{error}</p>
                    <Button
                      onClick={requestPermission}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      重新获取权限
                    </Button>
                  </>
                ) : (
                  <>
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">启用摄像头</h3>
                    <p className="text-sm opacity-75 mb-4">
                      为了获得更真实的面试体验，建议开启摄像头
                    </p>
                    <Button
                      onClick={requestPermission}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      开启摄像头
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 提示信息 */}
        {isPermissionGranted && !isInterviewActive && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-black/60 rounded-lg p-3 text-white text-sm">
              <p className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                摄像头已准备就绪，开始面试时将自动录制
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}