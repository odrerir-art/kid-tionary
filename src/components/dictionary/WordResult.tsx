import React from 'react';
import { Heart, Printer, Sparkles } from 'lucide-react';
import DefinitionCard from './DefinitionCard';
import MultiDefinitionCard from './MultiDefinitionCard';
import PronunciationButton from './PronunciationButton';

interface DefinitionEntry {
  partOfSpeech: string;
  definitions: {
    simple: string;
    medium: string;
    advanced: string;
  };
  example: string;
}

interface WordData {
  word: string;
  type?: string;
  pronunciation: string;
  definitions?: {
    simple: string;
    medium: string;
    advanced: string;
  };
  definitionEntries?: DefinitionEntry[];
  example?: string;
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



interface WordResultProps {
  wordEntry: WordData;
  gradeLevel: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  pictureMode?: boolean;
}

const WordResult: React.FC<WordResultProps> = ({ 
  wordEntry, 
  gradeLevel, 
  isFavorite = false,
  onToggleFavorite,
  pictureMode = false
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getCategoryBadge = () => {
    if (wordEntry.isSound) return { text: '🔊 Sound Word', color: 'bg-yellow-100 text-yellow-800' };
    if (wordEntry.isMadeUp) return { text: '✨ Made-Up Word', color: 'bg-purple-100 text-purple-800' };
    if (wordEntry.isNonEnglish) return { text: '🌍 Non-English', color: 'bg-green-100 text-green-800' };
    return null;
  };

  const badge = getCategoryBadge();

  const hasMultipleDefinitions = wordEntry.definitionEntries && wordEntry.definitionEntries.length > 1;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold">{wordEntry.word}</h2>
              <Sparkles className="text-yellow-300" size={24} />
            </div>
            <p className="text-xl opacity-90 mb-1">{wordEntry.pronunciation}</p>
            {!hasMultipleDefinitions && wordEntry.type && (
              <p className="text-lg opacity-80 italic">{wordEntry.type}</p>
            )}
            {hasMultipleDefinitions && (
              <p className="text-lg opacity-80 italic">Multiple meanings</p>
            )}
            {badge && (
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
                {badge.text}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {onToggleFavorite && (
              <button onClick={onToggleFavorite} className={`p-4 rounded-full hover:scale-110 transition-transform shadow-lg ${isFavorite ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'}`} title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <Heart size={28} className={isFavorite ? 'fill-white' : ''} />
              </button>
            )}
            <PronunciationButton word={wordEntry.word} />
            <button onClick={handlePrint} className="bg-white text-purple-600 p-4 rounded-full hover:scale-110 transition-transform shadow-lg" title="Print definition">
              <Printer size={28} />
            </button>
          </div>
        </div>
      </div>

      {hasMultipleDefinitions ? (
        <MultiDefinitionCard
          word={wordEntry.word}
          definitions={wordEntry.definitionEntries!}
          gradeLevel={gradeLevel}
          noVisual={wordEntry.noVisual}
          needsColor={wordEntry.needsColor}
          pictureMode={pictureMode}
          isFlagged={wordEntry.isFlagged}
        />
      ) : (
        <DefinitionCard 
          definition={wordEntry.definitions!} 
          word={wordEntry.word}
          wordType={wordEntry.type}
          example={wordEntry.example!} 
          gradeLevel={gradeLevel} 
          noVisual={wordEntry.noVisual} 
          needsColor={wordEntry.needsColor} 
          pictureMode={pictureMode}
          panelDescriptions={wordEntry.panelDescriptions}
          isMultiPanel={wordEntry.isMultiPanel}
          isFlagged={wordEntry.isFlagged}
        />
      )}
    </div>
  );
};

export default WordResult;
