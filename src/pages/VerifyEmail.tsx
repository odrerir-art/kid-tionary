import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, resendVerificationEmail } = useAuth();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      setMessage(errorDescription || 'Verification failed. Please try again.');
    } else if (type === 'signup') {
      setStatus('success');
      setMessage('Email verified successfully! You can now log in.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate]);

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      await resendVerificationEmail(user.email);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : status === 'error' ? (
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          ) : (
            <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">
            {status === 'success' ? 'Email Verified!' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription>
            {status === 'pending' && 'Check your inbox for a verification link'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {status === 'pending' && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                We've sent a verification email to <strong>{user?.email}</strong>. 
                Click the link in the email to verify your account.
              </p>
              <Button 
                onClick={handleResend} 
                disabled={resending}
                className="w-full"
                variant="outline"
              >
                {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend Verification Email
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
                variant="secondary"
              >
                Back to Login
              </Button>
            </>
          )}
          
          {status === 'success' && (
            <p className="text-sm text-center text-muted-foreground">
              Redirecting to login...
            </p>
          )}
          
          {status === 'error' && (
            <Button onClick={() => navigate('/signup')} className="w-full">
              Try Signing Up Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
