import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { mockDictionary } from '@/data/dictionaryData';
import { useDictionary } from '@/contexts/DictionaryContext';
import { supabase } from '@/lib/supabase';
import { Clock, X } from 'lucide-react';



interface QuizGameProps {
  gradeLevel: 'simple' | 'medium' | 'advanced';
  onClose: () => void;
  customWords?: string[];
  listId?: string;
  studentName?: string;
}


export function QuizGame({ gradeLevel, onClose, customWords, listId, studentName }: QuizGameProps) {
  const { trackQuizAttempt, currentStudent } = useDictionary();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());



  useEffect(() => {
    generateQuestions();
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [gradeLevel]);

  const generateQuestions = () => {
    const words = Object.values(mockDictionary);
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 5);
    
    const quizQuestions = shuffled.map(entry => {
      const definition = entry.definitions[0].levels[gradeLevel];
      const allWords = Object.keys(mockDictionary).filter(w => w !== entry.word);
      const wrongAnswers = allWords.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...wrongAnswers, entry.word].sort(() => Math.random() - 0.5);
      
      return { 
        word: entry.word, 
        definition, 
        options, 
        correctAnswer: entry.word,
        wordType: entry.definitions[0].type,
        difficulty: gradeLevel
      };
    });
    
    setQuestions(quizQuestions);
    setQuestionStartTime(Date.now());
  };


  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(score + 1);
    
    // Track performance analytics if student is logged in
    if (currentStudent) {
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      await supabase.functions.invoke('update-performance-analytics', {
        body: {
          studentId: currentStudent.id,
          wordType: questions[currentQuestion].wordType,
          difficultyLevel: questions[currentQuestion].difficulty,
          isCorrect,
          timeSeconds: timeSpent
        }
      });
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuestionStartTime(Date.now());
      } else {
        setIsComplete(true);
        trackQuizAttempt('vocabulary', questions.length, score, gradeLevel);
      }
    }, 2000);
  };



  const restart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeElapsed(0);
    setIsComplete(false);
    generateQuestions();
  };

  if (questions.length === 0) return null;

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
