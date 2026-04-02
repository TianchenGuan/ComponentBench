'use client';

/**
 * drawer-antd-T05: Open Billing address drawer from form section
 *
 * Layout: form_section in the center of the viewport (a short checkout form). Spacing is comfortable and component scale is default.
 * Clutter (low): the page shows a few standard form fields (Name, Email) and two secondary buttons unrelated to the task ("Apply coupon", "Estimate shipping"). These controls are distractors only.
 *
 * Target drawer trigger:
 * - In the "Billing address" subsection there is a small Ant Design link-style button labeled "Edit in drawer".
 * - Clicking it opens the billing drawer.
 *
 * Target component: AntD Drawer.
 * - Initial state: CLOSED.
 * - Slides in from the right with header title "Billing address".
 * - Header has a close (X) icon. Mask is enabled.
 *
 * Drawer contents (not required for success):
 * - A read-only address preview and a disabled "Save" button (disabled to prevent the task from depending on form filling).
 *
 * Feedback:
 * - The drawer open animation and the dimming mask provide immediate feedback.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography, Input, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card title="Checkout Form" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Name field */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Name</Text>
          <Input placeholder="John Doe" disabled value="John Doe" />
        </div>

        {/* Email field */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Email</Text>
          <Input placeholder="john@example.com" disabled value="john@example.com" />
        </div>

        {/* Billing address section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text strong>Billing address</Text>
            <Button
              type="link"
              size="small"
              onClick={() => setOpen(true)}
              data-testid="edit-billing-address"
            >
              Edit in drawer
            </Button>
          </div>
          <Text type="secondary">123 Main St, City, State 12345</Text>
        </div>

        {/* Distractor buttons */}
        <Space>
          <Button size="small">Apply coupon</Button>
          <Button size="small">Estimate shipping</Button>
        </Space>
      </Space>

      <Drawer
        title="Billing address"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        data-testid="drawer-billing-address"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Paragraph>Current address:</Paragraph>
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            <Text>John Doe</Text><br />
            <Text>123 Main St</Text><br />
            <Text>City, State 12345</Text><br />
            <Text>United States</Text>
          </div>
          <Button type="primary" disabled block>
            Save
          </Button>
        </Space>
      </Drawer>
    </Card>
  );
}
