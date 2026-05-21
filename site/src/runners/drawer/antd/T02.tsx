'use client';

/**
 * drawer-antd-T02: Close Help drawer with header X
 *
 * Layout: isolated_card centered with comfortable spacing. The only interactive elements are the AntD Drawer and its built-in close control.
 *
 * Initial state:
 * - The AntD Drawer titled "Help" is already OPEN on page load (slides in from the right).
 * - The page behind it is dimmed by the mask.
 *
 * Target component details:
 * - The drawer header contains the title "Help" and a small close (X) icon button on the far right.
 * - Clicking the close icon closes the drawer and removes the mask.
 * No other drawers are present.
 * Feedback:
 * - The drawer slides out and the background returns to normal when closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Drawer, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text } = Typography;

export default function T02({ task, onSuccess }: TaskComponentProps) {
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
      <Text>The Help drawer is currently open. Close it using the X button.</Text>

      <Drawer
        title="Help"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        data-testid="drawer-help"
      >
        <Paragraph>
          Welcome to our help center. Here you can find answers to common questions and get support for any issues.
        </Paragraph>
        <Text strong>Quick Links:</Text>
        <ul style={{ marginTop: 8 }}>
          <li>Getting Started Guide</li>
          <li>FAQ</li>
          <li>Contact Support</li>
        </ul>
      </Drawer>
    </Card>
  );
}
