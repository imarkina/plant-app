import { Check, Loader2, X } from 'lucide-react';
import type { ToolStep } from '../models/chat.types';
import { toolLabel } from '../models/tool-labels';

const STATUS_TEXT_CLASSES: Record<ToolStep['status'], string> = {
  running: 'text-text-secondary',
  done: 'text-brand-lime',
  failed: 'text-danger',
};

export const ToolStepIndicator = ({ step }: { step: ToolStep }) => {
  return (
    <div
      className={`inline-flex animate-message-in items-center gap-1.5 self-start rounded-full border border-surface-glass-border bg-surface-glass px-3 py-1.5 text-caption font-medium backdrop-blur-xl backdrop-saturate-150 ${STATUS_TEXT_CLASSES[step.status]}`}
    >
      {step.status === 'running' && <Loader2 size={13} className="animate-spin" />}
      {step.status === 'done' && <Check size={13} />}
      {step.status === 'failed' && <X size={13} />}
      {toolLabel(step.tool)}
    </div>
  );
};
