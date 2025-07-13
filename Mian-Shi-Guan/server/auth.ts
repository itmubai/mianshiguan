import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

// 生成JWT token
export function generateToken(user: { id: number; username: string; email: string }): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// 验证JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// 密码验证
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// 认证中间件
export async function authenticateToken(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: '访问被拒绝，需要登录' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(403).json({ message: 'Token无效' });
      return;
    }

    // 验证用户是否仍然存在且活跃
    const user = await storage.getUser(decoded.id);
    if (!user || !user.isActive) {
      res.status(403).json({ message: '用户不存在或已禁用' });
      return;
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (error) {
    res.status(403).json({ message: 'Token验证失败' });
  }
}

// 可选认证中间件（不强制要求登录）
export async function optionalAuth(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await storage.getUser(decoded.id);
        if (user && user.isActive) {
          req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
          };
        }
      }
    } catch (error) {
      // 静默处理，不阻止请求继续
    }
  }

  next();
}

// 用户注册
export async function registerUser(userData: {
  username: string;
  name: string;
  email: string;
  password: string;
  major?: string;
  university?: string;
  graduationYear?: number;
  phone?: string;
  location?: string;
}) {
  // 检查用户名和邮箱是否已存在
  const existingUser = await storage.getUserByUsername(userData.username);
  if (existingUser) {
    throw new Error('用户名已存在');
  }

  const existingEmail = await storage.getUserByEmail(userData.email);
  if (existingEmail) {
    throw new Error('邮箱已被注册');
  }

  // 加密密码
  const hashedPassword = await hashPassword(userData.password);

  // 创建用户
  const newUser = await storage.createUser({
    ...userData,
    password: hashedPassword,
    isActive: true,
    emailVerified: false
  });

  // 生成token
  const token = generateToken({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email
  });

  // 返回用户信息（不包含密码）
  const { password, ...userWithoutPassword } = newUser;
  
  return {
    user: userWithoutPassword,
    token
  };
}

// 用户登录
export async function loginUser(loginData: {
  username: string;
  password: string;
}) {
  // 查找用户
  const user = await storage.getUserByUsername(loginData.username);
  if (!user) {
    throw new Error('用户名或密码错误');
  }

  // 检查用户是否活跃
  if (!user.isActive) {
    throw new Error('账户已被禁用');
  }

  // 验证密码
  const isPasswordValid = await comparePassword(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('用户名或密码错误');
  }

  // 更新最后登录时间
  await storage.updateUser(user.id, {
    lastLogin: new Date()
  });

  // 生成token
  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email
  });

  // 返回用户信息（不包含密码）
  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
}

// 更新用户资料
export async function updateUserProfile(userId: number, updateData: {
  name?: string;
  email?: string;
  major?: string;
  university?: string;
  graduationYear?: number;
  phone?: string;
  location?: string;
  targetPosition?: string;
  targetSalary?: string;
  workExperience?: string;
  skills?: string[];
  avatar?: string;
}) {
  // 如果更新邮箱，检查是否已被其他用户使用
  if (updateData.email) {
    const existingUser = await storage.getUserByEmail(updateData.email);
    if (existingUser && existingUser.id !== userId) {
      throw new Error('邮箱已被其他用户使用');
    }
  }

  const updatedUser = await storage.updateUser(userId, {
    ...updateData,
    updatedAt: new Date()
  });

  if (!updatedUser) {
    throw new Error('用户不存在');
  }

  // 返回用户信息（不包含密码）
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

// 修改密码
export async function changePassword(userId: number, passwordData: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error('用户不存在');
  }

  // 验证当前密码
  const isCurrentPasswordValid = await comparePassword(passwordData.currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new Error('当前密码错误');
  }

  // 加密新密码
  const hashedNewPassword = await hashPassword(passwordData.newPassword);

  // 更新密码
  await storage.updateUser(userId, {
    password: hashedNewPassword,
    updatedAt: new Date()
  });

  return { message: '密码修改成功' };
}