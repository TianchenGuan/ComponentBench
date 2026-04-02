'use client';

/**
 * date_input_text-antd-T02: AntD overwrite an existing date
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: One Ant Design DatePicker labeled "Shipping date".
 * Initial state: the field is pre-filled with 2026-02-01 (YYYY-MM-DD). The clear icon is available because a value is set.
 * Sub-controls/behavior: the date can be edited by focusing the input and typing over the existing value; calendar popover is available but optional.
 * Distractors: a non-interactive summary line under the field ("Orders ship within 2 business days.") to look realistic.
 * Feedback: the input text updates to the new date when committed.
 * 
 * Success: The DatePicker value (canonical date) equals 2026-02-20.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-02-01'));

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '2026-02-20') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Shipping" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="shipping-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Shipping date
        </label>
        <DatePicker
          id="shipping-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          style={{ width: '100%' }}
          data-testid="shipping-date"
          allowClear
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
          Orders ship within 2 business days.
        </Text>
      </div>
    </Card>
  );
}
