'use client';

/**
 * popover-antd-T10: Open Quick actions popover (right-click / context menu trigger)
 *
 * Isolated card anchored to the bottom-left of the viewport.
 * A single button labeled 'Quick actions' sits in the card.
 * The button is wrapped with AntD Popover configured with trigger='contextMenu' so it opens on right-click.
 * Popover title: 'Quick actions'; content: a short list of three text actions (non-interactive).
 * Initial state: popover is closed.
 * No other popovers are present.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Popover, Button } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const popoverContent = (
    <div style={{ maxWidth: 200 }} data-testid="popover-quick-actions">
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>Copy to clipboard</li>
        <li>Share link</li>
        <li>Export as PDF</li>
      </ul>
    </div>
  );

  return (
    <Card title="Actions" style={{ width: 300 }}>
      <p style={{ marginBottom: 16 }}>Right-click the button below to see quick actions.</p>
      <Popover
        content={popoverContent}
        title="Quick actions"
        trigger="contextMenu"
        open={open}
        onOpenChange={setOpen}
      >
        <Button data-testid="popover-target-quick-actions">Quick actions</Button>
      </Popover>
    </Card>
  );
}
