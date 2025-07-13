import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  Mic, 
  Brain, 
  Eye, 
  Clock,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { getScoreColor, getScoreLevel } from "@/lib/utils";

interface EvaluationData {
  overallScore: number;
  speechScore: number;
  contentScore: number;
  confidenceScore: number;
  bodyLanguageScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  nextRecommendations: string[];
}

interface EvaluationResultsProps {
  evaluation: EvaluationData;
  onRetry: () => void;
  onContinue: () => void;
}

export default function EvaluationResults({ 
  evaluation, 
  onRetry, 
  onContinue 
}: EvaluationResultsProps) {
  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-green-500 to-green-400";
    if (score >= 80) return "from-blue-500 to-blue-400";
    if (score >= 70) return "from-orange-500 to-orange-400";
    return "from-red-500 to-red-400";
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return "优秀表现，已超过90%的用户";
    if (score >= 80) return "良好表现，已超过78%的用户";
    if (score >= 70) return "中等表现，还有提升空间";
    return "需要更多练习，建议重点改进";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Overall Score */}
      <Card className="shadow-lg border border-slate-200">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r ${getScoreGradient(evaluation.overallScore)} rounded-full mb-4`}>
              <span className="text-4xl font-bold text-white">{evaluation.overallScore}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">综合评分</h3>
            <p className="text-slate-600">{getPerformanceMessage(evaluation.overallScore)}</p>
            <Badge className={`mt-2 ${getScoreColor(evaluation.overallScore)} bg-opacity-10`}>
              {getScoreLevel(evaluation.overallScore)}
            </Badge>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mic className="text-primary text-xl" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">语音表达</h4>
              <p className={`text-2xl font-bold ${getScoreColor(evaluation.speechScore)}`}>
                {evaluation.speechScore}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="text-green-600 text-xl" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">内容质量</h4>
              <p className={`text-2xl font-bold ${getScoreColor(evaluation.contentScore)}`}>
                {evaluation.contentScore}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="text-purple-600 text-xl" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">体态表现</h4>
              <p className={`text-2xl font-bold ${getScoreColor(evaluation.bodyLanguageScore)}`}>
                {evaluation.bodyLanguageScore}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="text-orange-500 text-xl" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">信心指数</h4>
              <p className={`text-2xl font-bold ${getScoreColor(evaluation.confidenceScore)}`}>
                {evaluation.confidenceScore}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <Card className="shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600 w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">表现优秀</h3>
            </div>
            <div className="space-y-3">
              {evaluation.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{strength}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-orange-500 w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">改进建议</h3>
            </div>
            <div className="space-y-3">
              {evaluation.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{improvement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed AI Feedback */}
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">AI详细反馈</h3>
          <p className="text-slate-700 leading-relaxed">
            {evaluation.detailedFeedback}
          </p>
        </CardContent>
      </Card>

      {/* AI Generated Improvement Plan */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">AI定制学习计划</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluation.nextRecommendations.map((recommendation, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">推荐 {index + 1}</h4>
                <p className="text-sm opacity-90">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onRetry}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>重新练习这道题</span>
        </Button>
        
        <Button 
          onClick={onContinue}
          size="lg"
          className="flex items-center space-x-2"
        >
          <TrendingUp className="w-5 h-5" />
          <span>继续下一题</span>
        </Button>
      </div>
    </div>
  );
}
