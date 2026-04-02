'use client';

/**
 * icon_button-antd-T06: Match the target icon (visual reference)
 *
 * Layout: isolated_card centered in the viewport.
 * Card titled "Icon match". At the top there is a "Target icon" reference box.
 * Below are four AntD icon-only Buttons in a 2×2 grid.
 * 
 * Success: The correct option button (matching the target icon) has data-cb-activated="true".
 */

import React, { useState, useMemo } from 'react';
import { Button, Card } from 'antd';
import { BellOutlined, FlagOutlined, TagOutlined, StopOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const ICONS = [
  { key: 'bell', icon: <BellOutlined /> },
  { key: 'flag', icon: <FlagOutlined /> },
  { key: 'tag', icon: <TagOutlined /> },
  { key: 'stop', icon: <StopOutlined /> },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  // Randomly select one icon as the target (deterministic for the task)
  const targetKey = useMemo(() => 'bell', []); // Fixed to 'bell' for consistency
  const [activatedKey, setActivatedKey] = useState<string | null>(null);

  const handleClick = (key: string) => {
    if (activatedKey) return;
    setActivatedKey(key);
    if (key === targetKey) {
      onSuccess();
    }
  };

  const targetIcon = ICONS.find(i => i.key === targetKey)?.icon;

  return (
    <Card title="Icon match" style={{ width: 350 }}>
      {/* Target reference */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Target icon:</div>
        <div 
          style={{ 
            width: 48, 
            height: 48, 
            border: '2px dashed #1677ff', 
            borderRadius: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {targetIcon}
        </div>
      </div>

      {/* Options */}
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Choose the matching icon button:</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {ICONS.map((item, index) => (
          <Button
            key={item.key}
            icon={item.icon}
            onClick={() => handleClick(item.key)}
            aria-label={`Option ${index + 1}`}
            data-cb-activated={activatedKey === item.key ? 'true' : 'false'}
            style={{ 
              height: 48, 
              width: '100%',
              borderColor: activatedKey === item.key ? '#1677ff' : undefined,
            }}
          />
        ))}
      </div>
    </Card>
  );
}
