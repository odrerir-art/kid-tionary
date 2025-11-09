import React, { useState } from 'react';
import { BookOpen, GraduationCap, HelpCircle, Trophy, ListChecks, Users, UserCircle, Brain, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDictionary } from '@/contexts/DictionaryContext';

import GradeLevelSelector from './dictionary/GradeLevelSelector';
import SearchBar from './dictionary/SearchBar';
import SearchHistory from './dictionary/SearchHistory';
import WordResult from './dictionary/WordResult';
import EmptyState from './dictionary/EmptyState';
import NotFoundState from './dictionary/NotFoundState';
import { TeacherDashboard } from './dictionary/TeacherDashboard';
import HelpSection from './dictionary/HelpSection';
import WordTypeExamples from './dictionary/WordTypeExamples';
import FavoriteWords from './dictionary/FavoriteWords';
import { QuizGame } from './dictionary/QuizGame';
import { WordListManager } from './dictionary/WordListManager';
import { StudentWordLists } from './dictionary/StudentWordLists';
import { CustomQuizGame } from './dictionary/CustomQuizGame';
import { StudentLogin } from './dictionary/StudentLogin';
import { ParentPortal } from './dictionary/ParentPortal';
import { AchievementBadges } from './dictionary/AchievementBadges';
import { PersonalizedLearningPath } from './dictionary/PersonalizedLearningPath';




const AppLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { 
    currentWord, gradeLevel, searchHistory, favorites, isLoading, pictureMode,
    currentStudent, setCurrentStudent, logoutStudent,
    setGradeLevel, searchWord, addToFavorites, removeFromFavorites, clearHistory, togglePictureMode
  } = useDictionary();


  
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [searchedWord, setSearchedWord] = useState('');
  const [viewMode, setViewMode] = useState<'dictionary' | 'teacher-lists' | 'student-lists' | 'teacher-dashboard' | 'parent-portal' | 'student-login' | 'learning-path'>('dictionary');

  const [customQuizData, setCustomQuizData] = useState<{ listId: string; words: string[] } | null>(null);
  const [studentName, setStudentName] = useState('');



  const handleSearch = async (word: string) => {
    setSearchedWord(word);
    await searchWord(word);
  };

  const toggleFavorite = () => {
    if (currentWord) {
      if (favorites.includes(currentWord.word)) {
        removeFromFavorites(currentWord.word);
      } else {
        addToFavorites(currentWord.word);
      }
    }
  };

  const handleStartCustomQuiz = (listId: string, words: string[]) => {
    setCustomQuizData({ listId, words });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://d64gsuwffb70l.cloudfront.net/68e24805acad960e72719ec8_1759663489374_1492f333.webp" alt="Seven diverse children learning together" className="w-full h-full object-cover" />
        </div>
         <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {/* Show Home button only when not in dictionary view */}
              {viewMode !== 'dictionary' && (
                <button onClick={() => { setViewMode('dictionary'); setCustomQuizData(null); }} className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg transition-colors hover:bg-white/90">
                  <BookOpen size={20} />
                  <span className="text-sm font-semibold">Home</span>
                </button>
              )}
              {viewMode === 'dictionary' && (
                <>
                  <button onClick={() => setShowQuiz(!showQuiz)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors">
                    <Trophy size={20} />
                    <span className="text-sm font-semibold">Quiz</span>
                  </button>
                  <button onClick={() => setShowHelp(!showHelp)} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <HelpCircle size={20} />
                    <span className="text-sm font-semibold">Help</span>
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2 items-center">
              {user && profile && (
                <>
                  <span className="text-sm bg-white/20 px-3 py-2 rounded-lg">
                    {profile.username} ({profile.role})
                  </span>
                  {profile.role === 'admin' && (
                    <button onClick={() => navigate('/admin')} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
                      <Shield size={20} />
                      <span className="text-sm font-semibold">Admin</span>
                    </button>
                  )}
                  <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                    <LogOut size={20} />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </>
              )}
              {!user && (
                <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-white/90 text-purple-600 rounded-lg transition-colors">
                  <UserCircle size={20} />
                  <span className="text-sm font-semibold">Login</span>
                </button>
              )}
            </div>


          </div>

          {viewMode === 'dictionary' && (

            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4"><BookOpen size={64} className="animate-bounce" /></div>
                <h1 className="text-5xl sm:text-6xl font-bold mb-4 drop-shadow-lg">kid-tionary</h1>

                <p className="text-xl sm:text-2xl opacity-95 mb-6">Learn new words with definitions you can understand!</p>
                
                {/* Quick Access Buttons */}
                <div className="flex justify-center gap-3 mb-8 flex-wrap">
                  <button onClick={() => setViewMode('teacher-lists')} className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-purple-600 rounded-lg transition-colors shadow-md">
                    <GraduationCap size={20} />
                    <span className="text-sm font-semibold">Teacher Lists</span>
                  </button>
                  <button onClick={() => setViewMode('student-lists')} className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-purple-600 rounded-lg transition-colors shadow-md">
                    <ListChecks size={20} />
                    <span className="text-sm font-semibold">Student Practice</span>
                  </button>
                  <button onClick={() => setViewMode('teacher-dashboard')} className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-purple-600 rounded-lg transition-colors shadow-md">
                    <Users size={20} />
                    <span className="text-sm font-semibold">Teacher Portal</span>
                  </button>
                  {currentStudent ? (
                    <>
                      <button onClick={() => setViewMode('learning-path')} className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-purple-600 rounded-lg transition-colors shadow-md">
                        <Brain size={20} />
                        <span className="text-sm font-semibold">My Learning Path</span>
                      </button>
                      <button onClick={logoutStudent} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-md">
                        <UserCircle size={20} />
                        <span className="text-sm font-semibold">Student Logout</span>
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setViewMode('student-login')} className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-purple-600 rounded-lg transition-colors shadow-md">
                      <UserCircle size={20} />
                      <span className="text-sm font-semibold">Student Login</span>
                    </button>
                  )}
                  <button onClick={() => setViewMode('parent-portal')} className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-purple-600 rounded-lg transition-colors shadow-md">
                    <Users size={20} />
                    <span className="text-sm font-semibold">Parent Portal</span>
                  </button>
                </div>
              </div>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </>
          )}

          {viewMode === 'teacher-lists' && (
            <div className="text-center mb-8">
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 drop-shadow-lg">Teacher Word Lists</h1>
              <p className="text-xl sm:text-2xl opacity-95">Create and manage custom word lists for your students</p>
            </div>
          )}
          {viewMode === 'student-lists' && (
            <div className="text-center mb-8">
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 drop-shadow-lg">Practice Word Lists</h1>
              <p className="text-xl sm:text-2xl opacity-95 mb-4">Join and practice your teacher's word lists</p>
              {!studentName && (
                <div className="max-w-md mx-auto">
                  <input 
                    type="text" 
                    placeholder="Enter your name to get started" 
                    className="w-full px-6 py-3 rounded-lg text-gray-800 text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && setStudentName((e.target as HTMLInputElement).value)}
                  />
                </div>
              )}
            </div>
          )}
          {viewMode === 'learning-path' && currentStudent && (
            <div className="text-center mb-8">
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 drop-shadow-lg">My Learning Path</h1>
              <p className="text-xl sm:text-2xl opacity-95">AI-powered personalized vocabulary recommendations</p>
            </div>
          )}
        </div>



      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {viewMode === 'dictionary' && (
          <>
            <div className="mb-8 flex justify-center gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <GradeLevelSelector selectedGrade={gradeLevel} onGradeChange={setGradeLevel} />
              </div>
              <button
                onClick={togglePictureMode}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg font-bold text-lg transition-all hover:scale-105 ${
                  pictureMode 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white text-gray-700 border-2 border-gray-300'
                }`}
              >
                <span className="text-2xl">🐱</span>
                <span>cat</span>
              </button>
            </div>

            {showQuiz && (
              <div className="mb-8">
                <QuizGame gradeLevel={gradeLevel} onClose={() => setShowQuiz(false)} />
              </div>
            )}
            {showHelp && <div className="mb-8"><HelpSection /></div>}
            {showTeacherDashboard && <div className="mb-8"><TeacherDashboard searchHistory={searchHistory} /></div>}

            {favorites.length > 0 && (
              <div className="mb-8">
                <FavoriteWords favorites={favorites} onSelectWord={handleSearch} onRemoveFavorite={removeFromFavorites} />
              </div>
            )}
            {searchHistory.length > 0 && <div className="mb-8"><SearchHistory history={searchHistory} onSelectWord={handleSearch} onClearHistory={clearHistory} /></div>}
            <div className="mb-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-xl text-gray-600">Finding the perfect definition...</p>
                </div>
              ) : currentWord ? (
                <WordResult 
                  wordEntry={currentWord} 
                  gradeLevel={gradeLevel}
                  isFavorite={favorites.includes(currentWord.word)}
                  onToggleFavorite={toggleFavorite}
                  pictureMode={pictureMode}
                />

              ) : searchedWord ? (
                <NotFoundState word={searchedWord} />
              ) : (
                <EmptyState onExampleClick={handleSearch} />
              )}
            </div>
            {!currentWord && !searchedWord && <div className="mb-8"><WordTypeExamples onWordClick={handleSearch} /></div>}
          </>
        )}

        {viewMode === 'teacher-lists' && (
          <div className="mb-8">
            <WordListManager />
          </div>
        )}

        {viewMode === 'student-lists' && studentName && (
          <div className="mb-8">
            {customQuizData ? (
              <CustomQuizGame
                words={customQuizData.words}
                listId={customQuizData.listId}
                studentName={studentName}
                gradeLevel={gradeLevel}
                onClose={() => setCustomQuizData(null)}
              />
            ) : (
              <StudentWordLists
                studentName={studentName}
                onStartQuiz={handleStartCustomQuiz}
              />
            )}
          </div>
        )}




        {viewMode === 'teacher-dashboard' && (
          <div className="mb-8">
            <TeacherDashboard />
          </div>
        )}

        {viewMode === 'student-login' && (
          <div className="mb-8">
            <StudentLogin onLogin={(user, profile) => {
              setCurrentStudent(user, profile);
              setViewMode('dictionary');
            }} />
          </div>
        )}

        {viewMode === 'parent-portal' && (
          <div className="mb-8">
            <ParentPortal />
          </div>
        )}
        {viewMode === 'learning-path' && currentStudent && (
          <div className="mb-8">
            <PersonalizedLearningPath studentId={currentStudent.id} />
          </div>
        )}

        {currentStudent && viewMode === 'dictionary' && (
          <div className="mb-8">
            <AchievementBadges studentId={currentStudent.id} />
          </div>
        )}

      </div>


      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
          <BookOpen size={40} className="mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-2">kid-tionary</h3>

          <p className="text-blue-100 mb-4">Making vocabulary accessible for young learners everywhere</p>
          <p className="text-sm text-blue-200">Powered by AI • Designed for elementary students</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;