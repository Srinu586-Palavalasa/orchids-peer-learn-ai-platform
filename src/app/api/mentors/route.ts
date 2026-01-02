import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { categories as staticCategories } from '@/lib/data';

export async function GET() {
  try {
    try {
      const col = collection(db, 'mentors');
      const snap = await getDocs(col);
      if (!snap.empty) {
        const docs: any[] = [];
        snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
        return NextResponse.json({ mentors: docs });
      }
    } catch (e) {
      // ignore firestore errors
    }

    // fallback: derive mentors from static categories and compute hours taught
    const mentors: any[] = [];
    const seen = new Map<string, any>();
    for (const c of staticCategories) {
      for (const s of c.subjects) {
        const lectureCount = s.lectures || 0;
        if (s.mentors) {
          for (const m of s.mentors) {
            const key = m.name;
            if (!seen.has(key)) {
              seen.set(key, { name: m.name, rating: m.rating || 0, subjects: [s.name], hoursTaught: lectureCount });
            } else {
              const existing = seen.get(key);
              existing.subjects.push(s.name);
              existing.hoursTaught = (existing.hoursTaught || 0) + lectureCount;
            }
          }
        }
      }
    }

    for (const [, v] of seen) {
      const certifications: string[] = [];
      if ((v.hoursTaught || 0) >= 10) certifications.push('Master Mentor');
      else if ((v.hoursTaught || 0) >= 5) certifications.push('Certified Mentor');
      mentors.push({ ...v, certifications });
    }

    return NextResponse.json({ mentors });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
