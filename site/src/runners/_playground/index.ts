import type React from 'react';

// Auto-discovered at runtime
export const PLAYGROUND_TASKS: Record<
  string,
  () => Promise<{ default: React.ComponentType<unknown> }>
> = {};
