import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, RefreshCw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WordImage {
  word: string;
  image_url: string;
  created_at: string;
}

export function ImageReviewManager() {
  const [images, setImages] = useState<WordImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data, error } = await supabase
      .from('word_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const deleteImage = async (word: string) => {
    const { error } = await supabase
      .from('word_images')
      .delete()
      .eq('word', word);

    if (!error) {
      setImages(images.filter(img => img.word !== word));
      toast({ title: 'Image deleted' });
    }
  };

  const replaceImage = async (word: string, file: File) => {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('word-images')
      .upload(`${word}-${Date.now()}.${file.name.split('.').pop()}`, file);

    if (uploadError) {
      toast({ title: 'Upload failed', variant: 'destructive' });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('word-images')
      .getPublicUrl(uploadData.path);

    await supabase.from('word_images').upsert({
      word,
      image_url: publicUrl
    });

    loadImages();
    toast({ title: 'Image replaced' });
  };

  const filtered = images.filter(img => 
    img.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search words..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <Card key={img.word} className="p-4">
            <img src={img.image_url} alt={img.word} className="w-full h-32 object-cover rounded mb-2" />
            <p className="font-medium text-center mb-2">{img.word}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => deleteImage(img.word)}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <label className="flex-1">
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <span><Upload className="w-4 h-4" /></span>
                </Button>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && replaceImage(img.word, e.target.files[0])}
                />
              </label>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
