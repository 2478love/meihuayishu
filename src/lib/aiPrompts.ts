import { AiChatTurn } from '@/types/ai';
import { DivinationResult } from '@/types';
import { AiMessage } from './ai';

const defaultSystemPrompt = '你是一位精通梅花易数的占卜专家，擅长将传统卦象与现代生活结合，使用自然的中文解释结果。';

function getSystemPrompt(): string {
  return process.env.AI_SYSTEM_PROMPT || defaultSystemPrompt;
}

export function buildInsightMessages(result: DivinationResult, customQuestion?: string): AiMessage[] {
  const systemPrompt = getSystemPrompt();

  const contextLines = [
    `主卦：${result.mainHexagram.number} ${result.mainHexagram.name} (${result.mainHexagram.symbol})`,
    `主卦含义：${result.mainHexagram.meaning}`,
    `主卦描述：${result.mainHexagram.description}`,
    `动爻位置：第${result.changingLine}爻`,
  ];

  if (result.mutualHexagram) {
    contextLines.push(
      `互卦：${result.mutualHexagram.number} ${result.mutualHexagram.name} - ${result.mutualHexagram.meaning}`
    );
  }

  if (result.changedHexagram) {
    contextLines.push(
      `变卦：${result.changedHexagram.number} ${result.changedHexagram.name} (${result.changedHexagram.symbol})`,
      `变卦含义：${result.changedHexagram.meaning}`
    );
  }

  contextLines.push(`系统内置解释：${result.interpretation}`);

  const focus = customQuestion?.trim() ? customQuestion.trim() : '请结合卦象给出整体判断、关键启示以及可执行建议。';

  const userContent = [
    '以下是一次梅花易数起卦的结果，请依据信息进行专业解读：',
    contextLines.join('\n'),
    '',
    '输出格式要求：',
    '1. 《卦象概览》：简述主卦主旨与整体走势（约80字以内）。',
    '2. 《动爻洞察》：解释动爻与互卦/变卦的关系，强调变化信号。',
    '3. 《实用建议》：给出3条结合现代生活场景的建议，使用编号列表。',
    `4. 《针对性提示》：${focus}`,
  ].join('\n');

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ];
}

export function buildChatMessages(
  result: DivinationResult,
  history: AiChatTurn[],
  userInput: string,
): AiMessage[] {
  const systemPrompt = getSystemPrompt();

  const snapshot = [
    `主卦：${result.mainHexagram.number} ${result.mainHexagram.name} (${result.mainHexagram.symbol})`,
    result.changedHexagram
      ? `变卦：${result.changedHexagram.number} ${result.changedHexagram.name}`
      : '变卦：无（或未形成）',
    result.mutualHexagram
      ? `互卦：${result.mutualHexagram.number} ${result.mutualHexagram.name}`
      : '互卦：无',
    `动爻：第${result.changingLine}爻`,
    `系统解读：${result.interpretation}`,
  ].join('\n');

  const messages: AiMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content:
        '记录当前卦象关键信息，后续对话无需重复描述，仅在需要时引用：\n' +
        snapshot,
    },
    { role: 'assistant', content: '已记录卦象要点，后续对话将据此给出建议。' },
  ];

  history.forEach(turn => {
    messages.push({ role: turn.role, content: turn.content });
  });

  messages.push({ role: 'user', content: userInput });

  return messages;
}
