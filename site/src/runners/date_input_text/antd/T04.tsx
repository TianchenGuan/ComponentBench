'use client';

/**
 * date_input_text-antd-T04: AntD typed date in US format
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: One Ant Design DatePicker labeled "Event date".
 * Configuration: display/parse format is set to MM/DD/YYYY, and the placeholder shows "MM/DD/YYYY".
 * Initial state: empty.
 * Sub-controls/behavior: typing is supported; the calendar popover exists but is optional.
 * Distractors: none.
 * Feedback: after commit, the input shows "03/03/2026".
 * 
 * Success: The DatePicker value (canonical date) equals 2026-03-03.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '2026-03-03') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Event" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="event-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Event date
        </label>
        <DatePicker
          id="event-date"
          value={value}
          onChange={(date) => setValue(date)}
          format="MM/DD/YYYY"
          placeholder="MM/DD/YYYY"
          style={{ width: '100%' }}
          data-testid="event-date"
          allowClear
        />
      </div>
    </Card>
  );
}
