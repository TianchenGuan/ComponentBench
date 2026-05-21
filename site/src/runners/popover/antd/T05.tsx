'use client';

/**
 * popover-antd-T05: Open Billing address help popover (2 instances)
 *
 * Form section layout centered in the viewport (checkout address form).
 * The form includes fields: Full name, Shipping address, Billing address.
 * Both 'Shipping address' and 'Billing address' labels have identical small info icons.
 * Each AntD Popover is trigger='click' to keep it open.
 * Popover titles match their field labels.
 * Distractors: a 'Continue' button and a 'Save as default' checkbox.
 * Initial state: both popovers are closed.
 * Success: Open only the 'Billing address' popover.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Popover, Input, Button, Checkbox, Form } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [billingOpen, setBillingOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (billingOpen && !shippingOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [billingOpen, shippingOpen, onSuccess]);

  const shippingPopoverContent = (
    <div style={{ maxWidth: 250 }} data-testid="popover-shipping-address">
      <p style={{ margin: 0 }}>Enter the address where you want your order delivered.</p>
    </div>
  );

  const billingPopoverContent = (
    <div style={{ maxWidth: 250 }} data-testid="popover-billing-address">
      <p style={{ margin: 0 }}>Enter the address associated with your payment method.</p>
    </div>
  );

  return (
    <Card title="Address form" style={{ width: 400 }}>
      <Form layout="vertical">
        <Form.Item label="Full name">
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Shipping address</span>
              <Popover
                content={shippingPopoverContent}
                title="Shipping address help"
                trigger="click"
                open={shippingOpen}
                onOpenChange={setShippingOpen}
              >
                <InfoCircleOutlined
                  data-testid="popover-target-shipping-address"
                  style={{ cursor: 'pointer', color: '#1677ff' }}
                />
              </Popover>
            </div>
          }
        >
          <Input placeholder="123 Main St" />
        </Form.Item>

        <Form.Item
          label={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Billing address</span>
              <Popover
                content={billingPopoverContent}
                title="Billing address help"
                trigger="click"
                open={billingOpen}
                onOpenChange={setBillingOpen}
              >
                <InfoCircleOutlined
                  data-testid="popover-target-billing-address"
                  style={{ cursor: 'pointer', color: '#1677ff' }}
                />
              </Popover>
            </div>
          }
        >
          <Input placeholder="456 Oak Ave" />
        </Form.Item>

        <Form.Item>
          <Checkbox>Save as default</Checkbox>
        </Form.Item>

        <Button type="primary">Continue</Button>
      </Form>
    </Card>
  );
}
