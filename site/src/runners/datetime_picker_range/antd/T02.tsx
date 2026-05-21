'use client';

/**
 * datetime_picker_range-antd-T02: Pickup window: set afternoon range (small control, corner placement)
 *
 * Layout: isolated_card anchored near the top-left of the viewport.
 * Theme is light with comfortable spacing, but the RangePicker is rendered in the library's small size variant.
 * The Ant Design RangePicker has showTime enabled and the time list uses 30-minute steps (e.g., 13:00, 13:30, 14:00, …).
 * Clicking the field opens a popover with a calendar and time selector, plus OK/Cancel actions.
 * Initial state: empty. No distractors are present.
 *
 * Success: start=2026-03-03T13:00:00, end=2026-03-03T17:30:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (value && value[0] && value[1]) {
      const startMatch = value[0].format('YYYY-MM-DD HH:mm') === '2026-03-03 13:00';
      const endMatch = value[1].format('YYYY-MM-DD HH:mm') === '2026-03-03 17:30';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [value, onSuccess]);

  return (
    <Card title="Pickup Scheduler" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Pickup window (small)
        </label>
        <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
          Choose a date/time range. Format: YYYY-MM-DD HH:mm
        </div>
        <RangePicker
          size="small"
          showTime={{ format: 'HH:mm', minuteStep: 30 }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(dates) => setValue(dates)}
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Pickup window"
          data-testid="dt-range-pickup"
          needConfirm
        />
      </div>
    </Card>
  );
}
