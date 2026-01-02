"use client";

import React, { useEffect, useState } from 'react';
import { Medal } from 'lucide-react';

interface Mentor {
  name: string;
  rating?: number;
  subject?: string;
  hoursTaught?: number;
  subjects?: string[];
  certifications?: string[];
}

export default function MentorList() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/mentors')
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        setMentors(data.mentors || []);
      })
      .catch(() => {
        if (!mounted) return;
        setMentors([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading mentors...</div>;
  if (!mentors.length) return <div className="text-sm text-muted-foreground">No mentors available.</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Featured Mentors</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.slice(0,6).map((m, i) => (
          <div key={i} className="p-4 rounded-lg bg-card border border-border flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">{m.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.subject || (m.subjects ? m.subjects.join(', ') : 'Various')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.certifications && m.certifications.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Medal size={16} className="text-yellow-400" />
                    <div className="flex flex-col">
                      {m.certifications.map((c, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-white/5 to-white/3 text-white">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-sm text-yellow-400 font-semibold">{m.rating ?? '—'}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Quick bio and availability will appear here.</div>
            <div className="mt-2">
              <button
                className="btn btn-primary w-full"
                onClick={() => {
                  try {
                    window.dispatchEvent(new CustomEvent('orchids-select-mentor', { detail: m }));
                  } catch (e) {
                    // noop
                  }
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
