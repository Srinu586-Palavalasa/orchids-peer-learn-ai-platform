import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { categories as staticCategories } from '@/lib/data';

export async function GET() {
  try {
    // Try to read from Firestore; if it fails, return static data
    try {
      const col = collection(db, 'categories');
      const snap = await getDocs(col);
      if (!snap.empty) {
        const docs: any[] = [];
        snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
        return NextResponse.json({ categories: docs });
      }
    } catch (e) {
      // ignore firestore errors and fallback
    }

    return NextResponse.json({ categories: staticCategories });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
