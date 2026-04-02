'use client';

/**
 * datetime_picker_range-antd-T06: Edit by typing: enter a formatted date-time range
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * A single AntD RangePicker labeled "Editing window" is configured with showTime and an explicit display/parse format of 'YYYY-MM-DD HH:mm'.
 * The inputs accept keyboard entry for both start and end.
 * When the panel is open, an "OK" button must be clicked to commit the typed values.
 * Initial state: empty. No distractors.
 *
 * Success: start=2026-04-10T08:15:00, end=2026-04-10T09:45:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (value && value[0] && value[1]) {
      const startMatch = value[0].format('YYYY-MM-DD HH:mm') === '2026-04-10 08:15';
      const endMatch = value[1].format('YYYY-MM-DD HH:mm') === '2026-04-10 09:45';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [value, onSuccess]);

  return (
    <Card title="Editing Range" style={{ width: 500 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Editing window
        </label>
        <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
          Format hint: YYYY-MM-DD HH:mm
          <br />
          (You can type directly into the fields.)
        </div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(dates) => setValue(dates)}
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Editing window"
          data-testid="dt-range-editing"
          needConfirm
        />
      </div>
    </Card>
  );
}
