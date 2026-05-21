'use client';

/**
 * link-antd-T03: Open a help popover from an inline link
 * 
 * setup_description:
 * A centered isolated card titled "Payout Schedule" includes a short description and a
 * single Ant Design Typography.Link labeled "What is a business day?". The link is the
 * trigger for an AntD Popover-like overlay.
 * 
 * Initial state: the popover is closed, the link has aria-expanded="false" and
 * aria-haspopup="dialog". On activation, a small popover appears directly under the link
 * with a short definition and a bold title "Business Day". No other links exist (instances=1).
 * The popover has a close "×" icon, but closing is not required for success.
 * 
 * success_trigger:
 * - The "What is a business day?" link (data-testid="link-business-day") was activated.
 * - The link's aria-expanded attribute equals "true".
 * - The popover element (role="dialog", data-testid="popover-business-day") is visible.
 */

import React, { useState } from 'react';
import { Card, Typography, Popover } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link, Text, Title } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      onSuccess();
    }
  };

  const content = (
    <div 
      data-testid="popover-business-day" 
      role="dialog"
      style={{ maxWidth: 250 }}
    >
      <Title level={5} style={{ marginTop: 0 }}>Business Day</Title>
      <Text>
        A business day is any day when banks and most businesses are open, 
        typically Monday through Friday, excluding public holidays.
      </Text>
    </div>
  );

  return (
    <Card title="Payout Schedule" style={{ width: 400 }}>
      <p style={{ marginBottom: 16 }}>
        Payouts are processed within 2-3 business days. Need clarification?
      </p>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Link
          data-testid="link-business-day"
          aria-expanded={open}
          aria-haspopup="dialog"
          style={{ cursor: 'pointer' }}
        >
          What is a business day?
        </Link>
      </Popover>
    </Card>
  );
}
