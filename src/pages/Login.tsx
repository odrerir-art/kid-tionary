import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TeacherIcon, StudentIcon, ParentIcon } from '@/components/ui/user-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('teacher');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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
          <CardDescription>Choose your role and login</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={setLoginType} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teacher"><TeacherIcon className="w-5 h-5 mr-1" />Teacher</TabsTrigger>
              <TabsTrigger value="student"><StudentIcon className="w-5 h-5 mr-1" />Student</TabsTrigger>
              <TabsTrigger value="parent"><ParentIcon className="w-5 h-5 mr-1" />Parent</TabsTrigger>
            </TabsList>
            <TabsContent value="teacher">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="teacher@school.com" /></div>
                <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div>
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                <div className="text-right"><Link to="/forgot-password" className="text-sm text-purple-600 hover:underline">Forgot Password?</Link></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : 'Login as Teacher'}</Button>
              </form>
            </TabsContent>
            <TabsContent value="student">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div><Label htmlFor="student-email">Email</Label><Input id="student-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@school.com" /></div>
                <div><Label htmlFor="student-password">Password</Label><Input id="student-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div>
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : 'Login as Student'}</Button>
              </form>
            </TabsContent>
            <TabsContent value="parent">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div><Label htmlFor="parent-email">Email</Label><Input id="parent-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="parent@email.com" /></div>
                <div><Label htmlFor="parent-password">Password</Label><Input id="parent-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div>
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : 'Login as Parent'}</Button>
              </form>
            </TabsContent>
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
