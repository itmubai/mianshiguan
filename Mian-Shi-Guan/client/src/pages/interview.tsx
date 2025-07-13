import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InterviewSetup, { type InterviewConfig } from "@/components/interview-setup";
import InterviewConfigSelector from "@/components/interview-config-selector";
import MultiQuestionInterview from "@/components/multi-question-interview";
import EvaluationResults from "@/components/evaluation-results";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Play, Settings } from "lucide-react";
import type { InterviewSession, Question } from "@shared/schema";

interface InterviewData {
  session: InterviewSession;
  questions: Question[];
  currentQuestion: Question;
  config?: InterviewConfig;
}

interface EvaluationData {
  overallScore: number;
  speechScore: number;
  contentScore: number;
  confidenceScore: number;
  bodyLanguageScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  nextRecommendations: string[];
}

export default function Interview() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [interviewState, setInterviewState] = useState<"config" | "setup" | "in_progress" | "evaluation">("setup");
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [showAdvancedSetup, setShowAdvancedSetup] = useState(false);

  const startInterviewMutation = useMutation({
    mutationFn: async (config: InterviewConfig) => {
      const response = await apiRequest("POST", "/api/interview/start", config);
      return await response.json();
    },
    onSuccess: (data: any) => {
      setInterviewData(data);
      setSessionStartTime(new Date());
      setInterviewState("in_progress");
    },
    onError: (error) => {
      console.error("Start interview error:", error);
      alert("启动面试失败，请重试");
    },
  });

  const submitResponseMutation = useMutation({
    mutationFn: async ({ sessionId, questionId, answer, duration }: {
      sessionId: number;
      questionId: number;
      answer: string;
      duration: number;
    }) => {
      const payload = {
        questionId,
        answer,
        duration,
        major: interviewConfig?.major,
        position: interviewConfig?.position,
      };
      const res = await apiRequest("POST", `/api/interview/${sessionId}/response`, payload);
      return res.json();
    },
    onSuccess: (data) => {
      setEvaluationData(data.evaluation);
      setInterviewState("evaluation");
    },
  });

  const endInterviewMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
      const res = await apiRequest("POST", `/api/interview/${sessionId}/end`, {
        duration: sessionDuration,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setEvaluationData(data.evaluation);
      setInterviewState("evaluation");
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
  });

  const handleStartInterview = (config: InterviewConfig) => {
    setInterviewConfig(config);
    startInterviewMutation.mutate(config);
  };

  const handleResponse = (answer: string, duration: number) => {
    if (!interviewData) return;
    
    submitResponseMutation.mutate({
      sessionId: interviewData.session.id,
      questionId: interviewData.currentQuestion.id,
      answer,
      duration,
    });
  };

  interface InterviewResponse {
    questionId: number;
    answer: string;
    duration: number;
    timestamp: Date;
  }

  const handleMultipleResponses = async (responses: InterviewResponse[]) => {
    if (!interviewData) return;
    
    try {
      // Submit all responses
      for (const response of responses) {
        await fetch(`/api/interview/${interviewData.session.id}/response`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: response.questionId,
            answer: response.answer,
            duration: response.duration,
          }),
        });
      }
      
      // End the interview and get comprehensive evaluation
      endInterviewMutation.mutate(interviewData.session.id);
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  const handleEndInterview = () => {
    if (!interviewData) return;
    endInterviewMutation.mutate(interviewData.session.id);
  };

  const handleRetry = () => {
    setInterviewState("in_progress");
    setEvaluationData(null);
  };

  const handleContinue = () => {
    setLocation("/questions");
  };

  useEffect(() => {
    if (interviewState === "in_progress" && interviewData) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [interviewState, interviewData]);

  if (interviewState === "setup") {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InterviewSetup 
            onStart={handleStartInterview}
            isLoading={startInterviewMutation.isPending}
          />
        </div>
      </div>
    );
  }

  if (interviewState === "in_progress" && interviewData) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">模拟面试进行中</h1>
            <p className="text-slate-600">请认真回答问题，AI正在实时评估你的表现</p>
          </div>

          <MultiQuestionInterview
            questions={interviewData.questions}
            config={interviewConfig!}
            onComplete={handleMultipleResponses}
            sessionId={interviewData.session.id}
          />
        </div>
      </div>
    );
  }

  if (interviewState === "evaluation" && evaluationData) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">AI智能评测结果</h1>
            <p className="text-slate-600">基于多模态分析的详细反馈</p>
          </div>

          <EvaluationResults
            evaluation={evaluationData}
            onRetry={handleRetry}
            onContinue={handleContinue}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
        <p className="text-slate-600">正在加载...</p>
      </div>
    </div>
  );
}
