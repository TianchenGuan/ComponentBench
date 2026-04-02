'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

function setsEqual(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.toLowerCase().trim()));
  const sb = new Set(b.map(s => s.toLowerCase().trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [internalTags, setInternalTags] = useState<string[]>(['internal', 'private']);
  const [publicTags, setPublicTags] = useState<string[]>(['first', 'second', 'third']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(publicTags, ['first', 'second', 'final']) &&
      setsEqual(internalTags, ['internal', 'private'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [publicTags, internalTags, onSuccess]);

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 280,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: 16,
      }}
    >
      <Text fw={600} size="sm" mb="md">Settings</Text>

      <TagsInput
        label="Internal labels"
        size="xs"
        value={internalTags}
        onChange={setInternalTags}
        mb="sm"
      />

      <TagsInput
        label="Public labels"
        size="xs"
        value={publicTags}
        onChange={setPublicTags}
        maxTags={3}
      />
    </Box>
  );
}
