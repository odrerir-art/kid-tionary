import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BulkImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [wordList, setWordList] = useState('');
  const { toast } = useToast();

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of Array.from(files)) {
      try {
        const word = file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').toLowerCase();
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('word-images')
          .upload(`${word}-${Date.now()}.${file.name.split('.').pop()}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('word-images')
          .getPublicUrl(uploadData.path);

        await supabase.from('word_images').upsert({
          word,
          image_url: publicUrl
        });

        successCount++;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        errorCount++;
      }
    }

    setUploading(false);
    toast({
      title: 'Upload Complete',
      description: `${successCount} images uploaded successfully. ${errorCount} failed.`
    });
  };

  const handleAIGeneration = async () => {
    const words = wordList.split('\n').map(w => w.trim()).filter(Boolean);
    if (words.length === 0) {
      toast({ title: 'Error', description: 'Please enter words to generate', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    let successCount = 0;

    for (const word of words) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-definition', {
          body: { word, generateImage: true }
        });

        if (!error && data?.imageUrl) {
          successCount++;
        }
      } catch (error) {
        console.error(`Error generating image for ${word}:`, error);
      }
    }

    setGenerating(false);
    setWordList('');
    toast({
      title: 'Generation Complete',
      description: `${successCount} images generated successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Upload Images
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload multiple images at once. File names should match the word (e.g., "cat.png", "dog.jpg").
        </p>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleBulkUpload}
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Image Generation
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate images for words using AI. Enter one word per line.
        </p>
        <textarea
          className="w-full h-40 p-3 border rounded-md"
          placeholder="cat&#10;dog&#10;house&#10;tree"
          value={wordList}
          onChange={(e) => setWordList(e.target.value)}
          disabled={generating}
        />
        <Button onClick={handleAIGeneration} disabled={generating} className="mt-4">
          {generating ? 'Generating...' : 'Generate Images'}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Free Image Sources
        </h3>
        <ul className="space-y-2 text-sm">
          <li>• <strong>OpenClipart</strong> - Public domain clipart (openclipart.org)</li>
          <li>• <strong>Pixabay</strong> - Free stock photos and illustrations</li>
          <li>• <strong>Unsplash</strong> - High-quality free photos</li>
          <li>• <strong>Pexels</strong> - Free stock photos</li>
          <li>• <strong>Wikimedia Commons</strong> - Public domain images</li>
        </ul>
      </Card>
    </div>
  );
}
