import React from 'react';
import { History, X } from 'lucide-react';
import PronunciationButton from './PronunciationButton';


interface SearchHistoryProps {
  history: string[];
  onSelectWord: (word: string) => void;
  onClearHistory: () => void;
}

const colors = [
  'from-pink-400 to-rose-500',
  'from-blue-400 to-cyan-500',
  'from-green-400 to-emerald-500',
  'from-yellow-400 to-amber-500',
  'from-purple-400 to-violet-500',
  'from-red-400 to-orange-500',
];

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelectWord, onClearHistory }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="text-blue-600" size={24} />
          <h3 className="text-lg font-bold text-gray-800">Recent Words</h3>
        </div>
        <button
          onClick={onClearHistory}
          className="text-gray-500 hover:text-red-500 transition-colors"
          title="Clear history"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((word, index) => (
          <div key={`${word}-${index}`} className="flex items-center gap-1">
            <button
              onClick={() => onSelectWord(word)}
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${
                colors[index % colors.length]
              } text-white font-semibold hover:scale-110 transition-transform shadow-md`}
            >
              {word}
            </button>
            <PronunciationButton word={word} variant="compact" size={14} className="bg-gray-100 text-gray-700" />
          </div>
        ))}
      </div>
    </div>

  );
};

export default SearchHistory;
