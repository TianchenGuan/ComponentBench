'use client';

/**
 * date_input_text-antd-T01: AntD basic typed date in ISO format
 * 
 * Layout: isolated_card centered in the viewport (single card on an otherwise blank page).
 * Component: One Ant Design DatePicker rendered inline inside the card with label "Invoice date".
 * The input shows a placeholder "YYYY-MM-DD", a calendar icon on the right, and a clear (✕) icon that appears when a value is present.
 * Initial state: the field is empty (no date selected) and no popup is open.
 * Sub-controls/behavior: typing a date and pressing Enter (or blurring the field) commits the value; clicking the calendar icon would open a calendar popover but is not required.
 * Distractors: none (no other inputs/buttons in the card).
 * Feedback: once committed, the formatted date text is visible in the input.
 * 
 * Success: The DatePicker value (canonical date) equals 2026-02-14.
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
    <Card title="Date entry" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="invoice-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Invoice date
        </label>
        <DatePicker
          id="invoice-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          style={{ width: '100%' }}
          data-testid="invoice-date"
          allowClear
        />
      </div>
    </Card>
  );
}
