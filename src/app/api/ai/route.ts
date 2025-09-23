export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { callAi } from '@/lib/ai';
import { buildChatMessages, buildInsightMessages } from '@/lib/aiPrompts';
import { DivinationResult } from '@/types';
import { AiChatTurn } from '@/types/ai';

interface AiRequestBody {
  mode: 'insight' | 'chat';
  result: DivinationResult;
  question?: string;
  history?: AiChatTurn[];
  userInput?: string;
}

export async function POST(request: Request) {
  let payload: AiRequestBody;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!payload.mode) {
    return NextResponse.json({ error: 'Missing mode' }, { status: 400 });
  }

  if (!payload.result) {
    return NextResponse.json({ error: 'Missing result context' }, { status: 400 });
  }

  if (payload.mode === 'chat' && !payload.userInput?.trim()) {
    return NextResponse.json({ error: 'Missing userInput for chat mode' }, { status: 400 });
  }

  try {
    const hydratedResult = hydrateResult(payload.result);

    const messages = payload.mode === 'insight'
      ? buildInsightMessages(hydratedResult, payload.question)
      : buildChatMessages(
        hydratedResult,
        payload.history || [],
        payload.userInput || ''
      );

    const aiResponse = await callAi(messages);

    return NextResponse.json({
      id: aiResponse.id,
      content: aiResponse.content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function hydrateResult(raw: DivinationResult): DivinationResult {
  return {
    ...raw,
    method: raw.method || '未记录起卦方式',
    detailLines: raw.detailLines || [],
    seeds: raw.seeds || { upper: 0, lower: 0, changing: 0 },
    time: new Date(raw.time),
    mutualHexagram: raw.mutualHexagram || undefined,
    changingHexagram: raw.changingHexagram || undefined,
  };
}
