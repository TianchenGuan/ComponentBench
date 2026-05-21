'use client';

/**
 * datetime_picker_range-antd-T03: Outage window: clear the prefilled range
 *
 * Layout: isolated_card centered in the viewport with a single RangePicker labeled "Outage window".
 * Theme is light, spacing comfortable, scale default.
 * The RangePicker has showTime enabled but is configured to commit changes immediately when cleared (no confirmation required for clearing).
 * Initial state: pre-filled with start=2026-02-05 01:00 and end=2026-02-05 03:00.
 * A clear (×) control appears in the input when hovered/focused. No other UI elements are present.
 *
 * Success: Both start and end are empty (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-02-05 01:00', 'YYYY-MM-DD HH:mm'),
    dayjs('2026-02-05 03:00', 'YYYY-MM-DD HH:mm'),
  ]);

  useEffect(() => {
    if (value === null || (value[0] === null && value[1] === null)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Outage Management" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Outage window
        </label>
        <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
          Current value: 2026-02-05 01:00 – 2026-02-05 03:00
          <br />
          (There is an × clear icon when you hover/focus the field.)
        </div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(dates) => setValue(dates)}
          placeholder={['Start', 'End']}
          allowClear
          style={{ width: '100%' }}
          data-cb-instance="Outage window"
          data-testid="dt-range-outage"
        />
      </div>
    </Card>
  );
}
