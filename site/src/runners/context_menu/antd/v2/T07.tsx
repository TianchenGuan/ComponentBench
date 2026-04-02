'use client';

/**
 * context_menu-antd-v2-T07: Card 3 — Priority → Critical
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Radio, Space } from 'antd';
import type { TaskComponentProps } from '../../types';

type Pri = 'Low' | 'Medium' | 'High' | 'Critical';

const CARDS = ['Card 1', 'Card 2', 'Card 3', 'Card 4'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [priority, setPriority] = useState<Record<string, Pri>>({
    'Card 1': 'High',
    'Card 2': 'High',
    'Card 3': 'High',
    'Card 4': 'High',
  });
  const [openCard, setOpenCard] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      priority['Card 3'] === 'Critical' &&
      priority['Card 1'] === 'High' &&
      priority['Card 2'] === 'High' &&
      priority['Card 4'] === 'High'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [priority, onSuccess]);

  const menuPanel = (card: string) => (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        minWidth: 220,
        padding: 8,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '6px 8px', cursor: 'pointer' }}>Open</div>
      <div style={{ padding: '6px 8px', borderTop: '1px solid #f0f0f0', marginTop: 4 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Priority</div>
        <Radio.Group
          value={priority[card]}
          onChange={(e) => {
            setPriority((p) => ({ ...p, [card]: e.target.value }));
            setTimeout(() => setOpenCard(card), 0);
          }}
        >
          <Space direction="vertical" size={2}>
            <Radio value="Low">Low</Radio>
            <Radio value="Medium">Medium</Radio>
            <Radio value="High">High</Radio>
            <Radio value="Critical">Critical</Radio>
          </Space>
        </Radio.Group>
      </div>
      <div style={{ padding: '6px 8px', cursor: 'pointer', marginTop: 4 }}>Assign</div>
      <div style={{ padding: '6px 8px', cursor: 'pointer' }}>Archive</div>
    </div>
  );

  return (
    <div style={{ width: 480, fontSize: 11 }}>
      <div style={{ color: '#888', marginBottom: 6 }}>Incidents · In progress</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CARDS.map((c) => (
          <Dropdown
            key={c}
            open={openCard === c}
            onOpenChange={(o) => setOpenCard(o ? c : null)}
            dropdownRender={() => menuPanel(c)}
            trigger={['contextMenu']}
          >
            <div
              style={{
                width: 100,
                minHeight: 72,
                padding: 8,
                background: '#fafafa',
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                cursor: 'context-menu',
              }}
              data-instance-label={c}
              data-priority={priority[c]}
              data-testid={`incident-${c.replace(/\s/g, '-').toLowerCase()}`}
            >
              <div style={{ fontWeight: 600 }}>{c}</div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>Prio: {priority[c]}</div>
            </div>
          </Dropdown>
        ))}
      </div>
    </div>
  );
}
