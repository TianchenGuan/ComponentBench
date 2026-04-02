'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Select, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const suggestions = ['ops', 'nightly', 'qa', 'docs', 'rollback', 'release', 'backend'];

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

export default function T05({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [deployTags, setDeployTags] = useState<string[]>(['backend', 'ops', 'nightly']);
  const [auditTags, setAuditTags] = useState<string[]>(['archived', 'read-only']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(deployTags, ['backend', 'release', 'nightly']) &&
      setsEqual(auditTags, ['archived', 'read-only'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [deployTags, auditTags, onSuccess]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
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
        <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Deployment tags</Text>
        <Select
          mode="tags"
          size="small"
          style={{ width: '100%' }}
          value={deployTags}
          onChange={setDeployTags}
          options={suggestions.map(s => ({ label: s, value: s }))}
          maxTagCount={1}
          tokenSeparators={[',']}
        />
      </div>
      <div>
        <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Audit tags</Text>
        <Select
          mode="tags"
          size="small"
          style={{ width: '100%' }}
          value={auditTags}
          onChange={setAuditTags}
          tokenSeparators={[',']}
          open={false}
        />
      </div>
    </div>
  );
}
