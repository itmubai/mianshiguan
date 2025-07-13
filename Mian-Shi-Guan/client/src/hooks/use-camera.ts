import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
  isPermissionGranted: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  requestPermission: () => Promise<void>;
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
  getRecordedVideo: () => Blob | null;
  error: string | null;
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsPermissionGranted(true);
      
      // 设置媒体录制器
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        setIsRecording(false);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      
    } catch (err) {
      console.error('摄像头权限获取失败:', err);
      let errorMsg = '无法访问摄像头，请检查权限设置';
      if (err && typeof err === 'object') {
        // @ts-ignore
        if (err.name) errorMsg += `\n错误类型: ${err.name}`;
        // @ts-ignore
        if (err.message) errorMsg += `\n详细信息: ${err.message}`;
      }
      setError(errorMsg);
      setIsPermissionGranted(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!isPermissionGranted) {
      await requestPermission();
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      setRecordedChunks([]);
      mediaRecorderRef.current.start(1000); // 每秒记录一次数据
      setIsRecording(true);
    }
  }, [isPermissionGranted, requestPermission]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const getRecordedVideo = useCallback(() => {
    if (recordedChunks.length === 0) return null;
    
    return new Blob(recordedChunks, {
      type: 'video/webm'
    });
  }, [recordedChunks]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    isRecording,
    isPermissionGranted,
    startRecording,
    stopRecording,
    requestPermission,
    mediaRecorder: mediaRecorderRef.current,
    recordedChunks,
    getRecordedVideo,
    error
  };
}