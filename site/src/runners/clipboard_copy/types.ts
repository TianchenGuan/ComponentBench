import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific clipboard copy components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Helper to copy text to clipboard and track the last copied value
 * Also exposes the value on window for programmatic checking
 */
export const copyToClipboard = async (text: string, sourceLabel?: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    // Expose for programmatic checking by benchmark
    if (typeof window !== 'undefined') {
      (window as unknown as { __lastClipboardWrite?: string; __lastCopySourceLabel?: string }).__lastClipboardWrite = text;
      if (sourceLabel) {
        (window as unknown as { __lastCopySourceLabel?: string }).__lastCopySourceLabel = sourceLabel;
      }
    }
    return true;
  } catch {
    // Fallback for older browsers or when clipboard API is blocked
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      if (typeof window !== 'undefined') {
        (window as unknown as { __lastClipboardWrite?: string; __lastCopySourceLabel?: string }).__lastClipboardWrite = text;
        if (sourceLabel) {
          (window as unknown as { __lastCopySourceLabel?: string }).__lastCopySourceLabel = sourceLabel;
        }
      }
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

/**
 * Track last confirm action for require_confirm tasks
 */
export const trackConfirmAction = (actionLabel: string): void => {
  if (typeof window !== 'undefined') {
    (window as unknown as { __lastConfirmAction?: string }).__lastConfirmAction = actionLabel;
  }
};
