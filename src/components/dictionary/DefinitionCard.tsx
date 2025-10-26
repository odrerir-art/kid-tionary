import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import VisualDefinition from './VisualDefinition';

interface DefinitionCardProps {
  definition: {
    simple: string;
    medium: string;
    advanced: string;
  };
  word: string;
  example: string;
  gradeLevel: string;
  noVisual?: boolean;
  needsColor?: boolean;
  pictureMode?: boolean;
  panelDescriptions?: string[];
  isMultiPanel?: boolean;
}

type ComplexityLevel = 'simple' | 'medium' | 'advanced';

const DefinitionCard: React.FC<DefinitionCardProps> = ({ 
  definition, 
  word, 
  example, 
  gradeLevel, 
  noVisual = false, 
  needsColor = false, 
  pictureMode = false,
  panelDescriptions = [],
  isMultiPanel = false
}) => {
  const getInitialLevel = (): ComplexityLevel => {
    const gradeNum = gradeLevel === 'K' ? 0 : parseInt(gradeLevel);
    if (gradeNum <= 2) return 'simple';
    if (gradeNum <= 4) return 'medium';
    return 'advanced';
  };

  const [level, setLevel] = useState<ComplexityLevel>(getInitialLevel());
  const [showVisual, setShowVisual] = useState(false);

  const handleSimplify = () => {
    if (level === 'advanced') setLevel('medium');
    else if (level === 'medium') setLevel('simple');
  };

  const handleExpand = () => {
    if (level === 'simple') setLevel('medium');
    else if (level === 'medium') setLevel('advanced');
  };

  const canSimplify = level !== 'simple';
  const canExpand = level !== 'advanced';

  const getLevelLabel = () => {
    if (level === 'simple') return '🟢 Simple';
    if (level === 'medium') return '🟡 Medium';
    return '🔴 Advanced';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-4 border-blue-100 p-6 hover:shadow-2xl transition-all">
      <div className="mb-4">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
          {getLevelLabel()}
        </span>
        {isMultiPanel && (
          <span className="ml-2 inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            📖 Multi-Panel
          </span>
        )}
      </div>
      
      <p className="text-2xl leading-relaxed text-gray-800 mb-4 font-medium">
        {definition[level]}
      </p>
      
      {example && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
          <p className="text-lg text-gray-700 italic">Example: "{example}"</p>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <button onClick={handleSimplify} disabled={!canSimplify} className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${canSimplify ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          <ChevronDown size={20} />
          Simpler
        </button>
        <button onClick={handleExpand} disabled={!canExpand} className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${canExpand ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          <ChevronUp size={20} />
          More Detail
        </button>
        {!noVisual && (
          <button onClick={() => setShowVisual(!showVisual)} className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 transition-all">
            <ImageIcon size={20} />
            {showVisual ? 'Hide' : 'Show'} Picture
          </button>
        )}
      </div>
      
      {showVisual && !noVisual && (
        <VisualDefinition 
          word={word} 
          type="single" 
          needsColor={needsColor}
          panelDescriptions={panelDescriptions}
          isMultiPanel={isMultiPanel}
        />
      )}
    </div>
  );
};

export default DefinitionCard;
