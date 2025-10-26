import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Play, Trophy, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WordList {
  id: string;
  title: string;
  description: string;
  grade_level: string;
  teacher_name: string;
  share_code: string;
}

interface StudentWordListsProps {
  studentName: string;
  onStartQuiz: (listId: string, words: string[]) => void;
}

export function StudentWordLists({ studentName, onStartQuiz }: StudentWordListsProps) {
  const [lists, setLists] = useState<WordList[]>([]);
  const [shareCode, setShareCode] = useState('');
  const [progress, setProgress] = useState<Record<string, any>>({});

  const loadLists = async () => {
    const { data } = await supabase
      .from('word_lists')
      .select('*')
      .order('created_at', { ascending: false });
    setLists(data || []);
    
    if (data) {
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_name', studentName);
      
      const progressMap: Record<string, any> = {};
      progressData?.forEach(p => { progressMap[p.list_id] = p; });
      setProgress(progressMap);
    }
  };

  useEffect(() => { loadLists(); }, [studentName]);

  const joinList = async () => {
    if (!shareCode.trim()) return;
    const { data } = await supabase
      .from('word_lists')
      .select('*')
      .eq('share_code', shareCode.toUpperCase())
      .single();
    
    if (data) {
      alert(`Joined: ${data.title}`);
      setShareCode('');
      loadLists();
    } else {
      alert('Invalid share code');
    }
  };

  const startQuiz = async (listId: string) => {
    const { data } = await supabase
      .from('word_list_items')
      .select('word')
      .eq('list_id', listId)
      .order('order_index');
    
    if (data) {
      onStartQuiz(listId, data.map(item => item.word));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Label>Join a Word List</Label>
        <div className="flex gap-2 mt-2">
          <Input 
            placeholder="Enter share code" 
            value={shareCode} 
            onChange={e => setShareCode(e.target.value.toUpperCase())}
            className="uppercase"
          />
          <Button onClick={joinList}>Join</Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {lists.map(list => {
          const prog = progress[list.id];
          const masteredCount = prog?.words_mastered?.length || 0;
          
          return (
            <Card key={list.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{list.title}</h3>
                  <p className="text-gray-600 mb-3">{list.description}</p>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary">{list.grade_level}</Badge>
                    <Badge variant="outline">By {list.teacher_name}</Badge>
                    {masteredCount > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {masteredCount} mastered
                      </Badge>
                    )}
                  </div>
                </div>
                <Button onClick={() => startQuiz(list.id)}>
                  <Play className="w-4 h-4 mr-2" />
                  Practice
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
