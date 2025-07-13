import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Clock, Star, Trash2, Plus, BookOpen, Building } from "lucide-react";

interface InterviewConfig {
  major: string;
  targetPosition: string;
  targetCompany: string;
  difficulty: string;
  category: string;
}

interface SavedConfig {
  id: number;
  name: string;
  config: InterviewConfig;
  usageCount: number;
  lastUsedAt: string;
}

interface InterviewConfigSelectorProps {
  onConfigSelect: (config: InterviewConfig) => void;
  initialConfig?: Partial<InterviewConfig>;
}

export default function InterviewConfigSelector({ onConfigSelect, initialConfig }: InterviewConfigSelectorProps) {
  const [currentConfig, setCurrentConfig] = useState<InterviewConfig>({
    major: initialConfig?.major || "",
    targetPosition: initialConfig?.targetPosition || "",
    targetCompany: initialConfig?.targetCompany || "",
    difficulty: initialConfig?.difficulty || "beginner",
    category: initialConfig?.category || "technical",
  });
  
  const [configName, setConfigName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch saved configurations
  const { data: savedConfigs = [] } = useQuery({
    queryKey: ["/api/user/preferences", "interview_config"],
    queryFn: () => apiRequest("/api/user/preferences/interview_config"),
  });

  // Save configuration mutation
  const saveConfigMutation = useMutation({
    mutationFn: (data: { type: string; name: string; config: InterviewConfig }) =>
      apiRequest("/api/user/preferences", "POST", data),
    onSuccess: () => {
      toast({
        title: "配置已保存",
        description: "面试配置已成功保存，下次可以快速选择",
      });
      setShowSaveForm(false);
      setConfigName("");
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences", "interview_config"] });
    },
    onError: () => {
      toast({
        title: "保存失败",
        description: "保存配置时出现错误，请重试",
        variant: "destructive",
      });
    },
  });

  // Use configuration mutation
  const useConfigMutation = useMutation({
    mutationFn: (data: { id: number; usageCount: number }) =>
      apiRequest(`/api/user/preferences/${data.id}/use`, "PUT", { usageCount: data.usageCount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences", "interview_config"] });
    },
  });

  // Delete configuration mutation
  const deleteConfigMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/user/preferences/${id}`, "DELETE"),
    onSuccess: () => {
      toast({
        title: "配置已删除",
        description: "面试配置已成功删除",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences", "interview_config"] });
    },
    onError: () => {
      toast({
        title: "删除失败",
        description: "删除配置时出现错误，请重试",
        variant: "destructive",
      });
    },
  });

  const handleSavedConfigSelect = (config: SavedConfig) => {
    setCurrentConfig(config.config);
    onConfigSelect(config.config);
    useConfigMutation.mutate({ id: config.id, usageCount: config.usageCount });
    toast({
      title: "配置已应用",
      description: `已应用配置 "${config.name}"`,
    });
  };

  const handleSaveConfig = () => {
    if (!configName.trim()) {
      toast({
        title: "请输入配置名称",
        description: "为了方便下次使用，请为此配置起一个名字",
        variant: "destructive",
      });
      return;
    }

    const configToSave = {
      type: "interview_config",
      name: configName.trim(),
      config: currentConfig,
    };

    saveConfigMutation.mutate(configToSave);
  };

  const handleConfigChange = (field: keyof InterviewConfig, value: string) => {
    const updatedConfig = { ...currentConfig, [field]: value };
    setCurrentConfig(updatedConfig);
    onConfigSelect(updatedConfig);
  };

  const handleDeleteConfig = (id: number) => {
    deleteConfigMutation.mutate(id);
  };

  const majors = [
    { value: "computer-science", label: "计算机科学与技术" },
    { value: "software-engineering", label: "软件工程" },
    { value: "information-security", label: "信息安全" },
    { value: "data-science", label: "数据科学与大数据技术" },
    { value: "artificial-intelligence", label: "人工智能" },
    { value: "other", label: "其他专业" },
  ];

  const positions = [
    { value: "frontend-developer", label: "前端开发工程师" },
    { value: "backend-developer", label: "后端开发工程师" },
    { value: "fullstack-developer", label: "全栈开发工程师" },
    { value: "mobile-developer", label: "移动端开发工程师" },
    { value: "data-engineer", label: "数据工程师" },
    { value: "ai-engineer", label: "算法工程师" },
    { value: "devops-engineer", label: "运维工程师" },
    { value: "product-manager", label: "产品经理" },
    { value: "other", label: "其他职位" },
  ];

  const companies = [
    "阿里巴巴", "腾讯", "百度", "字节跳动", "美团", "京东",
    "网易", "滴滴", "小米", "华为", "快手", "拼多多",
    "微软", "谷歌", "苹果", "亚马逊", "Facebook", "其他公司"
  ];

  return (
    <div className="space-y-6">
      {/* Saved Configurations */}
      {savedConfigs.length > 0 && (
        <Card className="apple-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              常用配置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedConfigs.map((config: SavedConfig) => (
              <div
                key={config.id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 apple-transition cursor-pointer"
                onClick={() => handleSavedConfigSelect(config)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">{config.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      使用 {config.usageCount} 次
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {majors.find(m => m.value === config.config.major)?.label || config.config.major}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {config.config.targetCompany}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConfig(config.id);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Current Configuration */}
      <Card className="apple-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">面试配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">专业背景</Label>
              <Select value={currentConfig.major} onValueChange={(value) => handleConfigChange("major", value)}>
                <SelectTrigger className="h-12 rounded-xl">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPosition">目标职位</Label>
              <Select value={currentConfig.targetPosition} onValueChange={(value) => handleConfigChange("targetPosition", value)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="选择职位" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCompany">目标公司</Label>
              <Select value={currentConfig.targetCompany} onValueChange={(value) => handleConfigChange("targetCompany", value)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="选择公司" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">难度等级</Label>
              <Select value={currentConfig.difficulty} onValueChange={(value) => handleConfigChange("difficulty", value)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="选择难度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">初级</SelectItem>
                  <SelectItem value="intermediate">中级</SelectItem>
                  <SelectItem value="advanced">高级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">面试类型</Label>
            <Select value={currentConfig.category} onValueChange={(value) => handleConfigChange("category", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">技术面试</SelectItem>
                <SelectItem value="behavioral">行为面试</SelectItem>
                <SelectItem value="case_study">案例分析</SelectItem>
                <SelectItem value="mixed">综合面试</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Save Configuration */}
          <div className="border-t pt-4">
            {!showSaveForm ? (
              <Button
                variant="outline"
                onClick={() => setShowSaveForm(true)}
                className="w-full h-12 rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                保存此配置
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="configName">配置名称</Label>
                  <Input
                    id="configName"
                    placeholder="例如：阿里巴巴前端面试"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveConfig}
                    disabled={saveConfigMutation.isPending}
                    className="flex-1 h-12 rounded-xl"
                  >
                    {saveConfigMutation.isPending ? "保存中..." : "保存"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSaveForm(false);
                      setConfigName("");
                    }}
                    className="h-12 rounded-xl"
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}