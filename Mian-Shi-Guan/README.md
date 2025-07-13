# 面试官项目

这是一个智能面试官系统，帮助用户进行面试练习和评估。

## 环境要求

- Node.js 18+
- PostgreSQL 数据库
- npm 或 yarn

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量配置

创建 `.env` 文件并配置以下环境变量：

```env
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/mianshiguan

# JWT密钥（用于用户认证）
JWT_SECRET=your-secret-key-change-in-production

# OpenAI API配置（可选，用于AI功能）
OPENAI_API_KEY=your-openai-api-key

# 讯飞星火API配置（可选，用于AI功能）
SPARK_APP_ID=your-spark-app-id
SPARK_API_SECRET=your-spark-api-secret
SPARK_API_KEY=your-spark-api-key

# 环境配置
NODE_ENV=development
```

### 3. 数据库设置

确保您有一个PostgreSQL数据库实例，并更新 `.env` 文件中的 `DATABASE_URL`。

### 4. 运行数据库迁移

```bash
npm run db:push
```

### 5. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:5000 启动。

## 功能特性

- 用户注册和登录
- 面试会话管理
- 智能问题生成
- AI驱动的面试评估
- 进度跟踪和成就系统
- 实时反馈和建议

## 技术栈

- **前端**: React, TypeScript, Tailwind CSS, Vite
- **后端**: Express.js, TypeScript
- **数据库**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI API, 讯飞星火API
- **认证**: JWT

## 默认用户

系统会自动创建一个演示用户：
- 用户名: `demo`
- 密码: `demo123`

## 注意事项

1. 确保数据库连接正常
2. AI功能需要配置相应的API密钥
3. 生产环境请更改JWT_SECRET
4. 项目运行在端口5000上 