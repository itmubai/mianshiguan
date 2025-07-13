import { 
  users, 
  interviewSessions, 
  questions, 
  responses, 
  userProgress, 
  achievements, 
  tips,
  userPreferences,
  type User, 
  type InsertUser,
  type InterviewSession,
  type InsertInterviewSession,
  type Question,
  type InsertQuestion,
  type Response,
  type InsertResponse,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type Tip,
  type InsertTip,
  type UserPreference,
  type InsertUserPreference
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Interview session operations
  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSession(id: number): Promise<InterviewSession | undefined>;
  updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined>;
  getUserInterviewSessions(userId: number): Promise<InterviewSession[]>;

  // Question operations
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByCategory(category: string): Promise<Question[]>;
  getRandomQuestions(category?: string, count?: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Response operations
  createResponse(response: InsertResponse): Promise<Response>;
  getSessionResponses(sessionId: number): Promise<Response[]>;

  // User progress operations
  getUserProgress(userId: number): Promise<UserProgress[]>;
  updateUserProgress(userId: number, category: string, updates: Partial<UserProgress>): Promise<UserProgress>;

  // Achievement operations
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Tips operations
  getAllTips(): Promise<Tip[]>;
  getTipsByCategory(category: string): Promise<Tip[]>;

  // User preferences operations
  getUserPreferences(userId: number, type: string): Promise<UserPreference[]>;
  createUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
  updateUserPreference(id: number, updates: Partial<UserPreference>): Promise<UserPreference | undefined>;
  deleteUserPreference(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private interviewSessions: Map<number, InterviewSession> = new Map();
  private questions: Map<number, Question> = new Map();
  private responses: Map<number, Response> = new Map();
  private userProgress: Map<string, UserProgress> = new Map(); // key: userId-category
  private achievements: Map<number, Achievement> = new Map();
  private tips: Map<number, Tip> = new Map();
  private userPreferences: Map<number, UserPreference> = new Map();
  
  private currentUserId = 1;
  private currentSessionId = 1;
  private currentQuestionId = 1;
  private currentResponseId = 1;
  private currentProgressId = 1;
  private currentAchievementId = 1;
  private currentTipId = 1;
  private currentPreferenceId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default user - password will be hashed during registration/login
    const defaultUser: User = {
      id: this.currentUserId++,
      username: "demo",
      name: "演示用户",
      email: "demo@example.com",
      password: "$2b$12$iDnm0BMY0SIlbo23.7l78OUTQ8VcVYA7nsUzdeeMB3lFvVlGRJBHa", // "demo123" hashed
      avatar: null,
      major: "computer_science",
      university: "演示大学",
      graduationYear: 2024,
      phone: null,
      location: "北京",
      targetPosition: "前端开发工程师",
      targetSalary: "15K-25K",
      workExperience: "fresh",
      skills: ["JavaScript", "React", "TypeScript"],
      lastLogin: null,
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Seed questions
    const sampleQuestions: Question[] = [
      {
        id: this.currentQuestionId++,
        title: "请解释一下你对面向对象编程的理解，并举例说明封装、继承、多态的概念。",
        content: "请解释一下你对面向对象编程的理解，并举例说明封装、继承、多态的概念。",
        category: "technical",
        difficulty: "medium",
        duration: 240,
        tags: ["编程", "面向对象", "基础概念"],
        isActive: true,
      },
      {
        id: this.currentQuestionId++,
        title: "描述一次你在团队中遇到冲突的经历，你是如何处理的？",
        content: "描述一次你在团队中遇到冲突的经历，你是如何处理的？",
        category: "behavioral",
        difficulty: "easy",
        duration: 180,
        tags: ["团队合作", "冲突处理", "人际关系"],
        isActive: true,
      },
      {
        id: this.currentQuestionId++,
        title: "如果你是产品经理，如何设计一个面向老年人的智能手机应用？",
        content: "如果你是产品经理，如何设计一个面向老年人的智能手机应用？",
        category: "case_study",
        difficulty: "hard",
        duration: 480,
        tags: ["产品设计", "用户体验", "案例分析"],
        isActive: true,
      },
    ];

    sampleQuestions.forEach(q => this.questions.set(q.id, q));

    // Seed tips
    const sampleTips: Tip[] = [
      {
        id: this.currentTipId++,
        title: "STAR法则",
        content: "使用Situation（情境）、Task（任务）、Action（行动）、Result（结果）的结构来回答行为类问题，让你的回答更有条理和说服力。",
        category: "behavioral",
        icon: "lightbulb",
        color: "blue",
        isActive: true,
      },
      {
        id: this.currentTipId++,
        title: "眼神交流技巧",
        content: "保持自然的眼神交流，既不要一直盯着面试官，也不要总是低头或四处张望。适当的眼神接触能展现你的自信和诚意。",
        category: "presentation",
        icon: "eye",
        color: "green",
        isActive: true,
      },
      {
        id: this.currentTipId++,
        title: "语言表达要点",
        content: "语速适中，吐字清晰，避免使用过多的口头禅。适当的停顿可以让你的表达更有节奏感，也给自己思考的时间。",
        category: "communication",
        icon: "comments",
        color: "purple",
        isActive: true,
      },
    ];

    sampleTips.forEach(t => this.tips.set(t.id, t));

    // Seed user progress
    const progressCategories = ["technical", "behavioral", "case_study", "communication", "presentation"];
    progressCategories.forEach(category => {
      const progress: UserProgress = {
        id: this.currentProgressId++,
        userId: defaultUser.id,
        category,
        skillLevel: Math.floor(Math.random() * 100) + 1,
        totalPractices: Math.floor(Math.random() * 50) + 1,
        averageScore: Math.floor(Math.random() * 30) + 70,
        lastPractice: new Date(),
        updatedAt: new Date(),
      };
      this.userProgress.set(`${defaultUser.id}-${category}`, progress);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      username: insertUser.username,
      name: insertUser.name,
      email: insertUser.email,
      password: insertUser.password,
      avatar: insertUser.avatar || null,
      major: insertUser.major || null,
      university: insertUser.university || null,
      graduationYear: insertUser.graduationYear || null,
      phone: insertUser.phone || null,
      location: insertUser.location || null,
      targetPosition: insertUser.targetPosition || null,
      targetSalary: insertUser.targetSalary || null,
      workExperience: insertUser.workExperience || null,
      skills: (insertUser.skills as string[]) || null,
      lastLogin: null,
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true,
      emailVerified: insertUser.emailVerified !== undefined ? insertUser.emailVerified : false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Interview session operations
  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const session: InterviewSession = {
      ...insertSession,
      id: this.currentSessionId++,
      startTime: new Date(),
      endTime: null,
      duration: null,
      overallScore: null,
      feedback: null,
    };
    this.interviewSessions.set(session.id, session);
    return session;
  }

  async getInterviewSession(id: number): Promise<InterviewSession | undefined> {
    return this.interviewSessions.get(id);
  }

  async updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined> {
    const session = this.interviewSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.interviewSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserInterviewSessions(userId: number): Promise<InterviewSession[]> {
    return Array.from(this.interviewSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  // Question operations
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.isActive);
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.category === category && q.isActive);
  }

  async getRandomQuestions(category?: string, count: number = 1): Promise<Question[]> {
    const questions = category 
      ? await this.getQuestionsByCategory(category)
      : await this.getAllQuestions();
    
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const question: Question = {
      ...insertQuestion,
      id: this.currentQuestionId++,
    };
    this.questions.set(question.id, question);
    return question;
  }

  // Response operations
  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const response: Response = {
      ...insertResponse,
      id: this.currentResponseId++,
      timestamp: new Date(),
    };
    this.responses.set(response.id, response);
    return response;
  }

  async getSessionResponses(sessionId: number): Promise<Response[]> {
    return Array.from(this.responses.values())
      .filter(response => response.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // User progress operations
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async updateUserProgress(userId: number, category: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const key = `${userId}-${category}`;
    let progress = this.userProgress.get(key);
    
    if (!progress) {
      progress = {
        id: this.currentProgressId++,
        userId,
        category,
        skillLevel: 0,
        totalPractices: 0,
        averageScore: 0,
        lastPractice: null,
        updatedAt: new Date(),
        ...updates,
      };
    } else {
      progress = {
        ...progress,
        ...updates,
        updatedAt: new Date(),
      };
    }
    
    this.userProgress.set(key, progress);
    return progress;
  }

  // Achievement operations
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      ...insertAchievement,
      id: this.currentAchievementId++,
      unlockedAt: new Date(),
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  // Tips operations
  async getAllTips(): Promise<Tip[]> {
    return Array.from(this.tips.values()).filter(tip => tip.isActive);
  }

  async getTipsByCategory(category: string): Promise<Tip[]> {
    return Array.from(this.tips.values()).filter(tip => tip.category === category && tip.isActive);
  }

  // User preferences operations
  async getUserPreferences(userId: number, type: string): Promise<UserPreference[]> {
    return Array.from(this.userPreferences.values())
      .filter(pref => pref.userId === userId && pref.type === type)
      .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime());
  }

  async createUserPreference(insertPreference: InsertUserPreference): Promise<UserPreference> {
    const preference: UserPreference = {
      ...insertPreference,
      id: this.currentPreferenceId++,
      createdAt: new Date(),
    };
    this.userPreferences.set(preference.id, preference);
    return preference;
  }

  async updateUserPreference(id: number, updates: Partial<UserPreference>): Promise<UserPreference | undefined> {
    const preference = this.userPreferences.get(id);
    if (!preference) return undefined;
    
    const updatedPreference = { ...preference, ...updates };
    this.userPreferences.set(id, updatedPreference);
    return updatedPreference;
  }

  async deleteUserPreference(id: number): Promise<boolean> {
    return this.userPreferences.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const [session] = await db
      .insert(interviewSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getInterviewSession(id: number): Promise<InterviewSession | undefined> {
    const [session] = await db.select().from(interviewSessions).where(eq(interviewSessions.id, id));
    return session || undefined;
  }

  async updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined> {
    const [session] = await db
      .update(interviewSessions)
      .set(updates)
      .where(eq(interviewSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserInterviewSessions(userId: number): Promise<InterviewSession[]> {
    return await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId))
      .orderBy(desc(interviewSessions.startTime));
  }

  async getAllQuestions(): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.isActive, true));
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(and(eq(questions.category, category), eq(questions.isActive, true)));
  }

  async getRandomQuestions(category?: string, count: number = 1): Promise<Question[]> {
    let query = db.select().from(questions).where(eq(questions.isActive, true));
    
    if (category) {
      query = db.select().from(questions).where(and(eq(questions.category, category), eq(questions.isActive, true)));
    }
    
    const allQuestions = await query;
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const [response] = await db
      .insert(responses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async getSessionResponses(sessionId: number): Promise<Response[]> {
    return await db
      .select()
      .from(responses)
      .where(eq(responses.sessionId, sessionId))
      .orderBy(responses.timestamp);
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(userId: number, category: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const [existing] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.category, category)));

    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.category, category)))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values({
          userId,
          category,
          skillLevel: 0,
          totalPractices: 0,
          averageScore: 0,
          lastPractice: null,
          updatedAt: new Date(),
          ...updates
        })
        .returning();
      return created;
    }
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }

  async getAllTips(): Promise<Tip[]> {
    return await db
      .select()
      .from(tips)
      .where(eq(tips.isActive, true));
  }

  async getTipsByCategory(category: string): Promise<Tip[]> {
    return await db
      .select()
      .from(tips)
      .where(and(eq(tips.category, category), eq(tips.isActive, true)));
  }

  // User preferences operations
  async getUserPreferences(userId: number, type: string): Promise<UserPreference[]> {
    return await db
      .select()
      .from(userPreferences)
      .where(and(eq(userPreferences.userId, userId), eq(userPreferences.type, type)))
      .orderBy(desc(userPreferences.lastUsedAt));
  }

  async createUserPreference(insertPreference: InsertUserPreference): Promise<UserPreference> {
    const [preference] = await db
      .insert(userPreferences)
      .values(insertPreference)
      .returning();
    return preference;
  }

  async updateUserPreference(id: number, updates: Partial<UserPreference>): Promise<UserPreference | undefined> {
    const [preference] = await db
      .update(userPreferences)
      .set(updates)
      .where(eq(userPreferences.id, id))
      .returning();
    return preference || undefined;
  }

  async deleteUserPreference(id: number): Promise<boolean> {
    const result = await db
      .delete(userPreferences)
      .where(eq(userPreferences.id, id));
    return result.rowCount > 0;
  }
}

