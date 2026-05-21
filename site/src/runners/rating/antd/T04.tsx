'use client';

/**
 * rating-antd-T04: Form section rating: set delivery speed to 5 (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: form_section centered, resembling a short feedback form.
 * The form includes two non-target inputs above the rating (Order ID text input and Comments textarea) as low clutter distractors.
 * One Ant Design Rate component labeled "Delivery speed" is the only editable rating.
 * A second row labeled "Packaging" shows a greyed-out, read-only 4-star display (not interactive) to act as a visual distractor.
 * Configuration of the target Rate: count=5, allowHalf=false, allowClear=true.
 * Initial state: Delivery speed value = 0 (empty). No submit button is required for success.
 * 
 * Success: Target rating value equals 5 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Rate, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;
const { TextArea } = Input;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 5) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Order feedback" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Order ID</Text>
        <Input placeholder="Enter order ID" style={{ width: '100%' }} />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Comments</Text>
        <TextArea placeholder="Your comments..." rows={3} />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Delivery speed</Text>
        <Rate
          value={value}
          onChange={setValue}
          allowClear
          data-testid="rating-delivery-speed"
        />
      </div>
      
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Packaging</Text>
        <Rate
          value={4}
          disabled
          style={{ color: '#d9d9d9' }}
          aria-disabled="true"
          data-testid="rating-packaging-readonly"
        />
        <Text type="secondary" style={{ marginLeft: 8 }}>(read-only)</Text>
      </div>
    </Card>
  );
}
