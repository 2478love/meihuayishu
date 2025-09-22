import { createHash } from 'crypto';

type Role = 'system' | 'user' | 'assistant';

export interface AiMessage {
  role: Role;
  content: string;
}

export interface AiCallOptions {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface AiCallResult {
  id: string;
  content: string;
  raw?: AiProviderResponse;
}

interface AiProviderContentChunk {
  type?: string;
  text?: string;
}

interface AiProviderMessage {
  content?: string | AiProviderContentChunk[];
}

interface AiProviderChoice {
  message?: AiProviderMessage;
}

interface AiProviderResponse {
  id?: string;
  choices?: AiProviderChoice[];
  output_text?: string;
}

const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_TIMEOUT = Number(process.env.AI_TIMEOUT_MS ?? 30000);
const DEFAULT_PATH = process.env.AI_COMPLETIONS_PATH || 'chat/completions';

const baseUrl = process.env.AI_API_BASE_URL;
const apiKey = process.env.AI_API_KEY;
const model = process.env.AI_MODEL;

function assertEnv(name: string, value: string | undefined): asserts value {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

function buildUrl(): string {
  assertEnv('AI_API_BASE_URL', baseUrl);

  const normalizedBase = baseUrl!.replace(/\/$/, '');
  const normalizedPath = `/${DEFAULT_PATH.replace(/^\//, '')}`;

  return `${normalizedBase}${normalizedPath}`;
}

export async function callAi(messages: AiMessage[], options: AiCallOptions = {}): Promise<AiCallResult> {
  assertEnv('AI_API_BASE_URL', baseUrl);
  assertEnv('AI_API_KEY', apiKey);
  assertEnv('AI_MODEL', model);

  const url = buildUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: options.temperature ?? DEFAULT_TEMPERATURE,
        max_tokens: options.maxTokens,
        messages,
      }),
      signal: options.signal ?? controller.signal,
    });

    if (!response.ok) {
      const errorText = await safeReadBody(response);
      throw new Error(`AI provider error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as AiProviderResponse;
    const content = extractContent(data);

    return {
      id: data?.id || hashMessages(messages),
      content,
      raw: data,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function safeReadBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '[unable to read error payload]';
  }
}

function extractContent(data: AiProviderResponse): string {
  if (typeof data?.output_text === 'string' && data.output_text.trim().length > 0) {
    return data.output_text.trim();
  }

  const firstChoice = data?.choices?.[0];
  const messageContent = firstChoice?.message?.content;

  if (typeof messageContent === 'string') {
    return messageContent.trim();
  }

  if (Array.isArray(messageContent)) {
    return messageContent
      .map((chunk: AiProviderContentChunk) => chunk?.text ?? '')
      .join('')
      .trim();
  }

  throw new Error('Unexpected response format from AI provider');
}

function hashMessages(messages: AiMessage[]): string {
  const hash = createHash('sha256');
  messages.forEach(msg => {
    hash.update(msg.role);
    hash.update('::');
    hash.update(msg.content);
    hash.update('\n');
  });
  return hash.digest('hex').slice(0, 24);
}
