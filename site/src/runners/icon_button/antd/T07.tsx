'use client';

/**
 * icon_button-antd-T07: Scroll to find Help icon button (dashboard)
 *
 * Layout: dashboard with the target anchored near the bottom-right once scrolled into view.
 * A long vertical feed requiring scrolling. Near the end, a small card "Need help?" 
 * containing a circular icon-only AntD Button with a question-mark icon.
 * 
 * Success: The "Help & support" icon button has data-cb-activated="true".
 */

import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    if (activated) return;
    setActivated(true);
    message.info('Support panel opened');
    onSuccess();
  };

  // Generate feed items
  const feedItems = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    title: `Activity Item ${i + 1}`,
    description: `This is a sample activity item with some details about what happened. Item number ${i + 1}.`,
  }));

  return (
    <div style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
      <Card title="Activity" style={{ marginBottom: 16 }}>
        <p style={{ color: '#666' }}>Recent activity in your workspace</p>
      </Card>

      {/* Activity feed */}
      {feedItems.map((item) => (
        <Card key={item.id} size="small" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.title}</div>
          <div style={{ color: '#666', fontSize: 13 }}>{item.description}</div>
        </Card>
      ))}

      {/* Help card at the bottom */}
      <Card 
        size="small" 
        style={{ marginBottom: 24 }}
        bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span style={{ fontWeight: 500 }}>Need help?</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#666' }}>Help & support</span>
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={handleClick}
            aria-label="Help & support"
            data-cb-activated={activated ? 'true' : 'false'}
            data-testid="antd-icon-btn-help"
          />
        </div>
      </Card>
    </div>
  );
}
