import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, Shield, Users, Clock, Pill } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/common/Logo';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col font-body">
      {/* Navbar */}
      <header className="absolute top-0 w-full z-10 px-6 py-6 lg:px-12 flex justify-between items-center">
        <Logo size="lg" link={false} />
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-heading font-medium text-navy-600 hover:text-navy-800 transition-colors">
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500"></span>
          </span>
          HealthThread MVP Beta is live
        </div>

        <h1 className="text-5xl lg:text-7xl font-heading font-bold text-navy-800 tracking-tight max-w-4xl leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Your family's health story, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-500 to-ocean-500">connected.</span>
        </h1>
        
        <p className="text-lg lg:text-xl text-navy-400 max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Unfragment your healthcare. Track vitals, organize medical records, manage medications, and coordinate care for your loved ones—all in one secure place.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link to="/signup">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start for free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Try Demo
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-white p-8 rounded-3xl border border-ivory-200 shadow-soft text-left group hover:border-sage-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-navy-800 mb-3">Family Profiles</h3>
            <p className="text-navy-400 leading-relaxed">
              Manage health records and care routines for parents, children, and yourself from a single account.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-ivory-200 shadow-soft text-left group hover:border-ocean-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-ocean-600" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-navy-800 mb-3">Health Timeline</h3>
            <p className="text-navy-400 leading-relaxed">
              A unified longitudinal record of all doctor visits, lab reports, and medication changes over time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-ivory-200 shadow-soft text-left group hover:border-peach-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-peach-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-peach-600" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-navy-800 mb-3">Secure Sharing</h3>
            <p className="text-navy-400 leading-relaxed">
              Create time-limited access links to share specific health information with new doctors securely.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
