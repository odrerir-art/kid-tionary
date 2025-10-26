import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onExampleClick: (word: string) => void;
}

const exampleWords = ['happy', 'run', 'apple', 'dog', 'jump', 'friend', 'book', 'play'];

const EmptyState: React.FC<EmptyStateProps> = ({ onExampleClick }) => {
  return (
    <div className="text-center py-12">
      <div className="mb-6 flex justify-center">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-full">
          <BookOpen size={64} className="text-blue-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        Ready to Learn New Words!
      </h3>
      <p className="text-lg text-gray-600 mb-6">
        Type any word above to see simple definitions
      </p>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="text-yellow-500" size={20} />
        <span className="text-gray-700 font-semibold">Try these words:</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {exampleWords.map((word) => (
          <button
            key={word}
            onClick={() => onExampleClick(word)}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-bold text-lg hover:scale-110 transition-transform shadow-lg"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
