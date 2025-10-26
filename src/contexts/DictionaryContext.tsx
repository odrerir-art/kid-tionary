import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface Definition {
  simple: string;
  medium: string;
  advanced: string;
}

interface WordData {
  word: string;
  type: string;
  pronunciation: string;
  definitions: Definition;
  example: string;
  category: string;
  isSound?: boolean;
  isMadeUp?: boolean;
  isNonEnglish?: boolean;
  noVisual?: boolean;
  needsColor?: boolean;
  panelDescriptions?: string[];
  isMultiPanel?: boolean;
}




interface DictionaryContextType {
  currentWord: WordData | null;
  gradeLevel: string;
  searchHistory: string[];
  favorites: string[];
  isLoading: boolean;
  pictureMode: boolean;
  currentStudent: any;
  studentProfile: any;
  setGradeLevel: (level: string) => void;
  searchWord: (word: string) => Promise<void>;
  addToFavorites: (word: string) => void;
  removeFromFavorites: (word: string) => void;
  clearHistory: () => void;
  togglePictureMode: () => void;
  setCurrentStudent: (user: any, profile: any) => void;
  logoutStudent: () => void;
  trackWordSearch: (word: string, timeSpent: number) => Promise<void>;
  trackQuizAttempt: (quizType: string, totalQuestions: number, correctAnswers: number, difficultyLevel: string) => Promise<void>;
}




const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) throw new Error('useDictionary must be used within DictionaryProvider');
  return context;
};

export const DictionaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [gradeLevel, setGradeLevel] = useState('1');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pictureMode, setPictureMode] = useState(false);
  const [currentStudent, setCurrentStudentState] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [wordSearchStartTime, setWordSearchStartTime] = useState<number | null>(null);


  const setCurrentStudent = (user: any, profile: any) => {
    setCurrentStudentState(user);
    setStudentProfile(profile);
    toast({ title: `Welcome, ${user.full_name}!`, description: "Ready to learn new words!" });
  };

  const logoutStudent = () => {
    setCurrentStudentState(null);
    setStudentProfile(null);
    toast({ title: "Logged out", description: "See you next time!" });
  };

  const trackWordSearch = async (word: string, timeSpent: number) => {
    if (!currentStudent) return;
    
    try {
      await supabase.functions.invoke('track-word-search', {
        body: { studentId: currentStudent.id, word, timeSpent }
      });
    } catch (error) {
      console.error('Error tracking word search:', error);
    }
  };

  const trackQuizAttempt = async (quizType: string, totalQuestions: number, correctAnswers: number, difficultyLevel: string) => {
    if (!currentStudent) return;
    
    try {
      await supabase.functions.invoke('track-quiz-attempt', {
        body: { studentId: currentStudent.id, quizType, totalQuestions, correctAnswers, difficultyLevel }
      });
    } catch (error) {
      console.error('Error tracking quiz attempt:', error);
    }
  };

  const searchWord = useCallback(async (word: string) => {
    if (!word.trim()) return;
    
    setWordSearchStartTime(Date.now());
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-definition', {
        body: { word: word.toLowerCase().trim(), gradeLevel }
      });

      if (error) throw error;

      setCurrentWord(data);
      setSearchHistory(prev => [word, ...prev.filter(w => w !== word)].slice(0, 10));
      
      // Track word search if student is logged in
      if (currentStudent && wordSearchStartTime) {
        const timeSpent = Math.floor((Date.now() - wordSearchStartTime) / 1000);
        await trackWordSearch(word, timeSpent);
      }
      
      toast({
        title: "Word found!",
        description: `Definition for "${word}" loaded successfully.`
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Oops!",
        description: "Couldn't find that word. Try checking your spelling!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [gradeLevel, currentStudent, wordSearchStartTime]);


  const addToFavorites = (word: string) => {
    setFavorites(prev => [...new Set([...prev, word])]);
    toast({ title: "Added to favorites!", description: `"${word}" saved.` });
  };

  const removeFromFavorites = (word: string) => {
    setFavorites(prev => prev.filter(w => w !== word));
  };

  const clearHistory = () => setSearchHistory([]);

  const togglePictureMode = () => {
    setPictureMode(prev => !prev);
    toast({ 
      title: pictureMode ? "Picture mode off" : "Picture mode on!", 
      description: pictureMode ? "Pictures hidden" : "Pictures will show with definitions" 
    });
  };



  return (
    <DictionaryContext.Provider value={{
      currentWord, gradeLevel, searchHistory, favorites, isLoading, pictureMode,
      currentStudent, studentProfile,
      setGradeLevel, searchWord, addToFavorites, removeFromFavorites, clearHistory, togglePictureMode,
      setCurrentStudent, logoutStudent, trackWordSearch, trackQuizAttempt
    }}>

      {children}
    </DictionaryContext.Provider>
  );
};