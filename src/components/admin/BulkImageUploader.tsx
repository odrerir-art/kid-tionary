import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchEducationalImage } from '@/lib/imageService';

export function BulkImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(false);
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

  const handlePixabayFetch = async () => {
    const words = wordList.split('\n').map(w => w.trim()).filter(Boolean);
    if (words.length === 0) {
      toast({ title: 'Error', description: 'Please enter words to fetch', variant: 'destructive' });
      return;
    }

    setFetching(true);
    let successCount = 0;

    for (const word of words) {
      try {
        const result = await searchEducationalImage(word);
        if (result) {
          await supabase.from('word_images').upsert({
            word: word.toLowerCase(),
            image_url: result.url
          });
          successCount++;
        }
      } catch (error) {
        console.error(`Error fetching image for ${word}:`, error);
      }
    }

    setFetching(false);
    setWordList('');
    toast({
      title: 'Fetch Complete',
      description: `${successCount} images fetched from Pixabay successfully.`
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
          <Download className="w-5 h-5" />
          Fetch from Pixabay
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Automatically fetch educational images from Pixabay. Enter one word per line.
        </p>
        <textarea
          className="w-full h-40 p-3 border rounded-md"
          placeholder="cat&#10;dog&#10;house&#10;tree"
          value={wordList}
          onChange={(e) => setWordList(e.target.value)}
          disabled={fetching}
        />
        <Button onClick={handlePixabayFetch} disabled={fetching} className="mt-4">
          {fetching ? 'Fetching...' : 'Fetch Images from Pixabay'}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Free Image Sources
        </h3>
        <ul className="space-y-2 text-sm">
          <li>• <strong>Pixabay</strong> - Free educational images (integrated above)</li>
          <li>• <strong>OpenClipart</strong> - Public domain clipart (openclipart.org)</li>
          <li>• <strong>Wikimedia Commons</strong> - Public domain images</li>
          <li>• <strong>Unsplash</strong> - High-quality free photos (requires attribution)</li>
        </ul>
      </Card>
    </div>
  );
}
