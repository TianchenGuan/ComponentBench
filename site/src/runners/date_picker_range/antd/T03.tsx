'use client';

/**
 * date_picker_range-antd-T03: Clear a prefilled range
 *
 * Isolated card in the center, light theme, comfortable spacing.
 * One Ant Design RangePicker labeled 'Booking dates' is prefilled with the range
 * '2026-04-05 ~ 2026-04-12'. The component uses the default clear affordance:
 * a small clear (×) icon appears when hovering/focusing the input. Clicking the
 * clear icon resets both start and end to empty. No other UI elements are present.
 *
 * Success: Start date is empty (null), End date is empty (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-04-05'),
    dayjs('2026-04-12'),
  ]);

  useEffect(() => {
    if (!value || (value[0] === null && value[1] === null)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Booking dates" style={{ width: 500 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="booking-dates-range" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Booking dates
        </label>
        <RangePicker
          id="booking-dates-range"
          value={value}
          onChange={(dates) => setValue(dates)}
          format="YYYY-MM-DD"
          placeholder={['Start date', 'End date']}
          style={{ width: '100%' }}
          data-testid="booking-dates-range"
          allowClear
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          Current: {value && value[0] && value[1] ? `${value[0].format('YYYY-MM-DD')} ~ ${value[1].format('YYYY-MM-DD')}` : 'Empty'}
        </div>
      </div>
    </Card>
  );
}
