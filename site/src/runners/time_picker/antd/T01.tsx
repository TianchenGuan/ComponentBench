'use client';

/**
 * time_picker-antd-T01: Set reminder time to 09:00
 *
 * A single isolated settings card is centered in the viewport. The card contains one labeled Ant Design
 * TimePicker input labeled "Reminder time". The component uses a 24-hour HH:mm display (seconds column hidden) and shows
 * the placeholder "Select a time" when empty. Clicking the input opens the standard AntD dropdown panel with two scroll
 * columns (hours 00–23 and minutes 00–59). The picker is configured with needConfirm=false, so a time selection is committed
 * immediately (and is also committed on blur). There are no other interactive components on the page and no distractor time
 * pickers.
 *
 * Success: The AntD TimePicker labeled "Reminder time" has canonical time value exactly 09:00 (24-hour, HH:mm).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '09:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Settings" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="tp-reminder" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Reminder time
        </label>
        <TimePicker
          id="tp-reminder"
          value={value}
          onChange={(time) => setValue(time)}
          format="HH:mm"
          placeholder="Select a time"
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="tp-reminder"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          (Choose 09:00)
        </div>
      </div>
    </Card>
  );
}
