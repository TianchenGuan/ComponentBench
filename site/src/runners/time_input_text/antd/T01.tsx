'use client';

/**
 * time_input_text-antd-T01: Set meeting time to 09:30 (24h, minutes)
 * 
 * Layout: isolated_card placed at the center of the viewport. Light theme with comfortable spacing.
 * The card title is "Schedule". Inside the card there is a single AntD TimePicker labeled "Meeting time".
 * - Configuration: format='HH:mm' (hours and minutes only), allowClear=true, needConfirm=false.
 * - Visuals: an input box with a small clock icon; clicking the input opens a popup panel with hour/minute columns.
 * - Initial state: empty (no time selected).
 * - No other required controls; no modal or drawer. No distractors (clutter=none).
 * 
 * Success: The AntD TimePicker labeled "Meeting time" has committed value 09:30 (24-hour, minutes).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '09:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Schedule" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="meeting-time" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Meeting time
        </label>
        <TimePicker
          id="meeting-time"
          value={value}
          onChange={(time) => setValue(time)}
          format="HH:mm"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="meeting-time"
        />
      </div>
    </Card>
  );
}
