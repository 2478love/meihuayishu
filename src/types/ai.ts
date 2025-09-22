export interface AiInsight {
  id: string;
  content: string;
  generatedAt: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AiChatTurn {
  role: 'user' | 'assistant';
  content: string;
}
