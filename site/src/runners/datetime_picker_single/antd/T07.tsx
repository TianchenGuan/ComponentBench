'use client';

/**
 * datetime_picker_single-antd-T07: AntD navigate months/years to set far datetime
 *
 * Layout: isolated card centered.
 * Component: one AntD DatePicker with showTime (hours+minutes), allowClear=true.
 * Behavior: needConfirm=false (no OK button); selection commits when a complete valid datetime is selected and the popover closes/loses focus.
 * Initial state: value is empty.
 * Interaction nuance: target date is far from the currently displayed month, so the user must navigate the calendar header (month/year controls) before selecting the day, then set the time to 23:45 (11:45 PM).
 *
 * Success: The DatePicker labeled "Archive at" equals 2026-12-31 23:45 (local time). No OK click is required in this configuration (needConfirm=false).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-12-31 23:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Archive Settings" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="dt-archive" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Archive at
        </label>
        <DatePicker
          id="dt-archive"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(datetime) => setValue(datetime)}
          placeholder="Select date and time"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="dt-archive"
        />
      </div>
    </Card>
  );
}
