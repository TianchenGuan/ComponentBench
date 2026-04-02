'use client';

/**
 * time_input_text-antd-T02: Clear a prefilled time value
 * 
 * Layout: isolated_card centered. Light theme, comfortable spacing.
 * There is a single AntD TimePicker labeled "Follow-up call time".
 * - Configuration: format='HH:mm', allowClear=true (default clear icon), needConfirm=false.
 * - Initial state: value is set to 14:45.
 * - Interactions: user can clear via the clear (×) icon in the input, or by focusing the input and deleting text.
 * - No other interactive elements; clutter=none.
 * 
 * Success: The TimePicker labeled "Follow-up call time" has no value (cleared).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('14:45', 'HH:mm'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Reminders" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="followup-time" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Follow-up call time
        </label>
        <TimePicker
          id="followup-time"
          value={value}
          onChange={(time) => setValue(time)}
          format="HH:mm"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="followup-time"
        />
      </div>
    </Card>
  );
}
