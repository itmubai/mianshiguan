import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return "刚刚";
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString();
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-orange-500";
  return "text-red-500";
}

export function getScoreLevel(score: number): string {
  if (score >= 90) return "优秀";
  if (score >= 80) return "良好";
  if (score >= 70) return "一般";
  return "待提升";
}

export function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    technical: "技术面试",
    behavioral: "行为面试",
    case_study: "案例分析",
    stress: "压力面试",
    communication: "沟通表达",
    presentation: "演讲展示",
  };
  return categoryMap[category] || category;
}

export function getDifficultyName(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    easy: "简单",
    medium: "中等",
    hard: "困难",
  };
  return difficultyMap[difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const colorMap: Record<string, string> = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };
  return colorMap[difficulty] || "bg-gray-100 text-gray-800";
}

export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    technical: "bg-blue-100 text-blue-800",
    behavioral: "bg-green-100 text-green-800",
    case_study: "bg-purple-100 text-purple-800",
    stress: "bg-red-100 text-red-800",
    communication: "bg-orange-100 text-orange-800",
    presentation: "bg-pink-100 text-pink-800",
  };
  return colorMap[category] || "bg-gray-100 text-gray-800";
}
