'use client';

/**
 * progress_bar-antd-T08: Dashboard: pause Primary sync near 72%
 *
 * Layout: dashboard. The page uses a dark theme with a top app bar and a 2-column grid of cards.
 *
 * Target components: three Ant Design line Progress bars (instances=3), each inside a card:
 * - Card A: "Primary sync" (TARGET)
 * - Card B: "Secondary sync"
 * - Card C: "Backup sync"
 *
 * Initial state:
 * - Primary sync progress is 0% and idle.
 * - Secondary and Backup show 10% and 25% respectively (static unless started).
 *
 * Success: "Primary sync" progress bar is within ±2% of 72% and stable for at least 1 second.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Button, Space, Typography, Layout } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;
const { Header, Content } = Layout;

interface SyncCard {
  id: string;
  title: string;
  initialPercent: number;
}

const syncCards: SyncCard[] = [
  { id: 'primary', title: 'Primary sync', initialPercent: 0 },
  { id: 'secondary', title: 'Secondary sync', initialPercent: 10 },
  { id: 'backup', title: 'Backup sync', initialPercent: 25 },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [percents, setPercents] = useState<Record<string, number>>({
    primary: 0,
    secondary: 10,
    backup: 25,
  });
  const [running, setRunning] = useState<Record<string, boolean>>({
    primary: false,
    secondary: false,
    backup: false,
  });
  const intervalsRef = useRef<Record<string, NodeJS.Timeout | null>>({
    primary: null,
    secondary: null,
    backup: null,
  });
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: Primary sync within ±2% of 72% and stable for 1 second
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    const primaryPercent = percents.primary;
    const isPrimaryRunning = running.primary;

    if (!isPrimaryRunning && primaryPercent >= 70 && primaryPercent <= 74 && !successFiredRef.current) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 1000);
    }

    return () => {
      if (stabilityRef.current) {
        clearTimeout(stabilityRef.current);
      }
    };
  }, [percents.primary, running.primary, onSuccess]);

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  const handleStart = (id: string) => {
    setRunning((prev) => ({ ...prev, [id]: true }));
    intervalsRef.current[id] = setInterval(() => {
      setPercents((prev) => {
        const newPercent = prev[id] + 1;
        if (newPercent >= 100) {
          clearInterval(intervalsRef.current[id]!);
          setRunning((r) => ({ ...r, [id]: false }));
          return { ...prev, [id]: 100 };
        }
        return { ...prev, [id]: newPercent };
      });
    }, 100);
  };

  const handlePause = (id: string) => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]!);
      intervalsRef.current[id] = null;
    }
    setRunning((prev) => ({ ...prev, [id]: false }));
  };

  const handleReset = (id: string) => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]!);
      intervalsRef.current[id] = null;
    }
    setRunning((prev) => ({ ...prev, [id]: false }));
    const initialPercent = syncCards.find((c) => c.id === id)?.initialPercent ?? 0;
    setPercents((prev) => ({ ...prev, [id]: initialPercent }));
    if (id === 'primary') {
      successFiredRef.current = false;
    }
  };

  return (
    <Layout style={{ minHeight: '100%', background: '#141414' }}>
      <Header style={{ background: '#1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>Sync Dashboard</Title>
        <Button type="text" icon={<ReloadOutlined style={{ color: '#888' }} />} />
      </Header>
      <Content style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {syncCards.map((card) => (
            <Card
              key={card.id}
              title={<span style={{ color: '#fff' }}>{card.title}</span>}
              style={{ background: '#1f1f1f', borderColor: '#303030' }}
              data-testid={`progress-card-${card.id}`}
            >
              <div style={{ marginBottom: 16 }}>
                <Progress
                  percent={percents[card.id]}
                  status={running[card.id] ? 'active' : 'normal'}
                  strokeColor={card.id === 'primary' ? '#1677ff' : undefined}
                />
              </div>
              <Space>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => handleStart(card.id)}
                  disabled={running[card.id] || percents[card.id] >= 100}
                >
                  Start
                </Button>
                <Button
                  size="small"
                  onClick={() => running[card.id] ? handlePause(card.id) : handleStart(card.id)}
                  disabled={percents[card.id] === 0 || percents[card.id] >= 100}
                >
                  {running[card.id] ? 'Pause' : 'Resume'}
                </Button>
                <Button size="small" onClick={() => handleReset(card.id)}>
                  Reset
                </Button>
              </Space>
            </Card>
          ))}
        </div>
      </Content>
    </Layout>
  );
}
