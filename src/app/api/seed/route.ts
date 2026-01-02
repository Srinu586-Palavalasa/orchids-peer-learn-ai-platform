import { NextResponse } from 'next/server';
import { categories } from '@/lib/data';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

// POST /api/seed?key=XXXX or set SEED_KEY env var
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const providedKey = url.searchParams.get('key') || request.headers.get('x-seed-key') || '';
    const envKey = process.env.SEED_KEY || '';

    if (envKey && providedKey !== envKey) {
      return new NextResponse(JSON.stringify({ error: 'forbidden' }), { status: 403 });
    }

    // Seed categories collection
    const seeded: string[] = [];
    for (const c of categories) {
      const ref = doc(db, 'categories', c.id);
      await setDoc(ref, c);
      seeded.push(`category:${c.id}`);
    }

    // Also seed a lightweight mentors collection derived from category subjects
    const mentorsCol = collection(db, 'mentors');
    const seen = new Map<string, { name: string; rating?: number; subjects: string[]; hoursTaught: number }>();
    for (const c of categories) {
      for (const s of c.subjects) {
        const lectureCount = s.lectures || 0;
        if (s.mentors && s.mentors.length) {
          for (const m of s.mentors) {
            const key = m.name;
            if (!seen.has(key)) {
              seen.set(key, { name: m.name, rating: m.rating || 0, subjects: [s.name], hoursTaught: lectureCount });
            } else {
              const ex = seen.get(key)!;
              ex.subjects.push(s.name);
              ex.hoursTaught = (ex.hoursTaught || 0) + lectureCount;
            }
          }
        }
      }
    }

    // Persist mentors with computed hours and certifications
    for (const [, info] of seen) {
      const certifications: string[] = [];
      if ((info.hoursTaught || 0) >= 10) certifications.push('Master Mentor');
      else if ((info.hoursTaught || 0) >= 5) certifications.push('Certified Mentor');

      await addDoc(mentorsCol, {
        name: info.name,
        rating: info.rating || 0,
        subjects: info.subjects,
        hoursTaught: info.hoursTaught || 0,
        certifications
      });
      seeded.push(`mentor:${info.name}`);
    }

    return NextResponse.json({ success: true, seeded });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}

export const GET = () => new NextResponse(JSON.stringify({ ok: true, info: 'POST to seed' }));
