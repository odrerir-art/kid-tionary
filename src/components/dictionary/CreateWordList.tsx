import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CreateWordListProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateWordList({ onClose, onCreated }: CreateWordListProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gradeLevel, setGradeLevel] = useState('K-2');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [words, setWords] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const addWord = () => setWords([...words, '']);
  const removeWord = (index: number) => setWords(words.filter((_, i) => i !== index));
  const updateWord = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const generateShareCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const filteredWords = words.filter(w => w.trim());
    if (!filteredWords.length) return;

    const shareCode = generateShareCode();

    const { data: list, error: listError } = await supabase
      .from('word_lists')
      .insert({
        title,
        description,
        grade_level: gradeLevel,
        teacher_name: teacherName,
        teacher_email: teacherEmail,
        share_code: shareCode
      })
      .select()
      .single();

    if (listError || !list) {
      alert('Error creating list');
      setLoading(false);
      return;
    }

    const items = filteredWords.map((word, index) => ({
      list_id: list.id,
      word: word.trim(),
      order_index: index
    }));

    await supabase.from('word_list_items').insert(items);
    setLoading(false);
    onCreated();
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Word List</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
        </div>
        
        <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} required /></div>
        <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
        <div><Label>Grade Level</Label>
          <Select value={gradeLevel} onValueChange={setGradeLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="K-2">K-2</SelectItem>
              <SelectItem value="3-5">3-5</SelectItem>
              <SelectItem value="6-8">6-8</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Teacher Name</Label><Input value={teacherName} onChange={e => setTeacherName(e.target.value)} required /></div>
        <div><Label>Email</Label><Input type="email" value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} required /></div>
        
        <div className="space-y-2">
          <Label>Words</Label>
          {words.map((word, i) => (
            <div key={i} className="flex gap-2">
              <Input value={word} onChange={e => updateWord(i, e.target.value)} placeholder={`Word ${i + 1}`} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeWord(i)}><X className="w-4 h-4" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addWord}><Plus className="w-4 h-4 mr-2" />Add Word</Button>
        </div>

        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Create List'}</Button>
      </form>
    </Card>
  );
}