// Initialize database storage and seed with default data
async function initializeDatabase() {
  // 只在有数据库连接时才初始化数据库
  if (!db) {
    console.log("No database connection, using memory storage mode");
    return;
  }
  
  try {
    // Check if default user exists
    const [existingUser] = await db.select().from(users).where(eq(users.username, "demo"));
    
    if (!existingUser) {
      // Create default user with hashed password
      const [defaultUser] = await db
        .insert(users)
        .values({
          username: "demo",
          name: "演示用户",
          email: "demo@example.com",
          password: "$2b$12$iDnm0BMY0SIlbo23.7l78OUTQ8VcVYA7nsUzdeeMB3lFvVlGRJBHa",
          avatar: null,
          major: "computer_science",
          university: "演示大学",
          graduationYear: 2024,
          phone: null,
          location: "北京",
          targetPosition: "前端开发工程师",
          targetSalary: "15K-25K",
          workExperience: "fresh",
          skills: ["JavaScript", "React", "TypeScript"],
          lastLogin: null,
          isActive: true,
          emailVerified: false,
        })
        .returning();

      // Seed initial questions
      const sampleQuestions = [
        {
          title: "请解释一下你对面向对象编程的理解，并举例说明封装、继承、多态的概念。",
          content: "请解释一下你对面向对象编程的理解，并举例说明封装、继承、多态的概念。",
          category: "technical",
          difficulty: "medium",
          duration: 240,
          tags: ["编程", "面向对象", "基础概念"],
          isActive: true,
        },
        {
          title: "描述一次你在团队中遇到冲突的经历，你是如何处理的？",
          content: "描述一次你在团队中遇到冲突的经历，你是如何处理的？",
          category: "behavioral",
          difficulty: "easy",
          duration: 180,
          tags: ["团队合作", "冲突处理", "人际关系"],
          isActive: true,
        },
        {
          title: "如果你是产品经理，如何设计一个面向老年人的智能手机应用？",
          content: "如果你是产品经理，如何设计一个面向老年人的智能手机应用？",
          category: "case_study",
          difficulty: "hard",
          duration: 480,
          tags: ["产品设计", "用户体验", "案例分析"],
          isActive: true,
        },
      ];

      await db.insert(questions).values(sampleQuestions);

      // Seed tips
      const sampleTips = [
        {
          title: "STAR法则",
          content: "使用Situation（情境）、Task（任务）、Action（行动）、Result（结果）的结构来回答行为类问题，让你的回答更有条理和说服力。",
          category: "behavioral",
          icon: "lightbulb",
          color: "blue",
          isActive: true,
        },
        {
          title: "眼神交流技巧",
          content: "保持自然的眼神交流，既不要一直盯着面试官，也不要总是低头或四处张望。适当的眼神接触能展现你的自信和诚意。",
          category: "presentation",
          icon: "eye",
          color: "green",
          isActive: true,
        },
        {
          title: "语言表达要点",
          content: "语速适中，吐字清晰，避免使用过多的口头禅。适当的停顿可以让你的表达更有节奏感，也给自己思考的时间。",
          category: "communication",
          icon: "comments",
          color: "purple",
          isActive: true,
        },
      ];

      await db.insert(tips).values(sampleTips);

      // Seed user progress
      const progressCategories = ["technical", "behavioral", "case_study", "communication", "presentation"];
      const progressData = progressCategories.map(category => ({
        userId: defaultUser.id,
        category,
        skillLevel: Math.floor(Math.random() * 100) + 1,
        totalPractices: Math.floor(Math.random() * 50) + 1,
        averageScore: Math.floor(Math.random() * 30) + 70,
        lastPractice: new Date(),
        updatedAt: new Date(),
      }));

      await db.insert(userProgress).values(progressData);

      console.log("Database initialized with seed data");
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

export const storage = new MemStorage();

// Initialize database on startup
initializeDatabase();
