'use client';

/**
 * date_picker_range-antd-T02: Set Booking dates to a short March range
 *
 * Baseline isolated card centered in the viewport. It contains
 * one Ant Design RangePicker labeled 'Booking dates (required)'. Theme is light,
 * comfortable spacing, default scale. The RangePicker starts empty. When opened,
 * the popover shows a two-month calendar view with next/previous month arrow controls
 * in the header and a highlighted selection when dates are chosen. No Apply/OK button
 * is shown (selection is committed when the end date is chosen and the popover closes).
 *
 * Success: Start date = 2026-03-10, End date = 2026-03-14
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (
      value &&
      value[0] &&
      value[1] &&
      value[0].format('YYYY-MM-DD') === '2026-03-10' &&
      value[1].format('YYYY-MM-DD') === '2026-03-14'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Booking dates (required)" style={{ width: 500 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="booking-dates-range" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Booking dates (required)
        </label>
        <RangePicker
          id="booking-dates-range"
          value={value}
          onChange={(dates) => setValue(dates)}
          format="YYYY-MM-DD"
          placeholder={['Start date', 'End date']}
          style={{ width: '100%' }}
          data-testid="booking-dates-range"
        />
      </div>
    </Card>
  );
}
