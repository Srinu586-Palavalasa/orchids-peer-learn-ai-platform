import { NextResponse, NextRequest } from 'next/server';
import { getGeminiResponse } from '@/app/actions/chat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const history = body.history ?? [
      { role: 'user', parts: 'Hello' }
    ];

    const message =
      body.message ?? 'Say a short hello message and your name.';

    const resp = await getGeminiResponse(history, message);

    return NextResponse.json({
      ok: true,
      data: resp,
    });
  } catch (err) {
    console.error('test-gemini error:', err);
    const message = (err as any)?.message ?? String(err ?? 'Internal Server Error');

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
