'use client';

/**
 * tooltip-antd-T04: Dismiss an initially open tooltip
 *
 * Light theme, comfortable spacing, isolated card centered.
 * At the top of the card there is a small pill badge labeled "New feature". The badge is wrapped in AntD Tooltip.
 * - Tooltip title: "This feature is in beta."
 * - Trigger: click
 * - defaultOpen: true (tooltip is visible immediately on page load)
 * Initial state: tooltip is already visible. No other tooltip instances. The user can close it by clicking the badge again or clicking outside.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tooltip, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const successCalledRef = useRef(false);
  const wasOpenRef = useRef(true);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current && !successCalledRef.current) {
      const timer = setTimeout(() => {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [open, onSuccess]);

  return (
    <Card style={{ width: 300 }}>
      <div style={{ marginBottom: 16 }}>
        <Tooltip
          title="This feature is in beta."
          trigger="click"
          open={open}
          onOpenChange={setOpen}
        >
          <Tag color="blue" style={{ cursor: 'pointer' }} data-testid="tooltip-trigger-badge">
            New feature
          </Tag>
        </Tooltip>
      </div>
      <p>Click the badge or outside to dismiss the tooltip.</p>
    </Card>
  );
}
