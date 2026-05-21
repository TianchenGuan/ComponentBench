'use client';

/**
 * time_input_text-antd-T06: Enter time with seconds
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * There is one AntD TimePicker labeled "Log time".
 * - Configuration: format='HH:mm:ss' (hours/minutes/seconds), needConfirm=true, allowClear=true.
 * - Initial state: empty.
 * - Popup panel shows three scrolling columns (hour, minute, second) and an "OK" button.
 * - No distractors; clutter=none.
 * 
 * Success: The TimePicker labeled "Log time" has committed value 07:20:45 (24-hour).
 *          The "OK" confirm control in the picker panel must be clicked to commit.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current && value && value.format('HH:mm:ss') === '07:20:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (time: Dayjs | null) => {
    setValue(time);
    confirmedRef.current = true;
  };

  return (
    <Card title="Activity Log" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="log-time" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Log time
        </label>
        <TimePicker
          id="log-time"
          value={value}
          onChange={handleChange}
          format="HH:mm:ss"
          allowClear
          needConfirm
          style={{ width: '100%' }}
          data-testid="log-time"
        />
      </div>
    </Card>
  );
}
