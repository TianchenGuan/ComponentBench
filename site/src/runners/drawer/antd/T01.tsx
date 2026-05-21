'use client';

/**
 * drawer-antd-T01: Open Help drawer
 *
 * Layout: isolated_card centered in the viewport with comfortable spacing.
 * The card title is "Support". Inside the card there is a single primary Ant Design button labeled "Open Help drawer".
 *
 * Target component: AntD Drawer.
 * - The drawer is CLOSED on page load.
 * - When opened, it slides in from the right and shows a header title "Help".
 * - The drawer uses the default close (X) icon in the top-right of the header and a semi-transparent mask over the page.
 *
 * Drawer contents (distractor-free):
 * - A short paragraph of help text and a small list of links (non-interactive text in this task).
 * No other drawers exist on the page.
 * Feedback:
 * - Opening animates the drawer in and dims the background with the mask.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text } = Typography;

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card title="Support" style={{ width: 350 }}>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        data-testid="open-help-drawer"
      >
        Open Help drawer
      </Button>

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
