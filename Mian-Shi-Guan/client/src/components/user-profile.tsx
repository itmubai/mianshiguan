import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Edit3, Save, X, CheckCircle, AlertCircle, LogOut } from "lucide-react";

export default function UserProfile() {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    major: user?.major || "",
    university: user?.university || "",
    graduationYear: user?.graduationYear || new Date().getFullYear(),
    phone: user?.phone || "",
    location: user?.location || "",
    targetPosition: user?.targetPosition || "",
    targetSalary: user?.targetSalary || "",
    workExperience: user?.workExperience || "",
    skills: user?.skills || [],
  });

  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("个人信息更新成功！");
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message || "更新失败");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      major: user?.major || "",
      university: user?.university || "",
      graduationYear: user?.graduationYear || new Date().getFullYear(),
      phone: user?.phone || "",
      location: user?.location || "",
      targetPosition: user?.targetPosition || "",
      targetSalary: user?.targetSalary || "",
      workExperience: user?.workExperience || "",
      skills: user?.skills || [],
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const majors = [
    { value: "computer_science", label: "计算机科学与技术" },
    { value: "software_engineering", label: "软件工程" },
    { value: "information_technology", label: "信息技术" },
    { value: "data_science", label: "数据科学与大数据技术" },
    { value: "artificial_intelligence", label: "人工智能" },
    { value: "cybersecurity", label: "网络空间安全" },
    { value: "electronics", label: "电子工程" },
    { value: "automation", label: "自动化" },
    { value: "telecommunications", label: "通信工程" },
    { value: "business", label: "工商管理" },
    { value: "economics", label: "经济学" },
    { value: "marketing", label: "市场营销" },
    { value: "other", label: "其他专业" }
  ];

  const workExperienceOptions = [
    { value: "fresh", label: "应届毕业生" },
    { value: "1-3", label: "1-3年" },
    { value: "3-5", label: "3-5年" },
    { value: "5+", label: "5年以上" }
  ];

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-0 shadow-xl rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || ""} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            个人资料
          </CardTitle>
          <div className="flex items-center justify-center gap-4 mt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                编辑资料
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Button>
              </div>
            )}
            <Button
              onClick={logout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="rounded-xl border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                基本信息
              </h3>
              
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">用户名</Label>
                <div className="text-slate-900 dark:text-slate-100 font-medium">
                  {user.username}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">姓名</Label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">邮箱</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">联系电话</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl"
                    placeholder="手机号码"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.phone || "未设置"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">所在地</Label>
                {isEditing ? (
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl"
                    placeholder="城市"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.location || "未设置"}</div>
                )}
              </div>
            </div>

            {/* 教育背景 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                教育背景
              </h3>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">专业</Label>
                {isEditing ? (
                  <Select value={formData.major} onValueChange={(value) => setFormData({ ...formData, major: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="选择专业" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major.value} value={major.value}>
                          {major.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">
                    {majors.find(m => m.value === user.major)?.label || user.major || "未设置"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">学校</Label>
                {isEditing ? (
                  <Input
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="rounded-xl"
                    placeholder="学校名称"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.university || "未设置"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">毕业年份</Label>
                {isEditing ? (
                  <Select 
                    value={formData.graduationYear.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, graduationYear: parseInt(value) })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="选择年份" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}年
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.graduationYear}年</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">工作经验</Label>
                {isEditing ? (
                  <Select value={formData.workExperience} onValueChange={(value) => setFormData({ ...formData, workExperience: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="选择工作经验" />
                    </SelectTrigger>
                    <SelectContent>
                      {workExperienceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">
                    {workExperienceOptions.find(w => w.value === user.workExperience)?.label || user.workExperience || "未设置"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">目标职位</Label>
                {isEditing ? (
                  <Input
                    value={formData.targetPosition}
                    onChange={(e) => setFormData({ ...formData, targetPosition: e.target.value })}
                    className="rounded-xl"
                    placeholder="期望职位"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.targetPosition || "未设置"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">期望薪资</Label>
                {isEditing ? (
                  <Input
                    value={formData.targetSalary}
                    onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                    className="rounded-xl"
                    placeholder="期望薪资范围"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-slate-100">{user.targetSalary || "未设置"}</div>
                )}
              </div>
            </div>
          </div>

          {/* 技能标签 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              技能标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full">
                    {skill}
                  </Badge>
                ))
              ) : (
                <div className="text-slate-500 dark:text-slate-400">暂无技能标签</div>
              )}
            </div>
          </div>

          {/* 账户状态 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              账户状态
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-300">账户状态:</span>
                <Badge variant={user.isActive ? "default" : "destructive"} className="rounded-full">
                  {user.isActive ? "正常" : "已禁用"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-300">邮箱验证:</span>
                <Badge variant={user.emailVerified ? "default" : "secondary"} className="rounded-full">
                  {user.emailVerified ? "已验证" : "未验证"}
                </Badge>
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 dark:text-slate-300">最后登录:</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {new Date(user.lastLogin).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}