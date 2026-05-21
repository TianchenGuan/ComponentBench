'use client';

/**
 * drawer-antd-T06: Close Shipping address drawer via footer Cancel (compact/small)
 *
 * Layout: isolated_card centered, but with COMPACT spacing and SMALL component scale (buttons and padding are reduced).
 *
 * Initial state:
 * - The AntD Drawer titled "Shipping address" is already OPEN on page load.
 * - The drawer slides in from the right. A mask covers the page.
 *
 * Target component configuration:
 * - closable = false (no header X icon).
 * - maskClosable = false (clicking the mask does NOT close the drawer).
 * - A footer is enabled with two buttons: "Cancel" (secondary) and "Save" (primary). Only "Cancel" closes the drawer; "Save" is disabled for this task.
 *
 * Distractors:
 * - Inside the drawer there are two text fields rendered in read-only mode (not interactive) to avoid form dependencies.
 *
 * Feedback:
 * - Clicking "Cancel" closes the drawer and removes the mask.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography, Input, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const footerContent = (
    <Space>
      <Button
        size="small"
        onClick={() => setOpen(false)}
        data-testid="drawer-cancel"
      >
        Cancel
      </Button>
      <Button type="primary" size="small" disabled data-testid="drawer-save">
        Save
      </Button>
    </Space>
  );

  return (
    <Card title="Checkout" style={{ width: 300 }} size="small">
      <Text>Close the drawer using the Cancel button in the footer.</Text>

      <Drawer
        title="Shipping address"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closable={false}
        maskClosable={false}
        footer={footerContent}
        width={300}
        data-testid="drawer-shipping-address"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <div>
            <Text strong style={{ fontSize: 12 }}>Street Address</Text>
            <Input size="small" value="456 Oak Ave" disabled />
          </div>
          <div>
            <Text strong style={{ fontSize: 12 }}>City, State ZIP</Text>
            <Input size="small" value="Springfield, IL 62701" disabled />
          </div>
        </Space>
      </Drawer>
    </Card>
  );
}
