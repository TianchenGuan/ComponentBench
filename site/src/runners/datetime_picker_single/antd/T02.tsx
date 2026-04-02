'use client';

/**
 * datetime_picker_single-antd-T02: AntD typed datetime in fixed format
 *
 * Layout: isolated card centered.
 * Component: one Ant Design DatePicker with showTime (hours+minutes). Display/input format is fixed to "YYYY-MM-DD HH:mm".
 * Typing is enabled in the input; mask-format style segment editing is ON (arrow keys can move between segments).
 * Behavior: needConfirm=false (no OK button); value commits on Enter or blur once a valid datetime is present.
 * Initial state: empty. Under the field, helper text shows the required format: "Format: YYYY-MM-DD HH:mm".
 *
 * Success: The DatePicker labeled "Recorded at" has value 2026-02-10 09:15 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-02-10 09:15') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Log Entry" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="dt-recorded" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Recorded at
        </label>
        <DatePicker
          id="dt-recorded"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(datetime) => setValue(datetime)}
          placeholder="YYYY-MM-DD HH:mm"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="dt-recorded"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          Format: YYYY-MM-DD HH:mm
        </div>
      </div>
    </Card>
  );
}
