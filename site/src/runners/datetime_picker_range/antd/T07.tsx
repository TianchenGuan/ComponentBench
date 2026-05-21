'use client';

/**
 * datetime_picker_range-antd-T07: Service window: match the reference range card
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * The card contains a small 'Reference' panel above the picker that displays the target start/end as plain text.
 * Below it is a single AntD RangePicker labeled "Service window" with showTime enabled; it opens a popover calendar and time selector and requires OK to commit.
 * Initial state: empty. No other distractors.
 *
 * Success: start=2026-06-01T10:00:00, end=2026-06-01T12:30:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (value && value[0] && value[1]) {
      const startMatch = value[0].format('YYYY-MM-DD HH:mm') === '2026-06-01 10:00';
      const endMatch = value[1].format('YYYY-MM-DD HH:mm') === '2026-06-01 12:30';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [value, onSuccess]);

  return (
    <Card title="Service Window Setup" style={{ width: 500 }}>
      {/* Reference panel */}
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: '#f0f5ff',
          borderRadius: 6,
          border: '1px solid #adc6ff',
        }}
        data-testid="reference-panel"
      >
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Reference</Text>
        <Text>Target range: 2026-06-01 10:00 – 2026-06-01 12:30</Text>
      </div>

      {/* Service window picker */}
      <div>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Service window
        </label>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(dates) => setValue(dates)}
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Service window"
          data-testid="dt-range-service"
          needConfirm
        />
      </div>
    </Card>
  );
}
