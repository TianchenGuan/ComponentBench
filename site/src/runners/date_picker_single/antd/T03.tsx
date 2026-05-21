'use client';

/**
 * date_picker_single-antd-T03: Clear the selected renewal date
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One Ant Design DatePicker labeled "Renewal date".
 * - Initial state: The input already contains "2026-01-15".
 * - The DatePicker is configured with `allowClear=true`, so a clear (x) control appears inside the input on hover/focus.
 * - Clicking the clear control removes the selected date and returns the input to the placeholder state.
 *
 * Distractors: A secondary non-date text input ("Notes") appears below but does not affect success.
 *
 * Feedback: Clearing removes the date text immediately; no confirmation dialog is used.
 *
 * Success: Date picker must have selected date = empty (no date).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-01-15'));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Renewal date (currently set)" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="renewal-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Renewal date
        </label>
        <DatePicker
          id="renewal-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="Select date"
          style={{ width: '100%' }}
          data-testid="renewal-date"
          allowClear
        />
      </div>
      <div>
        <label htmlFor="notes" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Notes
        </label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          data-testid="notes-input"
        />
      </div>
    </Card>
  );
}
