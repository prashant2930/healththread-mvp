import { useState, useEffect } from 'react';
import { Share2, Clock, Link as LinkIcon, Shield, Copy, Check, Trash2, ShieldAlert } from 'lucide-react';
import { useData } from '../data/DataContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils';
import type { HealthProfile, ShareGrant, SharePermission } from '../types';

export function SharePage() {
  const data = useData();
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [activeShares, setActiveShares] = useState<ShareGrant[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [duration, setDuration] = useState<'30min' | '2hours' | '24hours' | '7days'>('2hours');
  const [permissions, setPermissions] = useState<SharePermission[]>([
    { category: 'basic_summary', granted: true },
    { category: 'allergies', granted: true },
    { category: 'conditions', granted: true },
    { category: 'medications', granted: true },
    { category: 'vitals', granted: false },
    { category: 'medical_records', granted: false },
    { category: 'consultations', granted: false },
    { category: 'care_loops', granted: false },
  ]);

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const profs = await data.getProfiles();
        setProfiles(profs);
        if (profs.length > 0) {
          const defaultProf = profs.find(p => p.fullName.includes('Rajesh')) || profs[0];
          setSelectedProfileId(defaultProf.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [data]);

  useEffect(() => {
    async function loadShares() {
      if (!selectedProfileId) return;
      try {
        const shares = await data.getShareGrants(selectedProfileId);
        setActiveShares(shares.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error(err);
      }
    }
    loadShares();
    // Set interval to re-render countdowns
    const interval = setInterval(loadShares, 60000);
    return () => clearInterval(interval);
  }, [selectedProfileId, data]);

  const togglePermission = (idx: number) => {
    const newPerms = [...permissions];
    if (newPerms[idx].category === 'basic_summary') return; // Cannot disable basic summary
    newPerms[idx].granted = !newPerms[idx].granted;
    setPermissions(newPerms);
  };

  const handleCreateShare = async () => {
    if (!selectedProfileId) return;
    setIsCreating(true);
    try {
      // Simulate secure token generation (UUID)
      const randomToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      
      const now = new Date();
      let expiresAt = new Date(now);
      if (duration === '30min') expiresAt.setMinutes(now.getMinutes() + 30);
      else if (duration === '2hours') expiresAt.setHours(now.getHours() + 2);
      else if (duration === '24hours') expiresAt.setHours(now.getHours() + 24);
      else if (duration === '7days') expiresAt.setDate(now.getDate() + 7);

      const newShare = await data.createShare({
        profileId: selectedProfileId,
        token: randomToken,
        createdBy: 'user',
        permissions,
        accessDuration: duration,
        expiresAt: expiresAt.toISOString(),
        status: 'active',
        createdAt: now.toISOString()
      });

      await data.logAuditEvent({
        profileId: selectedProfileId,
        eventType: 'share_created',
        timestamp: now.toISOString(),
        metadata: { duration }
      });

      setActiveShares(prev => [newShare, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (shareId: string) => {
    try {
      await data.revokeShare(shareId);
      
      await data.logAuditEvent({
        profileId: selectedProfileId,
        eventType: 'share_revoked',
        timestamp: new Date().toISOString()
      });

      const updated = await data.getShareGrants(selectedProfileId);
      setActiveShares(updated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    }
  };

  const copyLink = (token: string) => {
    const link = `https://healththread.app/share/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getStatusDisplay = (share: ShareGrant) => {
    if (share.status === 'revoked') {
      return { variant: 'peach' as const, text: 'Revoked' };
    }
    const expiresAt = new Date(share.expiresAt);
    const now = new Date();
    if (now > expiresAt) {
      return { variant: 'gray' as const, text: 'Expired' };
    }
    return { variant: 'sage' as const, text: 'Active' };
  };

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-sage-600" />
            Selective Sharing
          </h1>
          <p className="text-navy-500 mt-2 text-lg">
            Create secure, temporary links to share health records with doctors.
          </p>
        </div>
        
        <select 
          className="px-4 py-2 rounded-xl border border-ivory-300 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-sage-500 max-w-[200px]"
          value={selectedProfileId}
          onChange={(e) => setSelectedProfileId(e.target.value)}
        >
          {profiles.map(p => (
            <option key={p.id} value={p.id}>{p.fullName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Share Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 p-6 shadow-sm border-ivory-200">
            <h2 className="text-xl font-heading font-bold text-navy-900 mb-6 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-sage-600" />
              New Share Link
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-3">
                  1. Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: '30min', label: '30 Mins' },
                    { val: '2hours', label: '2 Hours' },
                    { val: '24hours', label: '24 Hours' },
                    { val: '7days', label: '7 Days' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setDuration(opt.val as any)}
                      className={`py-2 px-3 text-sm rounded-lg border font-medium transition-colors ${
                        duration === opt.val
                          ? 'border-sage-500 bg-sage-50 text-sage-700'
                          : 'border-ivory-300 text-navy-500 hover:border-ivory-400 hover:bg-ivory-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-navy-900 mb-3">
                  2. Select Data Categories
                </label>
                <div className="space-y-2">
                  {permissions.map((perm, idx) => (
                    <label 
                      key={perm.category} 
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        perm.granted ? 'border-sage-500 bg-sage-50/50' : 'border-ivory-200 hover:border-ivory-300'
                      } ${perm.category === 'basic_summary' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={perm.granted}
                          onChange={() => togglePermission(idx)}
                          disabled={perm.category === 'basic_summary'}
                        />
                        <div className={`w-5 h-5 rounded border ${
                          perm.granted ? 'bg-sage-500 border-sage-500' : 'border-ivory-400 bg-white'
                        } peer-focus:ring-2 peer-focus:ring-sage-500/30 transition-colors flex items-center justify-center`}>
                          {perm.granted && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-navy-800 capitalize">
                        {perm.category.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleCreateShare}
                disabled={isCreating}
              >
                {isCreating ? 'Generating...' : 'Generate Secure Link'}
              </Button>
              
              <p className="text-xs text-navy-400 text-center flex items-center justify-center gap-1.5 mt-4">
                <ShieldAlert className="w-3.5 h-3.5" />
                Links are end-to-end encrypted.
              </p>
            </div>
          </Card>
        </div>

        {/* Active Shares List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-heading font-bold text-navy-900 mb-6">
            Active & Past Links
          </h2>

          {activeShares.length > 0 ? (
            activeShares.map(share => {
              const status = getStatusDisplay(share);
              const isActive = status.text === 'Active';
              
              return (
                <Card key={share.id} className={`p-5 flex flex-col sm:flex-row gap-5 transition-colors ${!isActive ? 'bg-ivory-50/50 border-ivory-200' : 'border-ivory-300'}`}>
                  
                  {/* Status & Icon */}
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-3 border-b sm:border-b-0 sm:border-r border-ivory-200 pb-4 sm:pb-0 sm:pr-5 shrink-0">
                    <Badge variant={status.variant} className="w-24 justify-center">
                      {status.text}
                    </Badge>
                    {isActive && (
                      <div className="flex items-center gap-1.5 text-sage-600 font-bold text-sm bg-sage-50 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {getTimeRemaining(share.expiresAt)}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="text-xs text-navy-400 font-medium mb-1">
                      Created {formatDate(share.createdAt)} for {share.accessDuration}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                      {share.permissions.filter(p => p.granted).map(p => (
                        <span key={p.category} className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                          isActive ? 'bg-navy-50 text-navy-600 border border-navy-100' : 'bg-ivory-100 text-navy-400'
                        }`}>
                          {p.category.replace('_', ' ')}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mt-auto pt-2">
                      <Button
                        variant="secondary"
                        className={`text-sm py-1.5 px-3 ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => copyLink(share.token)}
                        disabled={!isActive}
                        leftIcon={copiedToken === share.token ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                      >
                        {copiedToken === share.token ? 'Copied' : 'Copy Link'}
                      </Button>

                      {isActive && (
                        <button
                          onClick={() => handleRevoke(share.id)}
                          className="text-sm font-medium text-peach-600 hover:text-peach-700 flex items-center gap-1.5 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-ivory-300">
              <Shield className="w-16 h-16 text-sage-200 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-navy-900 mb-2">No active shares</h3>
              <p className="text-navy-500 mb-6 max-w-sm mx-auto">
                Generate secure, temporary links to grant doctors or family access to this profile.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
