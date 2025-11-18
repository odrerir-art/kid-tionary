import React, { useState, useEffect } from 'react';
import PictureFeedback from './PictureFeedback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface VisualDefinitionProps {
  word: string;
  type: 'single' | 'comic';
  wordType?: string; // Part of speech (noun, verb, adjective, etc.)
  imageUrl?: string;
  needsColor?: boolean;
  panelDescriptions?: string[];
  isMultiPanel?: boolean;
  isFlagged?: boolean;
}


const VisualDefinition: React.FC<VisualDefinitionProps> = ({ 
  word, 
  type,
  wordType,
  imageUrl, 
  needsColor,
  panelDescriptions = [],
  isMultiPanel = false,
  isFlagged = false
}) => {

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalPanels = isMultiPanel ? panelDescriptions.length : 1;

  useEffect(() => {
    if (isFlagged) return;
    
    if (type === 'single' && !imageUrl && generatedImages.length === 0) {
      checkAndLoadImages();
    }
  }, [word, isFlagged]);

  const checkAndLoadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('word_images')
        .select('image_url')
        .eq('word', word.toLowerCase())
        .single();

      if (data && !error) {
        setGeneratedImages([data.image_url]);
      } else {
        await generateImages();
      }
    } catch (error) {
      await generateImages();
    }
  };

  const generateImages = async () => {
    setIsGenerating(true);
    try {
      if (isMultiPanel && panelDescriptions.length > 0) {
        const images = await Promise.all(
          panelDescriptions.map(async (desc, index) => {
            const prompt = `Educational illustration for children: ${desc}. Simple, clear, uncluttered. Panel ${index + 1}. White background. No text or words in image.`;
            const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`);
            return response.url;
          })
        );
        setGeneratedImages(images);
      } else {
        const prompt = buildEducationalPrompt(word, wordType, needsColor);
        const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`);
        const imageUrl = response.url;
        setGeneratedImages([imageUrl]);

        try {
          await supabase
            .from('word_images')
            .upsert({ 
              word: word.toLowerCase(), 
              image_url: imageUrl 
            });
        } catch (err) {
          console.log('Could not cache image:', err);
        }
      }
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  };


  const buildEducationalPrompt = (word: string, wordType?: string, needsColor?: boolean): string => {
    const baseStyle = needsColor 
      ? "Simple colorful illustration for children's dictionary"
      : "Simple black and white line drawing, coloring book style";
    
    // Normalize word type to lowercase for comparison
    const type = wordType?.toLowerCase() || '';
    
    // Part-of-speech specific prompt strategies
    if (type.includes('noun')) {
      // NOUNS: Show the object/thing clearly
      return `${baseStyle}: Single isolated ${word} object on plain white background. Clear, uncluttered view of what a ${word} looks like. Educational object illustration for elementary students. No text, no labels, no busy details. Just the ${word} itself, clearly visible and easy to identify.`;
    }
    
    if (type.includes('verb')) {
      // VERBS: Show action/movement with simple diagram
      return `${baseStyle}: Simple action diagram showing someone or something ${word}ing. Clear illustration of the action of '${word}'. Movement arrows or simple sequence. Plain white background. Educational action illustration for elementary students. No text, no labels. Focus on the action being performed.`;
    }
    
    if (type.includes('adjective')) {
      // ADJECTIVES: Show comparison or clear example of the quality
      return `${baseStyle}: Side-by-side comparison illustration showing '${word}' quality. Two simple examples demonstrating what ${word} means versus not ${word}. Plain white background. Educational comparison diagram for elementary students. No text, no labels. Clear visual contrast showing the quality.`;
    }
    
    if (type.includes('adverb')) {
      // ADVERBS: Show action with manner/way indicated
      return `${baseStyle}: Simple illustration showing an action done ${word}. Clear diagram demonstrating how something is done '${word}'. Plain white background. Educational manner illustration for elementary students. No text, no labels. Focus on showing the manner or way of doing something.`;
    }
    
    // DEFAULT: General educational illustration
    return `${baseStyle}: Single isolated ${word} on plain white background. Clear, uncluttered, educational. Perfect for teaching vocabulary to elementary students. No text, no labels, no busy details. Just the ${word} itself, clearly visible and easy to understand.`;
  };


  if (isFlagged) {
    return (
      <div className="mt-4 bg-red-50 rounded-xl p-6 border-2 border-red-200">
        <p className="text-center text-red-700 font-medium">
          Pictures are not available for this word.
        </p>
      </div>
    );
  }

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
              <Button variant="outline" size="sm" onClick={() => setCurrentPanel((prev) => (prev > 0 ? prev - 1 : totalPanels - 1))}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium text-purple-700">
                Panel {currentPanel + 1} of {totalPanels}
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPanel((prev) => (prev < totalPanels - 1 ? prev + 1 : 0))}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex justify-center">
            <img src={displayImage} alt={`Visual of ${word}`} className="max-w-xs rounded-lg shadow-md" />
          </div>
          
          {isMultiPanel && panelDescriptions[currentPanel] && (
            <p className="text-center text-sm text-gray-700 mt-3 italic">
              {panelDescriptions[currentPanel]}
            </p>
          )}
          
          <PictureFeedback word={word} panelNumber={currentPanel + 1} imageUrl={displayImage} onRegenerate={generateImages} />
        </div>
      );
    }
  }

  return null;
};

export default VisualDefinition;
