'use client';

/**
 * time_picker-antd-T04: Open the start time picker panel
 *
 * A centered isolated card contains one Ant Design TimePicker labeled "Start time". The input starts empty
 * with placeholder text. The TimePicker is the standard AntD implementation that opens a floating dropdown panel when the
 * user clicks the input field or the clock icon. The panel contains scroll columns for hours and minutes. There are no other
 * popovers or dropdowns on the page that could be confused with the TimePicker panel.
 *
 * Success: The dropdown/popup panel belonging to the "Start time" TimePicker is open (visible) in the DOM.
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <Card title="Schedule" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="tp-start" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Start time
        </label>
        <TimePicker
          id="tp-start"
          value={value}
          onChange={(time) => setValue(time)}
          onOpenChange={(open) => setIsOpen(open)}
          open={isOpen}
          format="HH:mm"
          placeholder="Select a time"
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="tp-start"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          (Open the time picker panel)
        </div>
      </div>
    </Card>
  );
}
