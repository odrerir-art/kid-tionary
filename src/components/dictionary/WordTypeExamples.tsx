import React from 'react';
import { Zap, Globe, Sparkles, Volume2 } from 'lucide-react';

interface WordTypeExamplesProps {
  onWordClick: (word: string) => void;
}

const WordTypeExamples: React.FC<WordTypeExamplesProps> = ({ onWordClick }) => {
  const wordTypes = [
    {
      icon: <Volume2 className="text-orange-600" size={24} />,
      title: 'Sound Words',
      description: 'Words that sound like what they mean',
      examples: ['boom', 'splash', 'buzz', 'meow'],
      color: 'from-orange-50 to-red-50 border-orange-200',
    },
    {
      icon: <Sparkles className="text-purple-600" size={24} />,
      title: 'Made-Up Words',
      description: 'Fun words from stories (like Dr. Seuss!)',
      examples: ['sneetches', 'lorax', 'grinch'],
      color: 'from-purple-50 to-pink-50 border-purple-200',
    },
    {
      icon: <Globe className="text-blue-600" size={24} />,
      title: 'Other Languages',
      description: 'Words from different languages',
      examples: ['hola', 'bonjour', 'gracias'],
      color: 'from-blue-50 to-cyan-50 border-blue-200',
    },
    {
      icon: <Zap className="text-green-600" size={24} />,
      title: 'Regular Words',
      description: 'Everyday English words',
      examples: ['happy', 'dog', 'run', 'friend'],
      color: 'from-green-50 to-emerald-50 border-green-200',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Types of Words We Can Help With
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wordTypes.map((type, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${type.color} rounded-xl p-4 border-2`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-1">{type.icon}</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{type.title}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {type.examples.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => onWordClick(word)}
                  className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 hover:scale-105 transition-transform shadow-sm border border-gray-200"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordTypeExamples;
