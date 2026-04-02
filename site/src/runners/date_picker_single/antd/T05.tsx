'use client';

/**
 * date_picker_single-antd-T05: Set Billing date in a compact form with two pickers
 *
 * Scene: A form section layout (form_section) centered on the page. Theme is light.
 * Spacing is compact (labels and inputs are closer together) with default control scale.
 *
 * Target components: Two Ant Design DatePicker instances appear in the same form group:
 * 1) "Billing date" (TARGET) - initially empty, placeholder "YYYY-MM-DD".
 * 2) "Shipping date" (distractor) - prefilled with "2026-04-25".
 * Both DatePickers open the same style popover calendar with month navigation.
 *
 * Distractors / clutter: The form also includes a small text input ("Invoice #") and a toggle ("Send receipt"), but they do not affect success.
 *
 * Feedback: Selecting a day updates the corresponding input immediately. Because spacing is compact, the two date fields are visually close and easy to confuse.
 *
 * Success: Target instance (Billing date) must have selected date = 2026-04-21.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Input, Switch, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [billingDate, setBillingDate] = useState<Dayjs | null>(null);
  const [shippingDate, setShippingDate] = useState<Dayjs | null>(dayjs('2026-04-25'));
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [sendReceipt, setSendReceipt] = useState(false);

  useEffect(() => {
    if (billingDate && billingDate.format('YYYY-MM-DD') === '2026-04-21') {
      onSuccess();
    }
  }, [billingDate, onSuccess]);

  return (
    <Card title="Billing (form section)" style={{ width: 450 }}>
      <Form layout="vertical" size="small">
        <Form.Item label="Invoice #" style={{ marginBottom: 12 }}>
          <Input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="INV-0001"
            data-testid="invoice-number"
          />
        </Form.Item>
        
        <Form.Item label="Billing date" style={{ marginBottom: 12 }}>
          <DatePicker
            value={billingDate}
            onChange={(date) => setBillingDate(date)}
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            style={{ width: '100%' }}
            data-testid="billing-date"
          />
        </Form.Item>
        
        <Form.Item label="Shipping date" style={{ marginBottom: 12 }}>
          <DatePicker
            value={shippingDate}
            onChange={(date) => setShippingDate(date)}
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            style={{ width: '100%' }}
            data-testid="shipping-date"
          />
        </Form.Item>
        
        <Form.Item label="Send receipt" style={{ marginBottom: 0 }}>
          <Switch
            checked={sendReceipt}
            onChange={(checked) => setSendReceipt(checked)}
            data-testid="send-receipt"
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
