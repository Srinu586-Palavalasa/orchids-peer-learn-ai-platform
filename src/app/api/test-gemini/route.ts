import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/app/actions/chat';

export async function GET() {
  try {
    const history = [{ role: 'user' as const, parts: 'Hello' }];
    const message = 'Say a short hello message and your name.';
    const resp = await getGeminiResponse(history, message);
    return NextResponse.json({ ok: true, resp });
  } catch (err: any) {
    console.error('test-gemini error', err);
    return new NextResponse(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
