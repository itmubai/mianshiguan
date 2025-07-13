import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  
  // 个人基本信息
  major: text("major"), // 专业
  university: text("university"), // 学校
  graduationYear: integer("graduation_year"), // 毕业年份
  phone: text("phone"), // 电话
  location: text("location"), // 所在地
  
  // 求职信息
  targetPosition: text("target_position"), // 目标职位
  targetSalary: text("target_salary"), // 期望薪资
  workExperience: text("work_experience"), // 工作经验等级
  skills: jsonb("skills").$type<string[]>(), // 技能列表
  
  // 系统信息
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const interviewSessions = pgTable("interview_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'technical', 'behavioral', 'case_study', 'random'
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'paused'
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  overallScore: integer("overall_score"),
  feedback: jsonb("feedback"),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'technical', 'behavioral', 'case_study', 'stress'
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard'
  duration: integer("duration").notNull(), // expected answer duration in seconds
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => interviewSessions.id).notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  answer: text("answer").notNull(),
  duration: integer("duration").notNull(), // actual answer duration in seconds
  speechScore: integer("speech_score"),
  contentScore: integer("content_score"),
  confidenceScore: integer("confidence_score"),
  aiEvaluation: jsonb("ai_evaluation"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  category: text("category").notNull(),
  skillLevel: integer("skill_level").notNull().default(0),
  totalPractices: integer("total_practices").notNull().default(0),
  averageScore: integer("average_score").notNull().default(0),
  lastPractice: timestamp("last_practice"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'first_perfect', 'streak_7', 'tech_expert', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  isActive: boolean("is_active").default(true),
});

// User preferences for storing frequently used interview configurations
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'interview_config'
  name: text("name").notNull(), // Display name for the configuration
  config: jsonb("config").notNull(), // Interview configuration data
  usageCount: integer("usage_count").default(1),
  lastUsedAt: timestamp("last_used_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions).omit({
  id: true,
  startTime: true,
  endTime: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  timestamp: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
});

export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type Tip = typeof tips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;
