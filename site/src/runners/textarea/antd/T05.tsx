'use client';

/**
 * textarea-antd-T05: Choose the correct textarea: internal note
 *
 * A "Refund request" form section (form_section layout) contains multiple fields:
 * - Light theme, comfortable spacing, default scale.
 * - Two Ant Design Input.TextArea instances are stacked with similar styling:
 *   1) "Customer-visible reply" (starts empty, helper text "Sent to customer").
 *   2) "Internal note" (starts empty, helper text "Not visible to customer").
 * - There are additional distractor controls above (Name input, Order ID input, Status dropdown).
 * - Only the "Internal note" textarea should be modified.
 *
 * Success: Internal note equals "Refund approved. Flag for QA review." (require_correct_instance=true)
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Typography, Form } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [customerReply, setCustomerReply] = useState('');
  const [internalNote, setInternalNote] = useState('');

  useEffect(() => {
    // Only succeed if internal note matches AND customer reply is unchanged
    if (internalNote.trim() === 'Refund approved. Flag for QA review.' && customerReply === '') {
      onSuccess();
    }
  }, [internalNote, customerReply, onSuccess]);

  return (
    <Card title="Refund request" style={{ width: 500 }}>
      <Form layout="vertical">
        {/* Distractor fields */}
        <Form.Item label="Name" style={{ marginBottom: 12 }}>
          <Input placeholder="Customer name" data-testid="input-name" />
        </Form.Item>
        <Form.Item label="Order ID" style={{ marginBottom: 12 }}>
          <Input placeholder="e.g., ORD-1234" data-testid="input-order-id" />
        </Form.Item>
        <Form.Item label="Status" style={{ marginBottom: 16 }}>
          <Select defaultValue="pending" style={{ width: '100%' }} data-testid="select-status">
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
        </Form.Item>

        {/* Target textareas */}
        <Form.Item label="Customer-visible reply" style={{ marginBottom: 8 }}>
          <TextArea
            placeholder="Type message for customer..."
            value={customerReply}
            onChange={(e) => setCustomerReply(e.target.value)}
            data-testid="textarea-customer-reply"
            rows={3}
          />
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            Sent to customer
          </Text>
        </Form.Item>

        <Form.Item label="Internal note" style={{ marginBottom: 8 }}>
          <TextArea
            placeholder="Type internal note..."
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            data-testid="textarea-internal-note"
            rows={3}
          />
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            Not visible to customer
          </Text>
        </Form.Item>
      </Form>
    </Card>
  );
}
