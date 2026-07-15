import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { MedicationLog, ShareGrant } from '../types';

export function formatDate(dateString: string, formatStr = 'MMM d, yyyy') {
  if (!dateString) return '';
  return format(parseISO(dateString), formatStr);
}

export function formatDateTime(dateString: string) {
  if (!dateString) return '';
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
}

export function getRelativeTime(dateString: string) {
  if (!dateString) return '';
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

export function generateHTId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'HT-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function generateShareToken() {
  return uuidv4().replace(/-/g, '').substring(0, 16);
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getInitials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function calculateAdherence(logs: MedicationLog[]) {
  if (!logs || logs.length === 0) return { taken: 0, total: 0, percentage: 0 };
  const pastLogs = logs.filter((l) => l.status !== 'pending');
  if (pastLogs.length === 0) return { taken: 0, total: 0, percentage: 0 };
  
  const taken = pastLogs.filter((l) => l.status === 'taken').length;
  const total = pastLogs.length;
  return {
    taken,
    total,
    percentage: Math.round((taken / total) * 100),
  };
}

export function isShareExpired(share: ShareGrant) {
  if (share.status !== 'active') return true;
  return new Date(share.expiresAt) < new Date();
}

export function truncate(str: string, len: number) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
}
