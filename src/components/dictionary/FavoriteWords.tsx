import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import PronunciationButton from './PronunciationButton';


interface FavoriteWordsProps {
  favorites: string[];
  onSelectWord: (word: string) => void;
  onRemoveFavorite: (word: string) => void;
}

const FavoriteWords: React.FC<FavoriteWordsProps> = ({ 
  favorites, 
  onSelectWord, 
  onRemoveFavorite 
}) => {
  if (favorites.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-lg border-2 border-pink-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="text-pink-600 fill-pink-600" size={24} />
        <h3 className="text-lg font-bold text-gray-800">My Favorite Words</h3>
        <span className="ml-auto bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
          {favorites.length}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {favorites.map((word) => (
          <div
            key={word}
            className="bg-white rounded-xl p-3 border-2 border-pink-200 hover:border-pink-400 transition-colors group"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                onClick={() => onSelectWord(word)}
                className="flex-1 text-left font-semibold text-gray-800 hover:text-pink-600"
              >
                {word}
              </button>
              <PronunciationButton word={word} variant="compact" size={16} />
            </div>
            <button
              onClick={() => onRemoveFavorite(word)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={12} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>

  );
};

export default FavoriteWords;
