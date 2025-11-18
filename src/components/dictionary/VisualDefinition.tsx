import React, { useState, useEffect } from 'react';
import PictureFeedback from './PictureFeedback';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { searchEducationalImage } from '@/lib/imageService';
import { useAuth } from '@/contexts/AuthContext';

interface VisualDefinitionProps {
  word: string;
  type: 'single' | 'comic';
  wordType?: string;
  imageUrl?: string;
  needsColor?: boolean;
  panelDescriptions?: string[];
  isMultiPanel?: boolean;
  isFlagged?: boolean;
}

const VisualDefinition: React.FC<VisualDefinitionProps> = ({ 
  word, type, wordType, imageUrl, needsColor, panelDescriptions = [], isMultiPanel = false, isFlagged = false
}) => {
  const { user } = useAuth();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageAttribution, setImageAttribution] = useState<string>('');

  const totalPanels = isMultiPanel ? panelDescriptions.length : 1;
  const isTeacherOrAdmin = user?.user_metadata?.role === 'teacher' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (isFlagged) return;
    if (type === 'single' && !imageUrl && generatedImages.length === 0) {
      checkAndLoadImages();
    }
  }, [word, isFlagged]);

  const checkAndLoadImages = async () => {
    try {
      const { data } = await supabase.from('word_images').select('image_url').eq('word', word.toLowerCase()).single();
      if (data) {
        setGeneratedImages([data.image_url]);
      } else {
        await generateImages();
      }
    } catch {
      await generateImages();
    }
  };

  const generateImages = async () => {
    setIsGenerating(true);
    try {
      const result = await searchEducationalImage(word);
      if (result) {
        setGeneratedImages([result.url]);
        setImageAttribution(result.attribution || '');
        await supabase.from('word_images').upsert({ word: word.toLowerCase(), image_url: result.url });
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${word.toLowerCase()}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('word-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('word-images').getPublicUrl(filePath);

      await supabase.from('word_images').upsert({ word: word.toLowerCase(), image_url: publicUrl });
      
      setGeneratedImages([publicUrl]);
      setImageAttribution('');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  if (isFlagged) {
    return (
      <div className="mt-4 bg-red-50 rounded-xl p-6 border-2 border-red-200">
        <p className="text-center text-red-700 font-medium">Pictures are not available for this word.</p>
      </div>
    );
  }

  if (type === 'single') {
    const displayImage = imageUrl || generatedImages[currentPanel];
    
    if (isGenerating || uploadingImage) {
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
          <div className="flex justify-center">
            <img src={displayImage} alt={`Visual of ${word}`} className="max-w-xs rounded-lg shadow-md" />
          </div>
          
          {imageAttribution && (
            <p className="text-xs text-center text-gray-500 mt-2">{imageAttribution}</p>
          )}
          
          {isTeacherOrAdmin && (
            <div className="mt-4 flex justify-center">
              <label htmlFor={`upload-${word}`}>
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Better Image
                  </span>
                </Button>
              </label>
              <input id={`upload-${word}`} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          )}
          
          <PictureFeedback word={word} panelNumber={currentPanel + 1} imageUrl={displayImage} onRegenerate={generateImages} />
        </div>
      );
    }
  }

  return null;
};

export default VisualDefinition;
