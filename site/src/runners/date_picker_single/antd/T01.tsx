'use client';

/**
 * date_picker_single-antd-T01: Set delivery date to 2026-02-14
 *
 * Scene: A single isolated card is centered in the viewport (isolated_card, center).
 * Theme is light with comfortable spacing and default-sized controls.
 *
 * Target component: One Ant Design DatePicker labeled "Delivery date" with a calendar icon.
 * The input is initially empty and shows a placeholder "Select date".
 * - Interaction: Clicking the input opens a popover calendar panel (month grid) anchored to the input.
 * - Sub-controls: Previous/next month chevrons in the header; month/year selector in the header; day cells in a 7x6 grid.
 * - Format: The input displays the selected date in ISO-like format (YYYY-MM-DD).
 *
 * Distractors: None beyond a non-interactive helper text line under the field ("Choose a single date").
 *
 * Feedback: When a day is clicked, the input value updates immediately and the popover closes.
 *
 * Success: Date picker must have selected date = 2026-02-14.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '2026-02-14') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Delivery date" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="delivery-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Delivery date
        </label>
        <DatePicker
          id="delivery-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="Select date"
          style={{ width: '100%' }}
          data-testid="delivery-date"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          Choose a single date
        </div>
      </div>
    </Card>
  );
}
