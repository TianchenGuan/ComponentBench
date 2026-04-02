'use client';

/**
 * datetime_picker_single-antd-T03: AntD clear an existing datetime
 *
 * Layout: isolated card centered.
 * Component: one Ant Design DatePicker with showTime. allowClear=true (a clear "x" icon appears when a value is present).
 * Initial state: the input is pre-filled with "2026-02-03 11:00". needConfirm=false (clearing commits immediately).
 * No other DatePickers on the page.
 *
 * Success: The DatePicker labeled "Reminder time" is cleared (empty/null value).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-02-03 11:00', 'YYYY-MM-DD HH:mm'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Reminders" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="dt-reminder" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Reminder time
        </label>
        <DatePicker
          id="dt-reminder"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(datetime) => setValue(datetime)}
          placeholder="Select date and time"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="dt-reminder"
        />
      </div>
    </Card>
  );
}
