import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  word: string;
  definition: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizQuestion({
  word,
  definition,
  options,
  correctAnswer,
  onAnswer,
  selectedAnswer,
  showResult,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-center">
          What does "{word}" mean?
        </h3>
        
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <Button
                key={index}
                onClick={() => !showResult && onAnswer(option)}
                disabled={showResult}
                variant={showCorrect ? 'default' : showIncorrect ? 'destructive' : 'outline'}
                className={`w-full justify-start text-left h-auto py-4 px-6 ${
                  showCorrect ? 'bg-green-500 hover:bg-green-600 animate-pulse' : ''
                } ${showIncorrect ? 'bg-red-500' : ''}`}
              >
                <span className="flex-1">{option}</span>
                {showCorrect && <CheckCircle2 className="ml-2 h-5 w-5" />}
                {showIncorrect && <XCircle className="ml-2 h-5 w-5" />}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
