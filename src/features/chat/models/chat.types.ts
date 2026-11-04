export type ChatEvent =
  | { type: 'TOOL_START'; tool: string }
  | { type: 'TOOL_END'; tool: string; ok: boolean }
  | { type: 'TEXT_DELTA'; text: string }
  | { type: 'ERROR'; text: string }
  | { type: 'DONE' };

export interface ToolStep {
  tool: string;
  status: 'running' | 'done' | 'failed';
}

export type MessagePart = { kind: 'text'; text: string } | { kind: 'tool'; step: ToolStep };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  parts: MessagePart[];
  status: 'streaming' | 'done' | 'stopped' | 'error';
  errorText?: string;
}
