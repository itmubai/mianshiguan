import { Express } from "express";
import { 
  registerUser, 
  loginUser, 
  updateUserProfile, 
  changePassword,
  authenticateToken,
  AuthenticatedRequest 
} from "./auth";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

// 注册验证schema
const registerSchema = z.object({
  username: z.string()
    .min(3, "用户名至少3个字符")
    .max(20, "用户名最多20个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  name: z.string().min(1, "姓名不能为空").max(50, "姓名最多50个字符"),
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
  major: z.string().optional().nullable(),
  university: z.string().optional().nullable(),
  graduationYear: z.number().int().min(2020).max(2030).optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});

// 登录验证schema
const loginSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(1, "密码不能为空"),
});

// 用户资料更新schema
const profileUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  major: z.string().optional(),
  university: z.string().optional(),
  graduationYear: z.number().int().min(2020).max(2030).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  targetPosition: z.string().optional(),
  targetSalary: z.string().optional(),
  workExperience: z.enum(["fresh", "1-3", "3-5", "5+"]).optional(),
  skills: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

// 修改密码schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "当前密码不能为空"),
  newPassword: z.string().min(6, "新密码至少6个字符").max(100, "新密码最多100个字符"),
});

export function setupAuthRoutes(app: Express) {
  // 用户注册
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Convert null values to undefined for compatibility
      const userData = {
        ...validatedData,
        major: validatedData.major || undefined,
        university: validatedData.university || undefined,
        graduationYear: validatedData.graduationYear || undefined,
        phone: validatedData.phone || undefined,
        location: validatedData.location || undefined,
      };
      
      const result = await registerUser(userData);
      
      res.status(201).json({
        message: "注册成功",
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "输入数据验证失败",
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else if (error.message === "用户名已存在") {
        res.status(409).json({
          message: "用户名已被注册，请选择其他用户名",
          field: "username"
        });
      } else if (error.message === "邮箱已被注册") {
        res.status(409).json({
          message: "邮箱已被注册，请使用其他邮箱或尝试登录",
          field: "email"
        });
      } else {
        res.status(400).json({
          message: error.message || "注册失败"
        });
      }
    }
  });

  // 用户登录
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const result = await loginUser(validatedData);
      
      res.json({
        message: "登录成功",
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "输入数据验证失败",
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        res.status(401).json({
          message: error.message || "登录失败"
        });
      }
    }
  });

  // 获取当前用户信息
  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "用户不存在" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "获取用户信息失败" });
    }
  });

  // 更新用户资料
  app.put("/api/auth/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = profileUpdateSchema.parse(req.body);
      
      const updatedUser = await updateUserProfile(req.user!.id, validatedData);
      
      res.json({
        message: "资料更新成功",
        user: updatedUser
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "输入数据验证失败",
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        res.status(400).json({
          message: error.message || "资料更新失败"
        });
      }
    }
  });

  // 修改密码
  app.post("/api/auth/change-password", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = changePasswordSchema.parse(req.body);
      
      const result = await changePassword(req.user!.id, validatedData);
      
      res.json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "输入数据验证失败",
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        res.status(400).json({
          message: error.message || "密码修改失败"
        });
      }
    }
  });

  // 用户登出（客户端处理token删除，服务端可记录日志）
  app.post("/api/auth/logout", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // 这里可以添加登出日志记录
      res.json({ message: "登出成功" });
    } catch (error) {
      res.status(500).json({ message: "登出失败" });
    }
  });

  // 验证token有效性
  app.get("/api/auth/verify", authenticateToken, async (req: AuthenticatedRequest, res) => {
    res.json({ 
      valid: true, 
      user: {
        id: req.user!.id,
        username: req.user!.username,
        email: req.user!.email
      }
    });
  });
}