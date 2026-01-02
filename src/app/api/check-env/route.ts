import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasServerKey = !!process.env.GEMINI_API_KEY;
    const hasPublicKey = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const serverKeyMasked = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/.(?=.{4})/g, '*') : null;
    return NextResponse.json({ ok: true, hasServerKey, hasPublicKey, serverKeyMasked });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
