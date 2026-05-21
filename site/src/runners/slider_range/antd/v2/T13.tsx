'use client';

/**
 * slider_range-antd-v2-T13: Streaming section below the fold — nested scroll + Apply section
 *
 * Success: committed Buffer 2–6 s, Retry 3–7 s, after Apply section.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T13({ onSuccess }: TaskComponentProps) {
  const [pendingBuf, setPendingBuf] = useState<[number, number]>([1, 4]);
  const [pendingRetry, setPendingRetry] = useState<[number, number]>([3, 7]);
  const [committedBuf, setCommittedBuf] = useState<[number, number]>([1, 4]);
  const [committedRetry, setCommittedRetry] = useState<[number, number]>([3, 7]);

  useEffect(() => {
    if (
      committedBuf[0] === 2 &&
      committedBuf[1] === 6 &&
      committedRetry[0] === 3 &&
      committedRetry[1] === 7
    ) {
      onSuccess();
    }
  }, [committedBuf, committedRetry, onSuccess]);

  const applySection = () => {
    setCommittedBuf(pendingBuf);
    setCommittedRetry(pendingRetry);
  };

  return (
    <div
      style={{
        maxHeight: 380,
        overflowY: 'auto',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 12,
        background: '#fafafa',
      }}
    >
      <Text strong style={{ display: 'block', marginBottom: 12 }}>
        Dashboard
      </Text>
      <Card size="small" style={{ marginBottom: 12 }}>
        <Text type="secondary">Overview metrics · scroll down for settings</Text>
      </Card>
      <div style={{ height: 120, marginBottom: 12, background: '#fff', borderRadius: 6, border: '1px solid #eee' }} />

      <Card size="small" title="Settings panel" styles={{ body: { maxHeight: 220, overflowY: 'auto', padding: 12 } }}>
        <Text strong>General</Text>
        <div style={{ height: 80, marginBottom: 16, background: '#f9f9f9', borderRadius: 4 }} />
        <Text strong>Networking</Text>
        <div style={{ height: 80, marginBottom: 16, background: '#f9f9f9', borderRadius: 4 }} />

        <Text strong>Streaming</Text>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
          Committed: Buffer {committedBuf[0]}–{committedBuf[1]} s · Retry {committedRetry[0]}–{committedRetry[1]} s
        </Text>

        <Text style={{ display: 'block', marginBottom: 8 }}>Buffer range (s)</Text>
        <Slider
          range
          min={0}
          max={10}
          step={1}
          value={pendingBuf}
          onChange={(v) => setPendingBuf(v as [number, number])}
          data-testid="buffer-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, marginBottom: 20, fontSize: 12 }}>
          Pending: {pendingBuf[0]} – {pendingBuf[1]} s
        </Text>

        <Text style={{ display: 'block', marginBottom: 8 }}>Retry window (s)</Text>
        <Slider
          range
          min={0}
          max={10}
          step={1}
          value={pendingRetry}
          onChange={(v) => setPendingRetry(v as [number, number])}
          data-testid="retry-window-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, marginBottom: 12, fontSize: 12 }}>
          Pending: {pendingRetry[0]} – {pendingRetry[1]} s
        </Text>

        <Button type="primary" size="small" onClick={applySection}>
          Apply section
        </Button>
      </Card>
    </div>
  );
}
