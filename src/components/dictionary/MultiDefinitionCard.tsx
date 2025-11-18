import React from 'react';
import DefinitionCard from './DefinitionCard';

interface DefinitionEntry {
  partOfSpeech: string;
  definitions: {
    simple: string;
    medium: string;
    advanced: string;
  };
  example: string;
}

interface MultiDefinitionCardProps {
  word: string;
  definitions: DefinitionEntry[];
  gradeLevel: string;
  noVisual?: boolean;
  needsColor?: boolean;
  pictureMode?: boolean;
  isFlagged?: boolean;
}

const MultiDefinitionCard: React.FC<MultiDefinitionCardProps> = ({
  word,
  definitions,
  gradeLevel,
  noVisual = false,
  needsColor = false,
  pictureMode = false,
  isFlagged = false
}) => {
  return (
    <div className="space-y-6">
      {definitions.map((def, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <div className="mb-2">
            <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
              {def.partOfSpeech.toUpperCase()}
            </span>
          </div>
          <DefinitionCard
            definition={def.definitions}
            word={word}
            wordType={def.partOfSpeech}
            example={def.example}
            gradeLevel={gradeLevel}
            noVisual={noVisual}
            needsColor={needsColor}
            pictureMode={pictureMode}
            isFlagged={isFlagged}
          />
        </div>
      ))}
    </div>
  );
};

export default MultiDefinitionCard;
