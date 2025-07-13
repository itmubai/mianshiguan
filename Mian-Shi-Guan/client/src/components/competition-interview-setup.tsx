import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Brain, 
  Database, 
  Wifi, 
  Cog, 
  Code, 
  Package, 
  TestTube,
  Building,
  Users,
  Target,
  Clock,
  Mic,
  Video,
  Play
} from 'lucide-react';

interface CompetitionSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
}

interface InterviewConfig {
  domain: string;
  position: string;
  company: string;
  difficulty: string;
  questionCount: number;
  duration: number;
  multiModal: {
    voice: boolean;
    video: boolean;
    textAnalysis: boolean;
  };
  evaluationMode: string;
}

export default function CompetitionInterviewSetup({ onStartInterview }: CompetitionSetupProps) {
  const [config, setConfig] = useState<InterviewConfig>({
    domain: '',
    position: '',
    company: '',
    difficulty: 'medium',
    questionCount: 5,
    duration: 20,
    multiModal: {
      voice: true,
      video: true,
      textAnalysis: true
    },
    evaluationMode: 'comprehensive'
  });

  // 技术领域配置（符合赛题要求）
  const technicalDomains = [
    {
      id: 'artificial_intelligence',
      name: '人工智能',
      icon: Brain,
      description: 'AI、机器学习、深度学习技术',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      positions: ['AI工程师', '机器学习工程师', '深度学习研究员', '算法工程师', 'AI产品经理']
    },
    {
      id: 'big_data',
      name: '大数据',
      icon: Database,
      description: '大数据处理、分析、存储技术',
      color: 'bg-green-100 text-green-700 border-green-200',
      positions: ['大数据工程师', '数据分析师', '数据科学家', '数据架构师', 'BI工程师']
    },
    {
      id: 'iot',
      name: '物联网',
      icon: Wifi,
      description: '物联网系统、嵌入式开发',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      positions: ['物联网工程师', '嵌入式工程师', '硬件工程师', '系统集成工程师', '物联网产品经理']
    },
    {
      id: 'intelligent_systems',
      name: '智能系统',
      icon: Cog,
      description: '智能控制、自动化系统',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      positions: ['智能系统工程师', '控制工程师', '自动化工程师', '系统架构师', '智能产品经理']
    },
    {
      id: 'technical',
      name: '通用技术',
      icon: Code,
      description: '软件开发、系统架构',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      positions: ['软件工程师', '后端工程师', '前端工程师', '全栈工程师', '技术主管']
    },
    {
      id: 'product',
      name: '产品岗位',
      icon: Package,
      description: '产品设计、用户研究',
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      positions: ['产品经理', '产品设计师', '用户体验设计师', '产品运营', '产品总监']
    },
    {
      id: 'devops',
      name: '运维测试',
      icon: TestTube,
      description: 'DevOps、系统运维、测试',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      positions: ['运维工程师', 'DevOps工程师', '测试工程师', '质量保证工程师', '系统管理员']
    }
  ];

  // 目标企业类型
  const companyTypes = [
    { id: 'internet', name: '互联网公司', examples: '阿里巴巴、腾讯、字节跳动、美团' },
    { id: 'fintech', name: '金融科技', examples: '蚂蚁集团、京东数科、度小满、陆金所' },
    { id: 'ai_company', name: 'AI公司', examples: '百度、商汤、旷视、地平线' },
    { id: 'traditional_it', name: '传统IT', examples: '华为、中兴、浪潮、东软' },
    { id: 'startup', name: '创业公司', examples: '高成长性创新企业' },
    { id: 'government', name: '国企央企', examples: '中国移动、国家电网、中石油' }
  ];

  const selectedDomain = technicalDomains.find(d => d.id === config.domain);

  const handleStartInterview = () => {
    if (!config.domain || !config.position) {
      alert('请选择技术领域和目标岗位');
      return;
    }
    onStartInterview(config);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">
            多模态智能面试评测系统
          </CardTitle>
          <p className="text-blue-700">
            支持人工智能、大数据、物联网、智能系统等技术领域的专业面试训练
          </p>
        </CardHeader>
      </Card>

      {/* 技术领域选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            选择技术领域
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalDomains.map((domain) => {
              const IconComponent = domain.icon;
              return (
                <div
                  key={domain.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.domain === domain.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, domain: domain.id, position: '' }))}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${domain.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="font-medium">{domain.name}</div>
                  </div>
                  <p className="text-sm text-gray-600">{domain.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 岗位选择 */}
      {selectedDomain && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              选择目标岗位
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedDomain.positions.map((position) => (
                <Button
                  key={position}
                  variant={config.position === position ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setConfig(prev => ({ ...prev, position }))}
                >
                  {position}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 企业类型选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            目标企业类型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setConfig(prev => ({ ...prev, company: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="选择企业类型" />
            </SelectTrigger>
            <SelectContent>
              {companyTypes.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-xs text-gray-500">{company.examples}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 面试配置 */}
      <Card>
        <CardHeader>
          <CardTitle>面试参数设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 难度级别 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">面试难度</Label>
            <RadioGroup 
              value={config.difficulty} 
              onValueChange={(value) => setConfig(prev => ({ ...prev, difficulty: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy">入门级（应届生）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">中级（1-3年经验）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard">高级（3年以上经验）</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 题目数量 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              面试题目数量: {config.questionCount}
            </Label>
            <Slider
              value={[config.questionCount]}
              onValueChange={([value]) => setConfig(prev => ({ ...prev, questionCount: value }))}
              max={10}
              min={3}
              step={1}
            />
          </div>

          {/* 单题时长 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              单题建议时长: {config.duration}分钟
            </Label>
            <Slider
              value={[config.duration]}
              onValueChange={([value]) => setConfig(prev => ({ ...prev, duration: value }))}
              max={30}
              min={5}
              step={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* 多模态评测配置 */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Video className="w-5 h-5" />
            多模态评测设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">语音分析</div>
                  <div className="text-sm text-gray-500">语调、流畅度、语速</div>
                </div>
              </div>
              <Switch
                checked={config.multiModal.voice}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ 
                    ...prev, 
                    multiModal: { ...prev.multiModal, voice: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">视频分析</div>
                  <div className="text-sm text-gray-500">表情、姿态、眼神</div>
                </div>
              </div>
              <Switch
                checked={config.multiModal.video}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ 
                    ...prev, 
                    multiModal: { ...prev.multiModal, video: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">文本分析</div>
                  <div className="text-sm text-gray-500">内容、逻辑、专业度</div>
                </div>
              </div>
              <Switch
                checked={config.multiModal.textAnalysis}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ 
                    ...prev, 
                    multiModal: { ...prev.multiModal, textAnalysis: checked }
                  }))
                }
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <Label className="text-base font-medium mb-3 block">评测模式</Label>
            <RadioGroup 
              value={config.evaluationMode} 
              onValueChange={(value) => setConfig(prev => ({ ...prev, evaluationMode: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comprehensive" id="comprehensive" />
                <Label htmlFor="comprehensive">综合评测（五大核心能力完整分析）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="focused" id="focused" />
                <Label htmlFor="focused">专项评测（重点分析特定能力）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="competition" id="competition" />
                <Label htmlFor="competition">竞赛模式（软件杯标准评测）</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 配置总览 */}
      {config.domain && config.position && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">面试配置总览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="font-bold text-green-700">{selectedDomain?.name}</div>
                <div className="text-sm text-gray-600">技术领域</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="font-bold text-green-700">{config.position}</div>
                <div className="text-sm text-gray-600">目标岗位</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="font-bold text-green-700">{config.questionCount}题</div>
                <div className="text-sm text-gray-600">题目数量</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="font-bold text-green-700">{config.duration}分钟</div>
                <div className="text-sm text-gray-600">单题时长</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button 
                onClick={handleStartInterview}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                开始智能面试评测
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}