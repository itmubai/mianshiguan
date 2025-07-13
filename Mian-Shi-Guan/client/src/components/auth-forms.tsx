import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, UserPlus, LogIn, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function AuthForms() {
  const { login, register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  // 登录表单状态
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  // 注册表单状态
  const [registerData, setRegisterData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    major: "",
    university: "",
    graduationYear: new Date().getFullYear() + 1,
    phone: "",
    location: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginData.username || !loginData.password) {
      setError("请填写用户名和密码");
      return;
    }

    try {
      await login(loginData.username, loginData.password);
      setSuccess("登录成功！");
    } catch (error: any) {
      setError(error.message || "登录失败");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 基本验证
    if (!registerData.username || !registerData.name || !registerData.email || !registerData.password) {
      setError("请填写所有必填字段");
      return;
    }

    // 用户名必须为英文验证
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!usernameRegex.test(registerData.username)) {
      setError("用户名必须以英文字母开头，只能包含英文字母、数字和下划线");
      return;
    }

    if (registerData.username.length < 3 || registerData.username.length > 20) {
      setError("用户名长度必须在3-20个字符之间");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (registerData.password.length < 6) {
      setError("密码至少需要6个字符");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError("请输入有效的邮箱地址");
      return;
    }

    try {
      const { confirmPassword, ...submitData } = registerData;
      await register(submitData);
      setSuccess("注册成功！正在为您登录...");
    } catch (error: any) {
      if (error.message.includes("用户名已被注册") || error.message.includes("用户名已存在")) {
        setError("此用户名已被注册，请选择其他用户名");
      } else if (error.message.includes("邮箱已被注册")) {
        setError("此邮箱已被注册，请使用其他邮箱或尝试登录");
      } else {
        setError(error.message || "注册失败");
      }
    }
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

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* 苹果风格的卡片设计 */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl shadow-blue-500/10 rounded-3xl">
          <CardHeader className="text-center pb-8 pt-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              智能面试系统
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-400 mt-2">
              AI驱动的面试练习平台，提升求职竞争力
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* 演示账户提示 */}
            <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>演示账户：</strong> 用户名 demo，密码 demo123
              </AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
                <TabsTrigger 
                  value="login" 
                  className="flex items-center gap-2 h-12 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  登录
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="flex items-center gap-2 h-12 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  注册
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-6 rounded-xl border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-6 rounded-xl border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200 font-medium">{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-6 mt-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="loginUsername" className="text-slate-700 dark:text-slate-300 font-medium">
                      用户名
                    </Label>
                    <Input
                      id="loginUsername"
                      type="text"
                      placeholder="请输入用户名"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="h-14 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-base"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="loginPassword" className="text-slate-700 dark:text-slate-300 font-medium">
                      密码
                    </Label>
                    <div className="relative">
                      <Input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="请输入密码"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="h-14 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 text-base" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        登录中...
                      </div>
                    ) : (
                      "登录"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-6 mt-8">
                <Alert className="rounded-xl border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <strong>注册提示：</strong> 用户名必须使用英文字母开头，请使用真实信息注册以获得个性化面试体验
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                          用户名 <span className="text-red-500">*</span>
                        </Label>
                        <div className="text-xs text-slate-500 mb-1">(英文字母开头，3-20字符)</div>
                        <Input
                          id="username"
                          type="text"
                          placeholder="username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                          姓名 <span className="text-red-500">*</span>
                        </Label>
                        <div className="text-xs text-transparent mb-1">占位</div>
                        <Input
                          id="name"
                          type="text"
                          placeholder="真实姓名"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                        邮箱地址 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入邮箱地址"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                          密码 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="至少6个字符"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                          确认密码 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="再次输入密码"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="major" className="text-slate-700 dark:text-slate-300 font-medium text-sm">专业</Label>
                        <Select value={registerData.major} onValueChange={(value) => setRegisterData({ ...registerData, major: value })}>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                            <SelectValue placeholder="选择专业" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {majors.map((major) => (
                              <SelectItem key={major.value} value={major.value} className="rounded-lg">
                                {major.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="graduationYear" className="text-slate-700 dark:text-slate-300 font-medium text-sm">毕业年份</Label>
                        <Select 
                          value={registerData.graduationYear.toString()} 
                          onValueChange={(value) => setRegisterData({ ...registerData, graduationYear: parseInt(value) })}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                            <SelectValue placeholder="选择年份" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {graduationYears.map((year) => (
                              <SelectItem key={year} value={year.toString()} className="rounded-lg">
                                {year}年
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="university" className="text-slate-700 dark:text-slate-300 font-medium text-sm">学校</Label>
                        <Input
                          id="university"
                          type="text"
                          placeholder="学校名称"
                          value={registerData.university}
                          onChange={(e) => setRegisterData({ ...registerData, university: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-slate-700 dark:text-slate-300 font-medium text-sm">所在地</Label>
                        <Input
                          id="location"
                          type="text"
                          placeholder="城市"
                          value={registerData.location}
                          onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-medium text-sm">联系电话</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="手机号码"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200 text-base" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        注册中...
                      </div>
                    ) : (
                      "创建账户"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="text-center pb-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 mx-auto">
              注册即表示您同意我们的
              <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"> 服务条款 </span>
              和
              <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"> 隐私政策</span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}