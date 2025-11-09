import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { mockDictionary } from '@/data/dictionaryData';


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
  isFlagged?: boolean;
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
    
    const searchTerm = word.toLowerCase().trim();
    
    try {
      // Check if word is flagged
      const { data: flaggedData } = await supabase
        .from('flagged_words')
        .select('*')
        .eq('word', searchTerm)
        .single();

      const isFlagged = !!flaggedData;

      // First check mock dictionary for special words
      const mockEntry = mockDictionary[searchTerm];
      if (mockEntry && (mockEntry.isSound || mockEntry.isMadeUp || mockEntry.isNonEnglish)) {
        const def = mockEntry.definitions[0];
        setCurrentWord({
          word: mockEntry.word,
          type: def.partOfSpeech,
          pronunciation: mockEntry.pronunciation || '',
          definitions: def.levels,
          example: def.example || '',
          category: 'general',
          isSound: mockEntry.isSound,
          isMadeUp: mockEntry.isMadeUp,
          isNonEnglish: mockEntry.isNonEnglish,
          noVisual: mockEntry.noVisual,
          needsColor: mockEntry.needsColor,
          panelDescriptions: mockEntry.panelDescriptions,
          isMultiPanel: mockEntry.isMultiPanel,
          isFlagged
        });
        setSearchHistory(prev => [word, ...prev.filter(w => w !== word)].slice(0, 10));
        toast({
          title: "Word found!",
          description: `Definition for "${word}" loaded.`
        });
        return;
      }

      // Try Free Dictionary API + AI generation
      const { data, error } = await supabase.functions.invoke('fetch-dictionary-definition', {
        body: { word: searchTerm }
      });

      if (error) throw error;

      if (data) {
        setCurrentWord({
          word: data.word,
          type: data.partOfSpeech,
          pronunciation: data.phonetic,
          definitions: data.definitions,
          example: data.example,
          category: 'general',
          isFlagged
        });
        setSearchHistory(prev => [word, ...prev.filter(w => w !== word)].slice(0, 10));
        
        toast({
          title: "Word found!",
          description: `Definition for "${word}" loaded.`
        });
      }
    } catch (error) {
      console.error('Dictionary error:', error);
      toast({
        title: "Word not found",
        description: "Could not find a definition for this word.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [gradeLevel]);






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