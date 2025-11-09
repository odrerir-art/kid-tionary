import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDictionary } from '@/contexts/DictionaryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Loader2, GraduationCap, Users, UserCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('teacher');
  const { signIn } = useAuth();
  const { setCurrentStudent } = useDictionary();
  const navigate = useNavigate();

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Kid-tionary</CardTitle>
          <CardDescription>Choose your login type below</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={setLoginType} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teacher"><GraduationCap className="w-4 h-4 mr-1" />Teacher</TabsTrigger>
              <TabsTrigger value="student"><UserCircle className="w-4 h-4 mr-1" />Student</TabsTrigger>
              <TabsTrigger value="parent"><Users className="w-4 h-4 mr-1" />Parent</TabsTrigger>
            </TabsList>
            <TabsContent value="teacher">
              <form onSubmit={handleTeacherLogin} className="space-y-4 mt-4">
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="teacher@school.com" /></div>
                <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div>
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                <div className="text-right"><Link to="/forgot-password" className="text-sm text-purple-600 hover:underline">Forgot Password?</Link></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : 'Login as Teacher'}</Button>
              </form>
            </TabsContent>
            <TabsContent value="student"><div className="text-center py-8"><p className="text-gray-600 mb-4">Student login is available on the main page</p><Button onClick={() => navigate('/')} className="w-full">Go to Home Page</Button></div></TabsContent>
            <TabsContent value="parent"><div className="text-center py-8"><p className="text-gray-600 mb-4">Parent portal access is available on the main page</p><Button onClick={() => navigate('/')} className="w-full">Go to Home Page</Button></div></TabsContent>
          </Tabs>
          <div className="mt-6 space-y-3">
            <div className="text-center text-sm">Don't have an account? <Link to="/signup" className="text-purple-600 hover:underline font-semibold">Sign up</Link></div>
            <div className="text-center"><Link to="/subscription" className="inline-block w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">View Subscription Plans</Link></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
