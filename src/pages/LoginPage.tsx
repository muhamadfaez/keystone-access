import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@university.edu');
  const [password, setPassword] = useState('password');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd validate credentials here.
      // For this mock, we'll just log in successfully.
      if (email && password) {
        login();
        toast.success('Login Successful', {
          description: 'Welcome back! Redirecting you to the dashboard...',
        });
        navigate('/');
      } else {
        toast.error('Login Failed', {
          description: 'Please enter your credentials.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-mesh opacity-10 dark:opacity-20" />
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight">
          Keystone Access
        </h1>
      </div>
      <Card className="w-full max-w-sm mt-8 z-10 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-8 z-10">
        Built with ❤️ at Cloudflare
      </p>
    </div>
  );
}