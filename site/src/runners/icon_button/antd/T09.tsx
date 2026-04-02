'use client';

/**
 * icon_button-antd-T09: Dark theme icon match (small icons)
 *
 * Layout: isolated_card placed near the top-left of the viewport; dark theme.
 * Card titled "Icon match" with a Target icon reference box and four small icon-only 
 * AntD Buttons in a 2×2 grid.
 * 
 * Success: The correct option button (matching the target icon) has data-cb-activated="true".
 */

import React, { useState, useMemo } from 'react';
import { Button, Card } from 'antd';
import { HomeOutlined, SettingOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const ICONS = [
  { key: 'home', icon: <HomeOutlined /> },
  { key: 'settings', icon: <SettingOutlined /> },
  { key: 'user', icon: <UserOutlined /> },
  { key: 'mail', icon: <MailOutlined /> },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  // Fixed target for consistency
  const targetKey = useMemo(() => 'settings', []);
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
    <Card 
      title="Icon match" 
      style={{ width: 300 }}
      styles={{
        header: { borderBottom: '1px solid #303030' },
      }}
    >
      {/* Target reference */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>Target icon:</div>
        <div 
          style={{ 
            width: 36, 
            height: 36, 
            border: '2px dashed #1677ff', 
            borderRadius: 6, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          {targetIcon}
        </div>
      </div>

      {/* Options - Small buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {ICONS.map((item, index) => (
          <Button
            key={item.key}
            size="small"
            icon={item.icon}
            onClick={() => handleClick(item.key)}
            aria-label={`Option ${index + 1}`}
            data-cb-activated={activatedKey === item.key ? 'true' : 'false'}
            style={{ 
              height: 32, 
              width: '100%',
              borderColor: activatedKey === item.key ? '#1677ff' : undefined,
            }}
          />
        ))}
      </div>
    </Card>
  );
}
