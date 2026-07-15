import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, ArrowRight, Activity, Pill } from 'lucide-react';
import { useData } from '../data/DataContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { HealthProfile } from '../types';

export function FamilyPage() {
  const data = useData();
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profs = await data.getProfiles();
        setProfiles(profs);
      } catch (err) {
        console.error('Failed to load profiles:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-sage-600" />
            Family Members
          </h1>
          <p className="text-navy-500 mt-1">Manage health records for your loved ones.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Add Member</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Link key={profile.id} to={`/app/family/${profile.id}`}>
            <Card hover className="h-full flex flex-col group">
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-xl flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {profile.fullName.split(' ').map(n => n[0]).join('').substring(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-lg text-navy-800 truncate group-hover:text-sage-700 transition-colors">
                    {profile.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-navy-500 capitalize">{profile.relationship}</span>
                    <span className="w-1 h-1 rounded-full bg-ivory-300" />
                    <span className="text-sm text-navy-500">{profile.bloodGroup || 'No Blood Group'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-ivory-100 flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-navy-600">
                    <Activity className="w-4 h-4 text-ocean-500" />
                    <span>Vitals</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-navy-600">
                    <Pill className="w-4 h-4 text-peach-500" />
                    <span>Meds</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-navy-300 group-hover:text-sage-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        ))}

        {/* Empty state / add new card */}
        <button className="h-full min-h-[200px] border-2 border-dashed border-ivory-300 rounded-2xl flex flex-col items-center justify-center text-navy-400 hover:text-sage-600 hover:border-sage-300 hover:bg-sage-50/50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-ivory-100 group-hover:bg-sage-100 flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium font-heading">Add Family Member</span>
        </button>
      </div>
    </div>
  );
}
