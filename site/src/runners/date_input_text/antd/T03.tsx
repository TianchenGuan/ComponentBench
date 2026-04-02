'use client';

/**
 * date_input_text-antd-T03: AntD clear a pre-filled date
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: One Ant Design DatePicker labeled "Reminder date".
 * Initial state: the field contains 2026-03-10 (YYYY-MM-DD).
 * Sub-controls/behavior: a small clear (✕) icon becomes available in the input when it has a value (typical AntD allowClear behavior). Clearing removes the value and restores the placeholder.
 * Distractors: none.
 * Feedback: after clearing, the input shows the placeholder text again and the value becomes null/empty.
 * 
 * Success: The DatePicker value is empty/null (no date selected).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-03-10'));
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the initial render to avoid triggering success on mount
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Reminder" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="reminder-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Reminder date
        </label>
        <DatePicker
          id="reminder-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          style={{ width: '100%' }}
          data-testid="reminder-date"
          allowClear
        />
      </div>
    </Card>
  );
}
