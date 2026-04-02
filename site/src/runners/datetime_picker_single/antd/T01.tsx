'use client';

/**
 * datetime_picker_single-antd-T01: AntD basic set datetime (OK confirm)
 *
 * Layout: isolated card centered on the page (no other panels).
 * Component: one Ant Design DatePicker configured with showTime (hours+minutes), allowClear enabled.
 * Label above the input: "Meeting date & time". Placeholder: "Select date and time".
 * Behavior: clicking the input opens a popover with a month calendar and a time selector. The picker shows an "OK" confirm button (needConfirm=true).
 * Initial state: empty (no datetime selected). No validation constraints.
 *
 * Success: The AntD DatePicker labeled "Meeting date & time" has committed value 2026-02-05 14:30 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-02-05 14:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Meeting Scheduler" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="dt-meeting" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Meeting date & time
        </label>
        <DatePicker
          id="dt-meeting"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(datetime) => setValue(datetime)}
          placeholder="Select date and time"
          allowClear
          needConfirm
          style={{ width: '100%' }}
          data-testid="dt-meeting"
        />
      </div>
    </Card>
  );
}
