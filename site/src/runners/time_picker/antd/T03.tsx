'use client';

/**
 * time_picker-antd-T03: Clear the delivery time
 *
 * A centered isolated card contains a single Ant Design TimePicker labeled "Delivery time". The TimePicker
 * is pre-filled with the value 16:45 (24-hour HH:mm). The component has allowClear enabled (default in AntD), so a small
 * clear icon appears inside the input when hovered/focused. Clicking the clear icon should remove the value and return the
 * input to its placeholder state. The dropdown panel exists but is not required. No other time pickers or controls are present.
 *
 * Success: The TimePicker labeled "Delivery time" has no selected time (empty/blank value).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('16:45', 'HH:mm'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Delivery Settings" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="tp-delivery" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Delivery time
        </label>
        <TimePicker
          id="tp-delivery"
          value={value}
          onChange={(time) => setValue(time)}
          format="HH:mm"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="tp-delivery"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          (Clear this field)
        </div>
      </div>
    </Card>
  );
}
