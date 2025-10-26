import React, { useState, useEffect } from 'react';
import PictureFeedback from './PictureFeedback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisualDefinitionProps {
  word: string;
  type: 'single' | 'comic';
  imageUrl?: string;
  needsColor?: boolean;
  panelDescriptions?: string[];
  isMultiPanel?: boolean;
}

const VisualDefinition: React.FC<VisualDefinitionProps> = ({ 
  word, 
  type, 
  imageUrl, 
  needsColor,
  panelDescriptions = [],
  isMultiPanel = false
}) => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalPanels = isMultiPanel ? panelDescriptions.length : 1;

  useEffect(() => {
    if (type === 'single' && !imageUrl && generatedImages.length === 0) {
      generateImages();
    }
  }, [word]);

  const generateImages = async () => {
    setIsGenerating(true);
    try {
      if (isMultiPanel && panelDescriptions.length > 0) {
        // Generate multiple panel images
        const images = await Promise.all(
          panelDescriptions.map(async (desc, index) => {
            const stylePrompt = needsColor 
              ? `colorful illustration: ${desc}, simple educational style for children, panel ${index + 1}`
              : `simple black and white line drawing: ${desc}, coloring book style, clean lines, no shading, educational illustration`;
            
            const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(stylePrompt)}?width=512&height=512&nologo=true`);
            return response.url;
          })
        );
        setGeneratedImages(images);
      } else {
        // Generate single image
        const stylePrompt = needsColor 
          ? `colorful illustration of ${word}, simple and clear, educational style for children`
          : `simple black and white line drawing of ${word}, coloring book style, clean lines, no shading, educational illustration for children`;
        
        const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(stylePrompt)}?width=512&height=512&nologo=true`);
        setGeneratedImages([response.url]);
      }
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrevPanel = () => {
    setCurrentPanel((prev) => (prev > 0 ? prev - 1 : totalPanels - 1));
  };

  const handleNextPanel = () => {
    setCurrentPanel((prev) => (prev < totalPanels - 1 ? prev + 1 : 0));
  };

  if (type === 'single') {
    const displayImage = imageUrl || generatedImages[currentPanel];
    
    if (isGenerating) {
      return (
        <div className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      );
    }

    if (displayImage) {
      return (
        <div className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          {isMultiPanel && totalPanels > 1 && (
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPanel}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium text-purple-700">
                Panel {currentPanel + 1} of {totalPanels}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPanel}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex justify-center">
            <img
              src={displayImage}
              alt={`Visual representation of ${word}${isMultiPanel ? ` - Panel ${currentPanel + 1}` : ''}`}
              className="max-w-xs rounded-lg shadow-md"
            />
          </div>
          
          {isMultiPanel && panelDescriptions[currentPanel] && (
            <p className="text-center text-sm text-gray-700 mt-3 italic">
              {panelDescriptions[currentPanel]}
            </p>
          )}
          
          <PictureFeedback word={word} panelNumber={currentPanel + 1} />
        </div>
      );
    }
  }

  return null;
};

export default VisualDefinition;
