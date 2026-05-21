'use client';

/**
 * drawer-antd-T03: Dismiss drawer via mask click
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * Initial state:
 * - The AntD Drawer titled "Help" is OPEN on page load.
 * - The drawer slides in from the right and a semi-transparent mask covers the rest of the page.
 *
 * Target component configuration:
 * - maskClosable = true (default behavior): clicking the mask should close the drawer.
 * - The header still contains a close (X) icon, but the intended interaction is to dismiss via the mask.
 *
 * Drawer content:
 * - A short help paragraph only (no other required controls).
 *
 * Feedback:
 * - When the drawer closes, the mask disappears and the underlying card becomes fully interactive again.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Drawer, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph } = Typography;

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    // Success when drawer is closed
    if (!open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card title="Support" style={{ width: 350 }}>
      <Paragraph>Click the shaded area outside the drawer to close it.</Paragraph>

      <Drawer
        title="Help"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        maskClosable={true}
        data-testid="drawer-help"
      >
        <Paragraph>
          Welcome to our help center. Here you can find answers to common questions.
        </Paragraph>
      </Drawer>
    </Card>
  );
}
