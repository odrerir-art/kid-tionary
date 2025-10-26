import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { StudentProgress } from './StudentProgress';
import { Mail } from 'lucide-react';

export function ParentPortal() {
  const [email, setEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('role', 'parent')
      .single();

    if (userData) {
      setAuthenticated(true);
      loadChildren(userData.id);
    }
  };

  const loadChildren = async (parentId: string) => {
    const { data } = await supabase
      .from('student_profiles')
      .select('*, student:users!student_id(*)')
      .eq('parent_id', parentId);
    
    if (data) setChildren(data);
  };

  if (!authenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Parent Portal Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Parent Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">Access Portal</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (selectedChild) {
    return (
      <div>
        <Button onClick={() => setSelectedChild(null)} className="mb-4">
          ← Back to Children
        </Button>
        <StudentProgress 
          studentId={selectedChild.student_id} 
          studentName={selectedChild.student?.full_name} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Children's Progress</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map(child => (
          <Card 
            key={child.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedChild(child)}
          >
            <CardHeader>
              <CardTitle>{child.student?.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Grade {child.grade_level}</p>
              <p className="text-sm text-muted-foreground">Click to view progress</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
