import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { UserRole } from '@/types';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'supervisor') navigate('/supervisor/dashboard');
      else if (user.role === 'pmo') navigate('/pmo/dashboard');
      else if (user.role === 'external_panel') navigate('/external/dashboard');
      else if (user.role === 'exam_cell') navigate('/exam-cell/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      // user effect will handle redirect
    } catch (error: any) {
      toast.error('Failed to sign in. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  const autofillDemo = (role: UserRole) => {
    const roles = {
      student: '22104338@uskt.edu.pk',
      supervisor: 'tanveer.hussain@uskt.edu.pk',
      pmo: 'ayesha.siddiqui@uskt.edu.pk',
      external_panel: 'kamran.ahmed@uskt.edu.pk',
      exam_cell: 'hina.rabbani@uskt.edu.pk',
      admin: 'javed.sheikh@uskt.edu.pk',
    };
    setEmail(roles[role] || '');
    setPassword('password');
    toast.info(`Autofilled ${role} credentials`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ProjectSync</h1>
          <p className="text-sm text-muted-foreground">
            Final Year Project Management Portal
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Demo Access (Autofill)
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => autofillDemo('student')}>Student</Button>
                <Button variant="outline" size="sm" onClick={() => autofillDemo('supervisor')}>Supervisor</Button>
                <Button variant="outline" size="sm" onClick={() => autofillDemo('pmo')}>PMO</Button>
                <Button variant="outline" size="sm" onClick={() => autofillDemo('external_panel')}>External</Button>
                <Button variant="outline" size="sm" onClick={() => autofillDemo('exam_cell')}>Exam Cell</Button>
                <Button variant="outline" size="sm" onClick={() => autofillDemo('admin')}>Admin</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2024 University. All rights reserved.
        </p>
      </div>
    </div>
  );
}
