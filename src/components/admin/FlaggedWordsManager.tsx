import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Trash2, Flag } from 'lucide-react';
import { toast } from 'sonner';

interface FlaggedWord {
  id: string;
  word: string;
  reason: string | null;
  hide_from_search: boolean;
  flagged_at: string;
}

export function FlaggedWordsManager() {
  const [flaggedWords, setFlaggedWords] = useState<FlaggedWord[]>([]);
  const [newWord, setNewWord] = useState('');
  const [reason, setReason] = useState('');
  const [hideFromSearch, setHideFromSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFlaggedWords();
  }, []);

  const loadFlaggedWords = async () => {
    const { data, error } = await supabase
      .from('flagged_words')
      .select('*')
      .order('flagged_at', { ascending: false });

    if (error) {
      toast.error('Failed to load flagged words');
    } else {
      setFlaggedWords(data || []);
    }
  };

  const handleFlagWord = async () => {
    if (!newWord.trim()) {
      toast.error('Please enter a word');
      return;
    }

    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    
    const { error } = await supabase.functions.invoke('flag-word', {
      body: { 
        word: newWord, 
        reason, 
        hideFromSearch,
        userId: userData?.user?.id 
      }
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to flag word');
    } else {
      toast.success('Word flagged successfully');
      setNewWord('');
      setReason('');
      setHideFromSearch(false);
      loadFlaggedWords();
    }
  };

  const handleUnflag = async (id: string, word: string) => {
    const { error } = await supabase
      .from('flagged_words')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to unflag word');
    } else {
      toast.success(`"${word}" unflagged`);
      loadFlaggedWords();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Flag New Word
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter word to flag"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
          />
          <Textarea
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              checked={hideFromSearch}
              onCheckedChange={(checked) => setHideFromSearch(checked as boolean)}
            />
            <label className="text-sm">Hide from student searches</label>
          </div>
          <Button onClick={handleFlagWord} disabled={loading}>
            Flag Word
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Words ({flaggedWords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {flaggedWords.map((fw) => (
              <div key={fw.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    {fw.word}
                  </div>
                  {fw.reason && <p className="text-sm text-gray-600">{fw.reason}</p>}
                  {fw.hide_from_search && (
                    <span className="text-xs text-orange-600">Hidden from search</span>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnflag(fw.id, fw.word)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}