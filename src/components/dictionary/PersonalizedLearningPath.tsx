import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Target, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface LearningPathItem {
  id: string;
  word: string;
  reason: string;
  priority: number;
  word_type: string;
  difficulty_level: string;
  completed_at: string | null;
}

interface PerformanceData {
  word_type: string;
  difficulty_level: string;
  total_attempts: number;
  correct_attempts: number;
  average_time_seconds: number;
}

export function PersonalizedLearningPath({ studentId }: { studentId: string }) {
  const [learningPath, setLearningPath] = useState<LearningPathItem[]>([]);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadLearningPath();
    loadPerformance();
  }, [studentId]);

  const loadLearningPath = async () => {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('student_id', studentId)
      .is('completed_at', null)
      .order('priority', { ascending: true })
      .limit(10);

    if (!error && data) {
      setLearningPath(data);
    }
  };

  const loadPerformance = async () => {
    const { data, error } = await supabase
      .from('performance_analytics')
      .select('*')
      .eq('student_id', studentId);

    if (!error && data) {
      setPerformance(data);
    }
  };

  const generateRecommendations = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-student-performance', {
        body: { studentId }
      });

      if (error) throw error;
      toast.success('Learning path updated with personalized recommendations!');
      loadLearningPath();
    } catch (error) {
      toast.error('Failed to generate recommendations');
    } finally {
      setAnalyzing(false);
    }
  };

  const markCompleted = async (pathId: string) => {
    const { error } = await supabase
      .from('learning_paths')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', pathId);

    if (!error) {
      toast.success('Word marked as practiced!');
      loadLearningPath();
    }
  };

  const getSuccessRate = (wordType: string, difficulty: string) => {
    const perf = performance.find(p => p.word_type === wordType && p.difficulty_level === difficulty);
    if (!perf || perf.total_attempts === 0) return 0;
    return Math.round((perf.correct_attempts / perf.total_attempts) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Personalized Learning Path
              </CardTitle>
              <CardDescription>AI-powered recommendations based on your progress</CardDescription>
            </div>
            <Button onClick={generateRecommendations} disabled={analyzing}>
              <Sparkles className="h-4 w-4 mr-2" />
              {analyzing ? 'Analyzing...' : 'Generate New Path'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {learningPath.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No learning path yet. Click "Generate New Path" to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {learningPath.map((item, index) => (
                <Card key={item.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={item.priority === 1 ? 'destructive' : 'secondary'}>
                            Priority {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.word_type}</Badge>
                          <Badge variant="outline">{item.difficulty_level}</Badge>
                        </div>
                        <h4 className="font-bold text-lg">{item.word}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.reason}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          Success rate: {getSuccessRate(item.word_type, item.difficulty_level)}%
                        </div>
                      </div>
                      <Button size="sm" onClick={() => markCompleted(item.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Performance by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performance.map((perf) => {
              const successRate = perf.total_attempts > 0 
                ? (perf.correct_attempts / perf.total_attempts) * 100 
                : 0;
              return (
                <div key={`${perf.word_type}-${perf.difficulty_level}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      {perf.word_type} - {perf.difficulty_level}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {perf.correct_attempts}/{perf.total_attempts} correct
                    </span>
                  </div>
                  <Progress value={successRate} className="h-2" />
                </div>
              );
            })}
            {performance.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Complete some quizzes to see your performance analytics!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
