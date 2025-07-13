// 混合AI系统 - 优先使用OpenAI API，降级到本地算法
import { generateInterviewQuestion as openaiGenerate, evaluateInterviewResponse as openaiEvaluate } from "./openai";
import { generateInterviewQuestion as localGenerate, evaluateInterviewResponse as localEvaluate } from "./local-ai";

export interface InterviewEvaluation {
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

export async function generateInterviewQuestion(
  category: string, 
  difficulty: string, 
  major?: string, 
  position?: string
): Promise<{title: string, content: string, expectedDuration: number}> {
  
  try {
    // 尝试使用OpenAI API
    if (process.env.OPENAI_API_KEY) {
      console.log("Using OpenAI API for question generation");
      return await openaiGenerate(category, difficulty, major, position);
    }
  } catch (error) {
    console.log("OpenAI API failed, falling back to local generation:", error instanceof Error ? error.message : "Unknown error");
  }
  
  // 降级到本地算法
  console.log("Using local AI for question generation");
  return await localGenerate(category, difficulty, major, position);
}

export async function evaluateInterviewResponse(
  question: string,
  answer: string,
  duration: number,
  expectedDuration: number,
  major?: string,
  position?: string
): Promise<InterviewEvaluation> {
  
  try {
    // 尝试使用OpenAI API
    if (process.env.OPENAI_API_KEY) {
      console.log("Using OpenAI API for evaluation");
      return await openaiEvaluate(question, answer, duration, String(expectedDuration), major, position);
    }
  } catch (error) {
    console.log("OpenAI API failed, falling back to local evaluation:", error instanceof Error ? error.message : "Unknown error");
  }
  
  // 降级到本地算法
  console.log("Using local AI for evaluation");
  return await localEvaluate(question, answer, duration, expectedDuration, major, position);
}