import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../features/auth/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('arjun.mehta@example.com'); // default for demo
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const { login, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      navigate('/app');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-heading font-bold text-navy-800 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-navy-500">
          Sign in to access your family's health records
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-2xl sm:px-10 border border-ivory-200">
          {isDemo && (
            <div className="mb-6 p-4 bg-sage-50 rounded-xl border border-sage-200 flex gap-3 text-sm text-sage-800">
              <AlertCircle className="w-5 h-5 text-sage-600 flex-shrink-0" />
              <p>Demo mode is active. You can log in with the pre-filled credentials to explore the app.</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              placeholder="Enter your email"
            />

            <div>
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                placeholder="Enter your password"
              />
              <div className="flex items-center justify-end mt-2">
                <a href="#" className="text-sm font-medium text-sage-600 hover:text-sage-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ivory-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-navy-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="secondary" className="w-full">
                Google
              </Button>
              <Button variant="secondary" className="w-full">
                Apple
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-navy-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-sage-600 hover:text-sage-500">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
