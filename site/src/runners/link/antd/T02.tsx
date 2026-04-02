'use client';

/**
 * link-antd-T02: Expand details with a "Show tax details" link
 * 
 * setup_description:
 * A centered isolated card titled "Invoice Summary" contains a short summary and a
 * collapsed disclosure area labeled "Tax Details". The disclosure control is implemented
 * as a single Ant Design Typography.Link that visually looks like an inline link and is
 * labeled "Show tax details". It has button-like semantics for accessibility: role="button",
 * aria-controls="tax-details-panel", and aria-expanded="false" initially.
 * 
 * When activated, the link toggles the disclosure open: aria-expanded becomes "true",
 * the link text changes to "Hide tax details", and a read-only panel appears directly
 * below showing a few lines (e.g., "State tax", "City tax").
 * 
 * success_trigger:
 * - The "Show tax details" link (data-testid="link-tax-details") was activated.
 * - The link's aria-expanded attribute equals "true".
 * - The controlled panel (id="tax-details-panel") is present and visible.
 */

import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link, Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!expanded) {
      setExpanded(true);
      onSuccess();
    } else {
      setExpanded(false);
    }
  };

  return (
    <Card title="Invoice Summary" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text>Subtotal: $100.00</Text>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary">Tax Details: {expanded ? 'shown' : 'hidden'}</Text>
      </div>
      <Link
        onClick={handleClick}
        data-testid="link-tax-details"
        role="button"
        aria-controls="tax-details-panel"
        aria-expanded={expanded}
        style={{ cursor: 'pointer' }}
      >
        {expanded ? 'Hide tax details' : 'Show tax details'}
      </Link>
      
      {expanded && (
        <div 
          id="tax-details-panel" 
          style={{ 
            marginTop: 16, 
            padding: 12, 
            background: '#f5f5f5', 
            borderRadius: 4 
          }}
        >
          <div><Text>State tax: $5.00</Text></div>
          <div><Text>City tax: $2.50</Text></div>
          <div><Text strong>Total tax: $7.50</Text></div>
        </div>
      )}
    </Card>
  );
}
