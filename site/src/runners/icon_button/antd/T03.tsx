'use client';

/**
 * icon_button-antd-T03: Expand details (chevron icon disclose)
 *
 * Layout: isolated_card centered in the viewport.
 * A single card titled "Order". Inside the card there is a section header "Shipping details" 
 * with a chevron icon-only Button aligned to the far right of the header line.
 * 
 * Success: The chevron icon button has aria-expanded="true".
 */

import React, { useState } from 'react';
import { Button, Card, Badge } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !expanded;
    setExpanded(newState);
    if (newState) {
      onSuccess();
    }
  };

  return (
    <Card title="Order" style={{ width: 450 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500 }}>Shipping details</span>
          <Badge 
            count={expanded ? 'Expanded' : 'Collapsed'} 
            style={{ 
              backgroundColor: expanded ? '#52c41a' : '#999',
              fontSize: 10,
            }} 
          />
        </div>
        <Button
          type="text"
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={handleToggle}
          aria-label="Expand shipping details"
          aria-expanded={expanded}
          data-testid="antd-icon-btn-expand"
        />
      </div>
      {expanded && (
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
          <p style={{ margin: 0 }}>Shipping to: 123 Main St, City, State 12345</p>
          <p style={{ margin: '8px 0 0' }}>Estimated delivery: 3-5 business days</p>
        </div>
      )}
    </Card>
  );
}
