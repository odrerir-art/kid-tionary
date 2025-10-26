import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  onRestart: () => void;
  onExit: () => void;
}

export function QuizResults({ score, totalQuestions, timeElapsed, onRestart, onExit }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent Work! ⭐";
    if (percentage >= 60) return "Good Job! 👍";
    return "Keep Practicing! 💪";
  };

  return (
    <Card className="p-8 space-y-6 text-center">
      <div className="animate-bounce">
        <Trophy className="h-20 w-20 mx-auto text-yellow-500" />
      </div>
      
      <h2 className="text-3xl font-bold">{getMessage()}</h2>
      
      <div className="space-y-4">
        <div className="text-6xl font-bold text-primary animate-pulse">
          {score}/{totalQuestions}
        </div>
        <p className="text-xl text-muted-foreground">
          {percentage}% Correct
        </p>
        <p className="text-sm text-muted-foreground">
          Time: {minutes}:{seconds.toString().padStart(2, '0')}
        </p>
      </div>

      <div className="flex gap-4 justify-center pt-4">
        <Button onClick={onRestart} size="lg" className="gap-2">
          <RotateCcw className="h-5 w-5" />
          Try Again
        </Button>
        <Button onClick={onExit} variant="outline" size="lg">
          Exit Quiz
        </Button>
      </div>
    </Card>
  );
}
