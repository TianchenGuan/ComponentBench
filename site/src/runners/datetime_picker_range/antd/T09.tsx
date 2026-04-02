'use client';

/**
 * datetime_picker_range-antd-T09: Billing window: set an open-ended range (end left empty)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * A single AntD RangePicker labeled "Billing window" is configured to allow an open-ended range: the start is required but the end may be empty (allowEmpty=[false,true]).
 * showTime is enabled (hour+minute). The popover has OK/Cancel; OK commits the current start/end (including a null end).
 * Initial state: empty. No other interactive elements.
 *
 * Success: start=2026-05-01T00:00:00 (local time) and end=null after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (value && value[0] && value[1] === null) {
      const startMatch = value[0].format('YYYY-MM-DD HH:mm') === '2026-05-01 00:00';
      if (startMatch) {
        onSuccess();
      }
    }
  }, [value, onSuccess]);

  return (
    <Card title="Billing Configuration" style={{ width: 500 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Billing window
        </label>
        <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
          Start is required; End is optional (open interval)
          <br />
          Format: YYYY-MM-DD HH:mm
        </div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(dates) => setValue(dates)}
          placeholder={['Start', 'End (optional)']}
          allowEmpty={[false, true]}
          style={{ width: '100%' }}
          data-cb-instance="Billing window"
          data-testid="dt-range-billing"
          needConfirm
        />
      </div>
    </Card>
  );
}
