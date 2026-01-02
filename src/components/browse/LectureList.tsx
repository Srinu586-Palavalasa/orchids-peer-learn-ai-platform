"use client";

import React from 'react';
import { categories } from '@/lib/data';

export default function LectureList({ subjectName }: { subjectName?: string | null }) {
  if (!subjectName) return null;
  if (!categories || !Array.isArray(categories)) return null;

  const subj = categories.flatMap(c => c.subjects || []).find(s => s?.name === subjectName || s?.id === subjectName);

  if (!subj) return (
    <div className="text-sm text-muted-foreground">No lecture data available for this subject.</div>
  );

  const topics: string[] = (subj as any).topics || [];
  const lecturesCount = (subj as any).lectures || 0;

  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm text-muted-foreground">Topics</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {topics.length ? topics.map((t, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-md bg-secondary/30 border border-white/5">{t}</span>
          )) : <span className="text-xs text-muted-foreground">No topics listed</span>}
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">Lectures</div>
        <div className="mt-2">
          <div className="text-sm">{lecturesCount} structured lectures available</div>
        </div>
      </div>
    </div>
  );
}
