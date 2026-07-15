import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Pill,
  Activity,
  Calendar,
  FileText,
  RefreshCw,
  ArrowRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../data/DataContext';
import { useAuth } from '../features/auth/AuthContext';
import type { HealthProfile, ProfileSummary } from '../types';

const RELATIONSHIP_LABELS: Record<string, string> = {
  self: 'You',
  father: 'Father',
  mother: 'Mother',
  spouse: 'Spouse',
  child: 'Child',
  sibling: 'Sibling',
  other: 'Family',
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays === -1) return 'yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

function ProfileCard({ summary }: { summary: ProfileSummary }) {
  const { profile } = summary;
  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const label = RELATIONSHIP_LABELS[profile.relationship] || profile.relationship;

  return (
    <Link
      to={`/app/family/${profile.id}`}
      className="card-hover group block"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: profile.avatarColor }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-semibold text-navy-800 text-lg truncate">
              {profile.fullName}
            </h3>
            <span className="badge-sage text-2xs whitespace-nowrap">{label}</span>
          </div>

          <div className="space-y-2 mt-3">
            {/* Active Medications */}
            {summary.activeMedications > 0 && (
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <Pill className="w-3.5 h-3.5 text-sage-500 flex-shrink-0" />
                <span>
                  {summary.activeMedications} active medicine{summary.activeMedications !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Latest Vital */}
            {summary.latestVital && (
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <Activity className="w-3.5 h-3.5 text-ocean-500 flex-shrink-0" />
                <span>
                  {summary.latestVital.type} updated {getRelativeDate(summary.latestVital.date)}
                </span>
              </div>
            )}

            {/* Upcoming Follow-ups */}
            {summary.upcomingFollowUps.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <Calendar className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
                <span>
                  {summary.upcomingFollowUps.length} follow-up{summary.upcomingFollowUps.length !== 1 ? 's' : ''} due
                </span>
              </div>
            )}

            {/* Latest Report */}
            {summary.latestReport && (
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <FileText className="w-3.5 h-3.5 text-lavender-500 flex-shrink-0" />
                <span>Latest report: {summary.latestReport.title}</span>
              </div>
            )}

            {/* Active Care Loops */}
            {summary.activeCareLoops > 0 && (
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <RefreshCw className="w-3.5 h-3.5 text-sage-500 flex-shrink-0" />
                <span>
                  {summary.activeCareLoops} active care loop{summary.activeCareLoops !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-sage-600 transition-colors flex-shrink-0 mt-1" />
      </div>

      {/* Pending Tasks Indicator */}
      {summary.pendingTasks > 0 && (
        <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-peach-500" />
          <span className="text-xs text-peach-600 font-medium">
            {summary.pendingTasks} pending care task{summary.pendingTasks !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </Link>
  );
}

export function DashboardPage() {
  const data = useData();
  const { user, isDemo } = useAuth();
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [summaries, setSummaries] = useState<ProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profs = await data.getProfiles();
        setProfiles(profs);

        const sums = await Promise.all(
          profs.map((p) => data.getProfileSummary(p.id))
        );
        setSummaries(sums);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [data]);

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-400 font-body">Loading your family's health overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-800">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="text-navy-400 mt-1 font-body">
          Here&apos;s your family&apos;s health overview.
        </p>
      </div>

      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="mb-6 px-4 py-3 bg-sage-50 border border-sage-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-sage-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-sage-700">Demo Mode</p>
            <p className="text-xs text-sage-600 mt-0.5">
              Exploring with fictional data for the Mehta family. No real health information is stored.
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link
          to="/app/medications"
          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-ivory-300 hover:border-sage-300 hover:shadow-soft transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-sage-100 flex items-center justify-center group-hover:bg-sage-200 transition-colors">
            <Pill className="w-4 h-4 text-sage-600" />
          </div>
          <span className="text-sm font-medium text-navy-700">Medications</span>
        </Link>
        <Link
          to="/app/vitals"
          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-ivory-300 hover:border-ocean-300 hover:shadow-soft transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-ocean-100 flex items-center justify-center group-hover:bg-ocean-200 transition-colors">
            <Activity className="w-4 h-4 text-ocean-600" />
          </div>
          <span className="text-sm font-medium text-navy-700">Vitals</span>
        </Link>
        <Link
          to="/app/timeline"
          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-ivory-300 hover:border-lavender-300 hover:shadow-soft transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-lavender-100 flex items-center justify-center group-hover:bg-lavender-200 transition-colors">
            <Clock className="w-4 h-4 text-lavender-600" />
          </div>
          <span className="text-sm font-medium text-navy-700">Timeline</span>
        </Link>
        <Link
          to="/app/assistant"
          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-ivory-300 hover:border-peach-300 hover:shadow-soft transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-peach-100 flex items-center justify-center group-hover:bg-peach-200 transition-colors">
            <Users className="w-4 h-4 text-peach-600" />
          </div>
          <span className="text-sm font-medium text-navy-700">Assistant</span>
        </Link>
      </div>

      {/* Family Health Cards */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-navy-800">
          Family Health
        </h2>
        <Link
          to="/app/family"
          className="text-sm text-sage-600 hover:text-sage-700 font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {summaries.map((summary) => (
          <ProfileCard key={summary.profile.id} summary={summary} />
        ))}
      </div>

      {/* Medical Safety Notice */}
      <div className="mt-12 text-center text-xs text-navy-300 max-w-lg mx-auto">
        <p>
          HealthThread helps organise and coordinate healthcare information.
          It does not provide medical diagnosis or emergency medical services.
        </p>
      </div>
    </div>
  );
}
