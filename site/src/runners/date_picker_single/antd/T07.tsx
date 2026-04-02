'use client';

/**
 * date_picker_single-antd-T07: Pick a far past date (1998-12-31) from top-left
 *
 * Scene: An isolated card positioned near the top-left of the viewport (placement=top_left).
 * Light theme, comfortable spacing, default scale.
 *
 * Target component: One Ant Design DatePicker labeled "Date of birth".
 * - Initial state: empty.
 * - Opening the picker shows the calendar around the current month/year by default.
 * - To reach 1998, the user must use the header controls (month/year selector and/or year panel) and navigate across many years before selecting December 31.
 *
 * Distractors: None.
 *
 * Feedback: The input updates immediately upon selecting a day (no extra confirmation).
 *
 * Success: Date picker must have selected date = 1998-12-31.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '1998-12-31') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Profile" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="date-of-birth" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Date of birth
        </label>
        <DatePicker
          id="date-of-birth"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="Select date"
          style={{ width: '100%' }}
          data-testid="date-of-birth"
        />
      </div>
    </Card>
  );
}
