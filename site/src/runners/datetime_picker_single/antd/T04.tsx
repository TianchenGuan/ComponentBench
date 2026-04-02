'use client';

/**
 * datetime_picker_single-antd-T04: AntD open the datetime picker overlay
 *
 * Layout: isolated card centered on the viewport.
 * Component: one Ant Design DatePicker with showTime. allowClear=true but initial value is empty.
 * Behavior: clicking the input opens a popover (calendar + time selector). needConfirm=false (no OK button required for selection), but this task only requires the overlay to be open.
 * Initial state: empty input; placeholder "Select publish time".
 * No other interactive overlays on the page.
 *
 * Success: The DatePicker labeled "Publish time" has its picker popover open (calendar/time panel visible).
 *          The committed value remains empty (no accidental selection).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && value === null) {
      onSuccess();
    }
  }, [isOpen, value, onSuccess]);

  return (
    <Card title="Publishing" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="dt-publish" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Publish time
        </label>
        <DatePicker
          id="dt-publish"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(datetime) => setValue(datetime)}
          onOpenChange={(open) => setIsOpen(open)}
          placeholder="Select publish time"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="dt-publish"
        />
      </div>
    </Card>
  );
}
