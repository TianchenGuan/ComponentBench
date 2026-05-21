'use client';

/**
 * icon_button-antd-T01: Refresh preview icon button
 *
 * Layout: isolated_card centered in the viewport.
 * The page shows a single card titled "Preview". In the card header (right-aligned) 
 * there is one Ant Design icon-only Button rendered as a circular button (shape="circle") 
 * with a refresh/reload icon. Next to the button is a small text label "Refresh preview".
 * 
 * Success: The icon button with aria-label "Refresh preview" has data-cb-activated="true".
 */

import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    if (activated) return;
    setActivated(true);
    message.success('Preview refreshed');
    onSuccess();
  };

  return (
    <Card
      title="Preview"
      style={{ width: 400 }}
      extra={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#666' }}>Refresh preview</span>
          <Button
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={handleClick}
            aria-label="Refresh preview"
            data-cb-activated={activated ? 'true' : 'false'}
            data-testid="antd-icon-btn-refresh"
          />
        </div>
      }
    >
      <p>Preview content will appear here after refreshing.</p>
    </Card>
  );
}
