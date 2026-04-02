'use client';

/**
 * drawer-antd-T04: Open Order summary drawer (bottom-left placement)
 *
 * Layout: isolated_card anchored to the bottom-left of the viewport (the card is not centered). Spacing is comfortable and component scale is default.
 *
 * Card content:
 * - A section header "Checkout".
 * - One primary Ant Design button labeled "View order summary".
 *
 * Target component: AntD Drawer.
 * - The drawer is CLOSED initially.
 * - When opened, it slides in from the right with title "Order summary".
 * - Standard close (X) icon is visible in the header; a mask dims the rest of the page.
 *
 * Distractors:
 * - A single disabled button labeled "Place order" is shown below the trigger button but does nothing.
 *
 * Feedback:
 * - The drawer animates open and shows a bold total amount line (read-only).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text } = Typography;

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card title="Checkout" style={{ width: 300 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          type="primary"
          onClick={() => setOpen(true)}
          data-testid="open-order-summary"
          block
        >
          View order summary
        </Button>
        <Button disabled block>
          Place order
        </Button>
      </Space>

      <Drawer
        title="Order summary"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        data-testid="drawer-order-summary"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Subtotal</Text>
            <Text>$49.99</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Shipping</Text>
            <Text>$5.99</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Tax</Text>
            <Text>$4.50</Text>
          </div>
          <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <Text strong>Total</Text>
            <Text strong style={{ fontSize: 18 }}>$60.48</Text>
          </div>
        </div>
      </Drawer>
    </Card>
  );
}
