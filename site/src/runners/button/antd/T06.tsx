'use client';

/**
 * button-antd-T06: Match the dashed button style (visual reference)
 * 
 * Card titled "Button style matcher" with a "Target sample" showing dashed button style.
 * Four buttons: Primary, Default, Dashed, Link.
 * Task: Click the button matching the target sample (Dashed).
 */

import React, { useState } from 'react';
import { Button, Card, Space } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (buttonType: string) => {
    setSelected(buttonType);
    if (buttonType === 'dashed') {
      onSuccess();
    }
  };

  return (
    <Card
      title="Button style matcher"
      style={{ width: 450 }}
      extra={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#999' }}>Target sample:</span>
          <Button type="dashed" size="small" data-reference-id="antd-target-dashed">
            Sample
          </Button>
        </div>
      }
    >
      <p style={{ marginBottom: 16, color: '#666' }}>
        Click the button that matches the Target sample style shown above.
      </p>
      
      <Space wrap>
        <Button
          type="primary"
          onClick={() => handleClick('primary')}
          data-testid="antd-btn-primary"
        >
          Primary
        </Button>
        <Button
          type="default"
          onClick={() => handleClick('default')}
          data-testid="antd-btn-default"
        >
          Default
        </Button>
        <Button
          type="dashed"
          onClick={() => handleClick('dashed')}
          data-testid="antd-btn-dashed"
        >
          Dashed
        </Button>
        <Button
          type="link"
          onClick={() => handleClick('link')}
          data-testid="antd-btn-link"
        >
          Link
        </Button>
      </Space>
      
      {selected && (
        <div style={{ marginTop: 16, color: selected === 'dashed' ? '#52c41a' : '#ff4d4f' }}>
          Selected: {selected.charAt(0).toUpperCase() + selected.slice(1)}
        </div>
      )}
    </Card>
  );
}
