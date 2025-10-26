import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { Clock, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CustomQuizGameProps {
  words: string[];
  listId: string;
  studentName: string;
  gradeLevel: 'simple' | 'medium' | 'advanced';
  onClose: () => void;
}

export function CustomQuizGame({ words, listId, studentName, gradeLevel, onClose }: CustomQuizGameProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);

  useEffect(() => {
    generateQuestions();
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const generateQuestions = async () => {
    const quizQuestions = [];
    
    for (const word of words) {
      const { data } = await supabase.functions.invoke('generate-definition', {
        body: { word, gradeLevel }
      });
      
      if (data?.definition) {
        const wrongAnswers = words.filter(w => w !== word).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [...wrongAnswers, word].sort(() => Math.random() - 0.5);
        quizQuestions.push({ word, definition: data.definition, options, correctAnswer: word });
      }
    }
    
    setQuestions(quizQuestions);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      setMasteredWords([...masteredWords, questions[currentQuestion].word]);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        saveProgress();
        setIsComplete(true);
      }
    }, 2000);
  };

  const saveProgress = async () => {
    const { data: existing } = await supabase
      .from('student_progress')
      .select('*')
      .eq('list_id', listId)
      .eq('student_name', studentName)
      .single();

    const quizScore = { score, total: questions.length, date: new Date().toISOString() };
    const allMastered = existing?.words_mastered || [];
    const newMastered = [...new Set([...allMastered, ...masteredWords])];

    if (existing) {
      await supabase.from('student_progress').update({
        words_mastered: newMastered,
        quiz_scores: [...(existing.quiz_scores || []), quizScore],
        last_practiced: new Date().toISOString()
      }).eq('id', existing.id);
    } else {
      await supabase.from('student_progress').insert({
        list_id: listId,
        student_name: studentName,
        words_mastered: newMastered,
        quiz_scores: [quizScore],
        last_practiced: new Date().toISOString()
      });
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeElapsed(0);
    setIsComplete(false);
    setMasteredWords([]);
    generateQuestions();
  };

  if (questions.length === 0) return <div className="text-center p-8">Loading quiz...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Clock className="h-5 w-5" />
          <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
      </Card>

      {!isComplete ? (
        <>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
          <QuizQuestion
            {...questions[currentQuestion]}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
          />
        </>
      ) : (
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          timeElapsed={timeElapsed}
          onRestart={restart}
          onExit={onClose}
        />
      )}
    </div>
  );
}
