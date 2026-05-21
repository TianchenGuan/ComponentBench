'use client';

/**
 * time_input_text-antd-T05: Enter a 12-hour time with AM/PM and confirm
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single AntD TimePicker labeled "Office hours start" is displayed.
 * - Configuration: use12Hours=true, format='h:mm a' (12-hour with meridiem), needConfirm=true (requires pressing OK), allowClear=true.
 * - Initial state: empty.
 * - The popup panel includes hour/minute columns plus a meridiem (AM/PM) control, and an "OK" button at the bottom-right.
 * - No other inputs; clutter=none.
 * 
 * Success: The TimePicker labeled "Office hours start" has value equal to 15:05 in canonical 24-hour time (displayed as 3:05 PM).
 *          The value is considered valid only after the "OK" confirm control in the picker panel is clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current && value && value.format('HH:mm') === '15:05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (time: Dayjs | null) => {
    setValue(time);
    // When needConfirm is true, onChange fires after OK is clicked
    confirmedRef.current = true;
  };

  return (
    <Card title="Office Hours" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="office-hours-start" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Office hours start
        </label>
        <TimePicker
          id="office-hours-start"
          value={value}
          onChange={handleChange}
          format="h:mm a"
          use12Hours
          allowClear
          needConfirm
          style={{ width: '100%' }}
          data-testid="office-hours-start"
        />
      </div>
    </Card>
  );
}
