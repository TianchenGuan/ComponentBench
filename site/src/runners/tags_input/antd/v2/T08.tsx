'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Select, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const suggestions = ['latency', 'paging', 'ops', 'noisy', 'error', 'retry', 'backend'];

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

export default function T08({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overviewTags, setOverviewTags] = useState<string[]>(['summary']);
  const [alertTags, setAlertTags] = useState<string[]>(['generic']);
  const [pagerTags, setPagerTags] = useState<string[]>(['oncall', 'primary']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(alertTags, ['error', 'retry', 'backend']) &&
      setsEqual(overviewTags, ['summary']) &&
      setsEqual(pagerTags, ['oncall', 'primary'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [alertTags, overviewTags, pagerTags, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <div
        ref={scrollRef}
        style={{
          width: 340,
          maxHeight: 380,
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: 16,
        }}
      >
        <Text strong style={{ display: 'block', marginBottom: 16 }}>Alert Configuration</Text>

        <div style={{ marginBottom: 16 }}>
          <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Overview tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            value={overviewTags}
            onChange={setOverviewTags}
            tokenSeparators={[',']}
            open={false}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Alert tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            value={alertTags}
            onChange={setAlertTags}
            options={suggestions.map(s => ({ label: s, value: s }))}
            tokenSeparators={[',']}
            getPopupContainer={() => scrollRef.current || document.body}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Pager tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            value={pagerTags}
            onChange={setPagerTags}
            tokenSeparators={[',']}
            open={false}
          />
        </div>
      </div>
    </div>
  );
}
