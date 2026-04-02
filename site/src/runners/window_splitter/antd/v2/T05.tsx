'use client';

/**
 * window_splitter-antd-v2-T05: Below-fold Incident triage — Details 32% (±2)
 *
 * High-clutter dashboard; decoy splitter above. Target card id/title "Incident triage".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Splitter, Typography, Progress } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Title, Text } = Typography;

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return [50, 50];
  return raw.map((s) => (s / total) * 100);
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [decoy, setDecoy] = useState<number[]>([55, 45]);
  const [target, setTarget] = useState<number[]>([50, 50]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const details = target[1] / 100;
    if (details >= 0.3 && details <= 0.34) {
      successFired.current = true;
      onSuccess();
    }
  }, [target, onSuccess]);

  return (
    <div
      style={{
        height: 480,
        overflow: 'auto',
        padding: 16,
        background: '#f0f2f5',
        borderRadius: 8,
      }}
      data-testid="dashboard-scroll"
    >
      <Title level={4} style={{ marginTop: 0 }}>
        Fleet overview
      </Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <Card size="small">
          <Text type="secondary">Incidents</Text>
          <div style={{ fontSize: 22, fontWeight: 700 }}>12</div>
        </Card>
        <Card size="small">
          <Text type="secondary">MTTR</Text>
          <div style={{ fontSize: 22, fontWeight: 700 }}>38m</div>
        </Card>
        <Card size="small">
          <Text type="secondary">SLA</Text>
          <div style={{ fontSize: 22, fontWeight: 700 }}>99.2%</div>
        </Card>
      </div>
      <Card size="small" title="Throughput" style={{ marginBottom: 16 }}>
        <Progress percent={72} size="small" />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Synthetic series (non-interactive).
        </Text>
      </Card>

      <Card size="small" title="Quick split (not the task target)" style={{ marginBottom: 20 }}>
        <Splitter
          style={{ height: 140 }}
          onResize={(raw) => setDecoy(normalizePercents(raw))}
        >
          <Splitter.Panel size={decoy[0]} min="20%" max="80%">
            <div style={{ padding: 8, background: '#fafafa', height: '100%' }}>A</div>
          </Splitter.Panel>
          <Splitter.Panel size={decoy[1]}>
            <div style={{ padding: 8, background: '#f5f5f5', height: '100%' }}>B</div>
          </Splitter.Panel>
        </Splitter>
      </Card>

      <div style={{ height: 120 }} />

      <Card
        size="small"
        id="incident-triage-card"
        title="Incident triage"
        data-testid="incident-triage-card"
      >
        <Splitter
          style={{ height: 200, boxShadow: '0 0 4px rgba(0,0,0,0.06)' }}
          onResize={(raw) => setTarget(normalizePercents(raw))}
        >
          <Splitter.Panel min="15%" max="85%" size={target[0]}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
              }}
            >
              <Text strong>Queue</Text>
            </div>
          </Splitter.Panel>
          <Splitter.Panel size={target[1]}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f0f0f0',
              }}
            >
              <Text strong>Details</Text>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 8, textAlign: 'center', fontSize: 12, color: '#666' }}>
          Queue: {target[0].toFixed(0)}% • Details: {target[1].toFixed(0)}%
        </div>
      </Card>
    </div>
  );
}
