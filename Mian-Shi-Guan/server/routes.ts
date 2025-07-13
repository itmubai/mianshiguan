import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { evaluateInterviewResponse, generateInterviewQuestion } from "./hybrid-ai";
import { insertInterviewSessionSchema, insertResponseSchema } from "@shared/schema";
import { setupAuthRoutes } from "./auth-routes";
import { authenticateToken, type AuthenticatedRequest } from "./auth";
import { CompetitionQuestionBank } from "./competition-question-bank";
import { evaluateCompetitionResponse } from "./competition-evaluation";
import { evaluateInterviewWithSpark, generateInterviewQuestionWithSpark } from "./spark-ai";
import { z } from "zod";
import { analyzeAllFaceFeatures } from './face-analysis';
import { synthesizeTTS } from './tts-xfyun';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Setup authentication routes
  setupAuthRoutes(app);
  
  // Get current user
  app.get("/api/user", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get user dashboard stats
  app.get("/api/user/stats", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const sessions = await storage.getUserInterviewSessions(userId);
      const progress = await storage.getUserProgress(userId);
      
      const completedSessions = sessions.filter(s => s.status === "completed");
      const totalPractices = completedSessions.length;
      const averageScore = totalPractices > 0 
        ? Math.round(completedSessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / totalPractices)
        : 0;
      
      const totalTime = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const totalHours = Math.round(totalTime / 3600);

      res.json({
        totalPractices,
        averageScore,
        totalTime: `${totalHours}小时`,
        improvement: "+12.3%", // Mock improvement percentage
        recentActivities: completedSessions.slice(0, 3).map(session => ({
          id: session.id,
          title: `${session.type === 'technical' ? '技术面试' : session.type === 'behavioral' ? '行为面试' : '综合面试'}`,
          score: session.overallScore || 0,
          time: session.endTime ? `${Math.floor((Date.now() - session.endTime.getTime()) / (1000 * 60 * 60))}小时前` : '进行中'
        }))
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });

  // Start interview session
  app.post("/api/interview/start", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { type, major, position, company, experience, questionCount = 5 } = req.body;
      
      const sessionData = insertInterviewSessionSchema.parse({
        userId: req.user!.id,
        type: type || "random",
        status: "in_progress"
      });

      const session = await storage.createInterviewSession(sessionData);
      
      // Generate multiple specialized questions using enhanced local AI
      const { generateInterviewQuestion } = await import('./advanced-local-ai');
      const { questionGenerator } = await import('./question-generator');
      questionGenerator.reset(); // 重置避免重复
      
      const generatedQuestions = questionGenerator.generateQuestions(major, questionCount);
      const questions = [];
      
      for (const genQuestion of generatedQuestions) {
        const question = await storage.createQuestion({
          title: genQuestion.title,
          content: genQuestion.content,
          category: genQuestion.category,
          difficulty: experience === "fresh" ? "easy" : experience === "1-3" ? "medium" : "hard",
          duration: genQuestion.expectedDuration,
          tags: [major, position].filter(Boolean),
          isActive: true
        });
        
        questions.push(question);
      }

      res.json({
        session,
        questions,
        currentQuestion: questions[0], // 保持兼容性
        config: { major, position, company, experience, questionCount }
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      res.status(500).json({ message: "Failed to start interview session" });
    }
  });

  // Submit interview response
  app.post("/api/interview/:sessionId/response", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { questionId, answer, duration, major, position } = req.body;
      
      const responseData = insertResponseSchema.parse({
        sessionId,
        questionId,
        answer,
        duration
      });

      // Get question details for evaluation
      const question = await storage.getQuestion(responseData.questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Use enhanced local AI evaluation (completely free)
      const { evaluateInterviewResponse: advancedLocalEvaluate } = await import('./advanced-local-ai');
      const evaluation = await advancedLocalEvaluate(
        responseData.answer,
        responseData.duration,
        question.duration,
        major,
        position
      );

      // Save response with AI evaluation
      const response = await storage.createResponse({
        ...responseData,
        speechScore: evaluation.speechScore,
        contentScore: evaluation.contentScore,
        confidenceScore: evaluation.confidenceScore,
        aiEvaluation: evaluation
      });

      res.json({
        response,
        evaluation
      });
    } catch (error) {
      console.error("Failed to submit response:", error);
      res.status(500).json({ message: "Failed to submit response" });
    }
  });

  // End interview session
  app.post("/api/interview/:sessionId/end", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const responses = await storage.getSessionResponses(sessionId);
      
      // Calculate overall score
      const overallScore = responses.length > 0
        ? Math.round(responses.reduce((sum, r) => {
            const avgScore = ((r.speechScore || 0) + (r.contentScore || 0) + (r.confidenceScore || 0)) / 3;
            return sum + avgScore;
          }, 0) / responses.length)
        : 0;

      // Update session
      const updatedSession = await storage.updateInterviewSession(sessionId, {
        status: "completed",
        endTime: new Date(),
        duration: req.body.duration || 0,
        overallScore,
        feedback: {
          responses: responses.map(r => r.aiEvaluation),
          overallScore
        }
      });

      // Update user progress
      const session = await storage.getInterviewSession(sessionId);
      if (session) {
        await storage.updateUserProgress(session.userId, session.type, {
          totalPractices: responses.length,
          averageScore: overallScore,
          lastPractice: new Date()
        });
      }

      // Generate comprehensive evaluation using advanced local AI
      const { evaluateInterviewResponse: advancedLocalEvaluate } = await import('./advanced-local-ai');
      
      // Combine all responses for comprehensive evaluation
      const allAnswers = responses.map(r => r.answer).join('\n');
      const totalDuration = responses.reduce((sum, r) => sum + r.duration, 0);
      const expectedTotalDuration = responses.length * 180; // 3 minutes per question average
      
      const comprehensiveEvaluation = await advancedLocalEvaluate(
        allAnswers,
        totalDuration,
        expectedTotalDuration,
        session?.type,
        "general"
      );

      res.json({
        session: updatedSession,
        evaluation: comprehensiveEvaluation,
        overallScore,
        responses
      });
    } catch (error) {
      console.error("Failed to end interview:", error);
      res.status(500).json({ message: "Failed to end interview session" });
    }
  });

  // Get questions
  app.get("/api/questions", async (req, res) => {
    try {
      const category = req.query.category as string;
      const questions = category 
        ? await storage.getQuestionsByCategory(category)
        : await storage.getAllQuestions();
      
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get questions" });
    }
  });

  // Get user progress
  app.get("/api/user/progress", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const progress = await storage.getUserProgress(userId);
      const achievements = await storage.getUserAchievements(userId);
      
      res.json({
        progress,
        achievements
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  // Get tips
  app.get("/api/tips", async (req, res) => {
    try {
      const category = req.query.category as string;
      const tips = category 
        ? await storage.getTipsByCategory(category)
        : await storage.getAllTips();
      
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tips" });
    }
  });

  // Get interview sessions
  app.get("/api/user/sessions", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const sessions = await storage.getUserInterviewSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sessions" });
    }
  });

  // User preferences routes for saving frequently used interview configurations
  app.get("/api/user/preferences/:type", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { type } = req.params;
      const userId = req.user!.id;
      const preferences = await storage.getUserPreferences(userId, type);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post("/api/user/preferences", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const { type, name, config } = req.body;
      
      // Check if preference with same name already exists
      const existingPrefs = await storage.getUserPreferences(userId, type);
      const existing = existingPrefs.find(p => p.name === name);
      
      if (existing) {
        // Update existing preference
        const updated = await storage.updateUserPreference(existing.id, {
          config,
          usageCount: (existing.usageCount || 0) + 1,
          lastUsedAt: new Date(),
        });
        res.json(updated);
      } else {
        // Create new preference
        const preference = await storage.createUserPreference({
          userId,
          type,
          name,
          config,
          usageCount: 1,
          lastUsedAt: new Date(),
        });
        res.json(preference);
      }
    } catch (error) {
      console.error("Error saving user preference:", error);
      res.status(500).json({ message: "Failed to save preference" });
    }
  });

  app.put("/api/user/preferences/:id/use", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const preference = await storage.updateUserPreference(parseInt(id), {
        usageCount: req.body.usageCount + 1,
        lastUsedAt: new Date(),
      });
      res.json(preference);
    } catch (error) {
      console.error("Error updating preference usage:", error);
      res.status(500).json({ message: "Failed to update preference usage" });
    }
  });

  app.delete("/api/user/preferences/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUserPreference(parseInt(id));
      if (success) {
        res.json({ message: "Preference deleted successfully" });
      } else {
        res.status(404).json({ message: "Preference not found" });
      }
    } catch (error) {
      console.error("Error deleting user preference:", error);
      res.status(500).json({ message: "Failed to delete preference" });
    }
  });

  // === Spark AI Enhanced Evaluation Routes ===

  // Spark AI enhanced interview evaluation
  app.post("/api/spark/interview/evaluate", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { answer, questionCategory, position, audioData, videoData, duration } = req.body;
      
      if (!answer || !questionCategory) {
        return res.status(400).json({ message: "回答内容和技术领域不能为空" });
      }

      const evaluation = await evaluateInterviewWithSpark(
        answer,
        questionCategory,
        position || "技术岗位",
        audioData,
        videoData,
        duration
      );

      res.json({
        success: true,
        evaluation,
        source: "讯飞星火大模型"
      });
    } catch (error) {
      console.error("Spark AI评测失败:", error);
      res.status(500).json({ message: "AI评测服务暂时不可用，请稍后重试" });
    }
  });

  // Spark AI question generation
  app.post("/api/spark/interview/generate-question", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { category, difficulty, major, position, company } = req.body;
      
      if (!category) {
        return res.status(400).json({ message: "技术领域不能为空" });
      }

      const question = await generateInterviewQuestionWithSpark(
        category,
        difficulty || "中等",
        major,
        position,
        company
      );

      res.json({
        success: true,
        question,
        source: "讯飞星火大模型"
      });
    } catch (error) {
      console.error("Spark AI问题生成失败:", error);
      res.status(500).json({ message: "AI问题生成服务暂时不可用" });
    }
  });

  // Enhanced competition interview with Spark AI
  app.post("/api/competition/interview/:sessionId/response/spark", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionId } = req.params;
      const { questionId, answer, audioData, videoData, duration } = req.body;
      
      const session = await storage.getInterviewSession(Number(sessionId));
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      const config = JSON.parse(session.config || '{}');
      
      const sparkEvaluation = await evaluateInterviewWithSpark(
        answer,
        config.domain,
        config.position,
        audioData,
        videoData,
        duration
      );

      const competitionEvaluation = await evaluateCompetitionResponse({
        answer,
        audioData,
        videoData,
        duration: duration || 0,
        questionCategory: config.domain,
        position: config.position,
        evaluationMode: config.evaluationMode
      });

      const fusedEvaluation = {
        ...sparkEvaluation,
        competitionScore: competitionEvaluation.overallScore,
        dualValidation: {
          spark: sparkEvaluation.overallScore,
          competition: competitionEvaluation.overallScore,
          variance: Math.abs(sparkEvaluation.overallScore - competitionEvaluation.overallScore)
        }
      };

      const responseData = {
        sessionId: Number(sessionId),
        questionId,
        answer,
        score: sparkEvaluation.overallScore,
        feedback: JSON.stringify(fusedEvaluation),
        duration: duration || 0,
        submittedAt: new Date()
      };

      const response = await storage.createResponse(responseData);
      
      res.json({
        response: {
          id: response.id,
          score: response.score,
          evaluation: fusedEvaluation,
          evaluationType: "spark_enhanced"
        }
      });
    } catch (error) {
      console.error("Spark增强评测失败:", error);
      res.status(500).json({ message: "增强评测服务失败" });
    }
  });

  // 人脸特征分析API
  app.post('/api/face-analysis', async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: 'No image provided' });
      const result = await analyzeAllFaceFeatures(image);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 讯飞TTS语音合成API
  app.post('/api/tts', async (req, res) => {
    try {
      console.log('[TTS] /api/tts 路由被调用，参数：', req.body);
      const { text, voiceName, speed, volume, pitch } = req.body;
      if (!text) return res.status(400).json({ error: 'No text provided' });
      const audioBuffer = await synthesizeTTS(text, voiceName, speed, volume, pitch);
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);
      console.log('[TTS] 音频流已返回，长度：', audioBuffer.length);
    } catch (err) {
      console.error('[TTS] 合成或返回失败：', err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
