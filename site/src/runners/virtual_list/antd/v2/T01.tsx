'use client';

/**
 * virtual_list-antd-v2-T01
 * Reviewer drawer: exact duplicate assignee and confirm
 *
 * Drawer flow with a virtualized reviewer list. Two Diego Alvarez rows exist;
 * the agent must select APR-0204 (Data) and click "Assign reviewer".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Drawer, Button, Tag, Typography, Space } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface Reviewer {
  key: string;
  code: string;
  name: string;
  dept: string;
}

const departments = ['Infra', 'Data', 'Platform', 'Security', 'ML', 'DevOps', 'Analytics', 'Backend', 'Frontend', 'QA'];
const firstNames = ['Aisha', 'Ben', 'Carlos', 'Diana', 'Eli', 'Fiona', 'Gael', 'Hana', 'Ivan', 'Julia'];
const lastNames = ['Patel', 'Nguyen', 'Park', 'Müller', 'Santos', 'Chen', 'Kim', 'Alvarez', 'Singh', 'Lee'];

function buildReviewers(): Reviewer[] {
  const list: Reviewer[] = [];
  for (let i = 0; i < 1200; i++) {
    const code = `APR-${String(i).padStart(4, '0')}`;
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const dept = departments[i % departments.length];
    list.push({ key: `apr-${String(i).padStart(4, '0')}`, code, name: `${fn} ${ln}`, dept });
  }
  list[41] = { key: 'apr-0041', code: 'APR-0041', name: 'Diego Alvarez', dept: 'Infra' };
  list[204] = { key: 'apr-0204', code: 'APR-0204', name: 'Diego Alvarez', dept: 'Data' };
  return list;
}

const reviewers = buildReviewers();

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (savedKey === 'apr-0204' && !drawerOpen) {
      successRef.current = true;
      onSuccess();
    }
  }, [savedKey, drawerOpen, onSuccess]);

  const handleAssign = () => {
    if (pendingKey) {
      setSavedKey(pendingKey);
      setDrawerOpen(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 520 }}>
      <Card size="small" title="Release checklist" style={{ marginBottom: 12 }}>
        <Space>
          <Tag color="blue">v4.2.1</Tag>
          <Tag color="green">Staging</Tag>
        </Space>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Owner: Platform team</Text>
        </div>
      </Card>

      <Button type="primary" onClick={() => { setDrawerOpen(true); setPendingKey(null); }}>
        Assign reviewer
      </Button>

      {savedKey && (
        <Text style={{ marginLeft: 12 }}>Assigned: {reviewers.find(r => r.key === savedKey)?.code}</Text>
      )}

      <Drawer
        title="Assign reviewer"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
        placement="right"
        footer={
          <Button type="primary" block disabled={!pendingKey} onClick={handleAssign}>
            Assign reviewer
          </Button>
        }
      >
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
          <VirtualList data={reviewers} height={440} itemHeight={48} itemKey="key">
            {(item: Reviewer) => (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-selected={pendingKey === item.key}
                onClick={() => setPendingKey(item.key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: pendingKey === item.key ? '#e6f4ff' : 'transparent',
                }}
              >
                <Text style={{ fontSize: 13 }}>{item.code} — {item.name} ({item.dept})</Text>
              </div>
            )}
          </VirtualList>
        </div>
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          Pending: {pendingKey ? reviewers.find(r => r.key === pendingKey)?.code : 'none'}
        </Text>
      </Drawer>
    </div>
  );
}
