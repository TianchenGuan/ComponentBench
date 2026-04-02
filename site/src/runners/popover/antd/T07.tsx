'use client';

/**
 * popover-antd-T07: Open 2FA info popover in dark + compact mode
 *
 * Robustness variant: dark theme + compact spacing.
 * Isolated card centered in the viewport labeled 'Security'.
 * Within the card, there is a compact row labeled '2FA' with a small info icon aligned to the right.
 * The info icon is the AntD Popover target; trigger='click'.
 * Popover title: '2FA'; content: one sentence explaining two-factor authentication.
 * Initial state: popover is closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Popover, Typography, Switch } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const popoverContent = (
    <div style={{ maxWidth: 220 }} data-testid="popover-2fa">
      <p style={{ margin: 0 }}>
        Two-factor authentication adds an extra layer of security to your account.
      </p>
    </div>
  );

  return (
    <Card 
      title="Security" 
      style={{ width: 320 }}
      size="small"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Text>2FA</Text>
          <Popover
            content={popoverContent}
            title="2FA"
            trigger="click"
            open={open}
            onOpenChange={setOpen}
          >
            <InfoCircleOutlined
              data-testid="popover-target-2fa"
              style={{ cursor: 'pointer', color: '#1677ff', fontSize: 12 }}
            />
          </Popover>
        </div>
        <Switch size="small" />
      </div>
    </Card>
  );
}
