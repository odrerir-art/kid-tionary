import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { UserPlus, Users } from 'lucide-react';
import { StudentProgress } from './StudentProgress';

export function TeacherDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    gradeLevel: 1,
    parentEmail: ''
  });

  const teacherId = 'temp-teacher-id'; // In production, get from auth context

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const { data } = await supabase
      .from('student_profiles')
      .select('*, student:users!student_id(*)')
      .eq('teacher_id', teacherId);
    
    if (data) setStudents(data);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data } = await supabase.functions.invoke('create-student-account', {
        body: { ...formData, teacherId }
      });

      if (data.success) {
        setShowCreateForm(false);
        loadStudents();
        setFormData({ fullName: '', username: '', password: '', gradeLevel: 1, parentEmail: '' });
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          My Students
        </h2>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-2" />Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Student Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
              </div>
              <div>
                <Label>Username</Label>
                <Input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div>
                <Label>Grade Level</Label>
                <Select value={formData.gradeLevel.toString()} onValueChange={(v) => setFormData({...formData, gradeLevel: parseInt(v)})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(g => <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Parent Email (Optional)</Label>
                <Input type="email" value={formData.parentEmail} onChange={(e) => setFormData({...formData, parentEmail: e.target.value})} />
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => (
          <Card key={student.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedStudent(student)}>
            <CardHeader>
              <CardTitle className="text-lg">{student.student?.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Grade {student.grade_level}</p>
              <p className="text-sm text-muted-foreground">@{student.username}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <StudentProgress studentId={selectedStudent.student_id} studentName={selectedStudent.student?.full_name} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
