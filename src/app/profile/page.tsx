"use client";

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, User, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, userProfile } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold">
            {user.displayName ? user.displayName.split(' ').map(n=>n[0]).slice(0,2).join('') : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1 rounded-full">
                <Star size={16} className="text-yellow-400" />
                <span className="text-sm font-semibold">4.8</span>
                <span className="text-xs text-muted-foreground">rating</span>
              </div>
              <div className="text-sm text-muted-foreground">Mentor since 2024</div>
            </div>
          </div>
          <div className="ml-auto">
            <button className="btn btn-outline flex items-center gap-2" onClick={() => { logout(); router.push('/(auth)/login'); }}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-secondary/40 border border-white/5">
            <div className="text-xs text-muted-foreground">Sessions Hosted</div>
            <div className="text-2xl font-bold mt-2">{userProfile?.sessions || 12}</div>
          </div>
          <div className="p-4 rounded-2xl bg-secondary/40 border border-white/5">
            <div className="text-xs text-muted-foreground">Students Helped</div>
            <div className="text-2xl font-bold mt-2">{userProfile?.students || 120}</div>
          </div>
          <div className="p-4 rounded-2xl bg-secondary/40 border border-white/5">
            <div className="text-xs text-muted-foreground">Favorite Subject</div>
            <div className="text-2xl font-bold mt-2">{userProfile?.favorite || 'Mathematics'}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-sm text-muted-foreground">{userProfile?.bio || 'Passionate about peer teaching and helping others learn.'}</p>
        </div>
      </div>
    </div>
  );
}
