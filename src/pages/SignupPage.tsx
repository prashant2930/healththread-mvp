import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../features/auth/AuthContext';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In demo mode, this just logs in as the demo user
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-navy-500">
          Start organising your family's health today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-2xl sm:px-10 border border-ivory-200">
          <form className="space-y-6" onSubmit={handleSignup}>
            <Input
              label="Full name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              placeholder="Enter your full name"
            />

            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              placeholder="Create a password"
              helperText="Must be at least 8 characters long"
            />

            <Button type="submit" className="w-full" size="lg" loading={loading} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Create account
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
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sage-600 hover:text-sage-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
