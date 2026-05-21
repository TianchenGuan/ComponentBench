'use client';

/**
 * accordion-antd-T08: Two accordions (compact): open Invoices in Billing FAQ
 * 
 * Scene is a single centered card in compact spacing mode. Inside the card are TWO 
 * Ant Design Collapse accordions, each clearly labeled with a subheading above it:
 * 1) "Checkout FAQ" (top accordion)
 * 2) "Billing FAQ" (bottom accordion)
 * Both accordions are in accordion=true mode.
 * Each accordion contains 4 panels. Checkout FAQ panels: "Payments", "Promo codes", 
 * "Shipping address", "Order status". Billing FAQ panels: "Payments", "Invoices", 
 * "Tax forms", "Receipts".
 * Initial state: in each accordion, the first panel ("Payments") is expanded by default.
 * 
 * Success: Billing FAQ accordion has expanded_item_ids exactly: [invoices]
 * (Checkout FAQ state is ignored)
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [checkoutActiveKey, setCheckoutActiveKey] = useState<string | string[]>('checkout_payments');
  const [billingActiveKey, setBillingActiveKey] = useState<string | string[]>('billing_payments');

  useEffect(() => {
    if (billingActiveKey === 'invoices' || (Array.isArray(billingActiveKey) && billingActiveKey.includes('invoices') && billingActiveKey.length === 1)) {
      onSuccess();
    }
  }, [billingActiveKey, onSuccess]);

  return (
    <Card style={{ width: 500 }}>
      {/* Checkout FAQ accordion */}
      <Title level={5} style={{ marginBottom: 12 }}>Checkout FAQ</Title>
      <Collapse
        accordion
        activeKey={checkoutActiveKey}
        onChange={(key) => setCheckoutActiveKey(key)}
        data-testid="accordion-checkout"
        size="small"
        items={[
          {
            key: 'checkout_payments',
            label: 'Payments',
            children: <p>Accepted payment methods during checkout.</p>,
          },
          {
            key: 'promo_codes',
            label: 'Promo codes',
            children: <p>How to apply promo codes at checkout.</p>,
          },
          {
            key: 'shipping_address',
            label: 'Shipping address',
            children: <p>Managing shipping addresses for your order.</p>,
          },
          {
            key: 'order_status',
            label: 'Order status',
            children: <p>Tracking your order status and updates.</p>,
          },
        ]}
      />

      {/* Billing FAQ accordion */}
      <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>Billing FAQ</Title>
      <Collapse
        accordion
        activeKey={billingActiveKey}
        onChange={(key) => setBillingActiveKey(key)}
        data-testid="accordion-billing"
        size="small"
        items={[
          {
            key: 'billing_payments',
            label: 'Payments',
            children: <p>Information about billing payments and methods.</p>,
          },
          {
            key: 'invoices',
            label: 'Invoices',
            children: <p>Access and download your invoices here.</p>,
          },
          {
            key: 'tax_forms',
            label: 'Tax forms',
            children: <p>Tax documentation and W-9 forms.</p>,
          },
          {
            key: 'receipts',
            label: 'Receipts',
            children: <p>View and print payment receipts.</p>,
          },
        ]}
      />
    </Card>
  );
}
