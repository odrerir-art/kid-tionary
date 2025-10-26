import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Copy, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CreateWordList } from './CreateWordList';

interface WordList {
  id: string;
  title: string;
  description: string;
  grade_level: string;
  teacher_name: string;
  share_code: string;
  created_at: string;
}

export function WordListManager() {
  const [lists, setLists] = useState<WordList[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadLists = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('word_lists')
      .select('*')
      .order('created_at', { ascending: false });
    setLists(data || []);
    setLoading(false);
  };

  useEffect(() => { loadLists(); }, []);

  const copyShareCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Share code ${code} copied!`);
  };

  const deleteList = async (id: string) => {
    if (!confirm('Delete this list?')) return;
    await supabase.from('word_lists').delete().eq('id', id);
    loadLists();
  };

  if (showCreate) {
    return <CreateWordList onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); loadLists(); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Word Lists</h2>
        <Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" />Create New List</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : lists.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No Word Lists Yet</h3>
          <p className="text-gray-600 mb-4">Create your first word list to get started</p>
          <Button onClick={() => setShowCreate(true)}>Create Word List</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lists.map(list => (
            <Card key={list.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{list.title}</h3>
                  <p className="text-gray-600 mb-3">{list.description}</p>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary">{list.grade_level}</Badge>
                    <Badge variant="outline">By {list.teacher_name}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm">{list.share_code}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyShareCode(list.share_code)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteList(list.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
