'use client';

/**
 * time_picker-antd-T02: Set lunch break time to 12:30
 *
 * A centered isolated card contains one Ant Design TimePicker labeled "Lunch break". It uses 24-hour HH:mm
 * format (no seconds) and starts empty. Clicking the input opens the AntD dropdown panel with scrollable hour and minute
 * columns. The picker uses default stepping (hourStep=1, minuteStep=1). needConfirm=false so the chosen time is applied
 * immediately without needing to press an OK button. No other inputs or buttons are present.
 *
 * Success: The TimePicker labeled "Lunch break" has canonical time value exactly 12:30 (24-hour, HH:mm).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '12:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Break Times" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="tp-lunch" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Lunch break
        </label>
        <TimePicker
          id="tp-lunch"
          value={value}
          onChange={(time) => setValue(time)}
          format="HH:mm"
          placeholder="Select a time"
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="tp-lunch"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          (Set to 12:30)
        </div>
      </div>
    </Card>
  );
}
