'use client';

/**
 * date_picker_single-antd-T04: Confirm invoice date with OK (dark theme)
 *
 * Scene: A single centered card in dark theme (dark background, light text).
 * Spacing is comfortable and control scale is default.
 *
 * Target component: One Ant Design DatePicker labeled "Invoice date".
 * - Configuration: `needConfirm=true` so the calendar panel includes a footer with "OK" and "Cancel".
 * - Initial state: empty input.
 * - Interaction: Clicking the input opens a popover calendar. Clicking a day highlights it but does not finalize the value until "OK" is clicked.
 *
 * Distractors: None.
 *
 * Feedback: After pressing "OK", the popover closes and the input updates to the confirmed value.
 *
 * Success: Date picker must have selected date = 2026-02-02. Selection must be confirmed by clicking the picker 'OK' control.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '2026-02-02') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Invoice date" 
      style={{ width: 400 }}
    >
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="invoice-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Invoice date
        </label>
        <DatePicker
          id="invoice-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="Select date"
          style={{ width: '100%' }}
          data-testid="invoice-date"
          needConfirm
        />
      </div>
    </Card>
  );
}
