import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { BookOpen, Trophy, Clock, Target } from 'lucide-react';

interface StudentProgressProps {
  studentId: string;
  studentName: string;
}

export function StudentProgress({ studentId, studentName }: StudentProgressProps) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [studentId]);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('get-student-progress', {
        body: { studentId }
      });

      if (data?.success) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading progress...</div>;
  if (!progress) return <div className="p-8 text-center">No progress data available</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{studentName}'s Progress</h2>
        <p className="text-muted-foreground">Track learning achievements and vocabulary growth</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Words Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progress.wordsSearched}</div>
            <p className="text-xs text-muted-foreground">{progress.totalSearches} total searches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Quiz Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progress.averageQuizScore}%</div>
            <p className="text-xs text-muted-foreground">{progress.quizzesCompleted} quizzes completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progress.timeSpentMinutes}</div>
            <p className="text-xs text-muted-foreground">minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progress.achievements.length}</div>
            <p className="text-xs text-muted-foreground">badges earned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {progress.achievements.map((sa: any) => (
              <Badge key={sa.id} variant="secondary" className="text-lg px-4 py-2">
                {sa.achievement.badge_icon} {sa.achievement.name}
              </Badge>
            ))}
            {progress.achievements.length === 0 && (
              <p className="text-muted-foreground">No badges earned yet. Keep learning!</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Recent Word Searches</h4>
            <div className="space-y-1">
              {progress.recentSearches.slice(0, 5).map((search: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="font-medium">{search.word}</span>
                  <span className="text-muted-foreground">
                    {new Date(search.searched_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Recent Quiz Scores</h4>
            <div className="space-y-2">
              {progress.recentQuizzes.map((quiz: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{quiz.quiz_type}</span>
                    <span className="font-semibold">{Math.round(quiz.score_percentage)}%</span>
                  </div>
                  <Progress value={quiz.score_percentage} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
