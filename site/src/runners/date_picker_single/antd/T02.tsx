'use client';

/**
 * date_picker_single-antd-T02: Type appointment date 2026-03-05
 *
 * Scene: A centered isolated card in light theme with comfortable spacing.
 *
 * Target component: One Ant Design DatePicker labeled "Appointment date". The input is initially empty.
 * - The input supports direct typing. A small helper text under the field says: "Format: YYYY-MM-DD".
 * - When the user types a complete valid date and presses Enter (or the input loses focus), the DatePicker parses it and stores the canonical date.
 * - If the user types an invalid date, the input shows a red error style and the value is not committed.
 *
 * Distractors: None.
 *
 * Feedback: Once accepted, the input renders the normalized value as "2026-03-05" and the calendar popover (if open) reflects the same selection.
 *
 * Success: Date picker must have selected date = 2026-03-05.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '2026-03-05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Appointment date" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="appointment-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Appointment date
        </label>
        <DatePicker
          id="appointment-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          style={{ width: '100%' }}
          data-testid="appointment-date"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          Format: YYYY-MM-DD
        </div>
      </div>
    </Card>
  );
}
