'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Select, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

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

export default function T03({ onSuccess }: TaskComponentProps) {
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
    <div
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
      <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>Settings</Text>
      <div style={{ marginBottom: 12 }}>
        <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Internal labels</Text>
        <Select
          mode="tags"
          size="small"
          style={{ width: '100%' }}
          value={internalTags}
          onChange={setInternalTags}
          tokenSeparators={[',']}
          open={false}
        />
      </div>
      <div>
        <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Public labels</Text>
        <Select
          mode="tags"
          size="small"
          style={{ width: '100%' }}
          value={publicTags}
          onChange={setPublicTags}
          maxCount={3}
          tokenSeparators={[',']}
          open={false}
        />
      </div>
    </div>
  );
}
