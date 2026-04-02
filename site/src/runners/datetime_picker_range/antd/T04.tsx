'use client';

/**
 * datetime_picker_range-antd-T04: Report window: open the date-time range popover
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * A single AntD RangePicker labeled "Report window" starts empty.
 * The picker uses a popover overlay that contains a calendar view and a time selection panel.
 * No other controls exist on the page; the intent is to test reliably opening the overlay without modifying the value.
 *
 * Success: The date-time range picker overlay is open (calendar/time UI visible).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <Card title="Report Settings" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Report window
        </label>
        <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
          Clicking the field opens a popover calendar with time selection.
        </div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(dates) => setValue(dates)}
          onOpenChange={(open) => setIsOpen(open)}
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Report window"
          data-testid="dt-range-report"
        />
      </div>
    </Card>
  );
}
