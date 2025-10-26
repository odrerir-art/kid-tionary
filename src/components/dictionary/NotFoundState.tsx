import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NotFoundStateProps {
  word: string;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ word }) => {
  return (
    <div className="bg-orange-50 border-4 border-orange-300 rounded-2xl p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-orange-200 p-6 rounded-full">
          <AlertTriangle size={48} className="text-orange-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        Word Not Found
      </h3>
      <p className="text-lg text-gray-700 mb-2">
        We couldn't find "<span className="font-bold text-orange-600">{word}</span>" in our dictionary.
      </p>
      <div className="mt-6 bg-white rounded-xl p-4 border-2 border-orange-200">
        <p className="text-gray-700 font-semibold mb-2">This might be:</p>
        <ul className="text-left text-gray-600 space-y-1 max-w-md mx-auto">
          <li>• A made-up word (like from Dr. Seuss!)</li>
          <li>• A sound word (like "boom" or "splash")</li>
          <li>• A word from another language</li>
          <li>• A misspelling - check the suggestion above</li>
        </ul>
      </div>
    </div>
  );
};

export default NotFoundState;
