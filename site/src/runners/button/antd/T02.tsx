'use client';

/**
 * button-antd-T02: Show details popover (open overlay)
 * 
 * Baseline isolated card centered on the page titled "Plan summary".
 * Inside the card there is a single Ant Design default Button labeled "Show details".
 * The button triggers an AntD Popover on click with a bulleted list.
 */

import React, { useState } from 'react';
import { Button, Card, Popover } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      onSuccess();
    }
  };

  const popoverContent = (
    <ul style={{ margin: 0, paddingLeft: 20 }}>
      <li>Quarterly revenue targets</li>
      <li>Team expansion roadmap</li>
      <li>Product launch timeline</li>
    </ul>
  );

  return (
    <Card title="Plan summary" style={{ width: 400 }}>
      <Popover
        content={popoverContent}
        title="Plan Details"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
        data-overlay-id="antd-popover-plan-details"
      >
        <Button data-testid="antd-btn-show-details">
          Show details
        </Button>
      </Popover>
    </Card>
  );
}
