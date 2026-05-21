'use client';

/**
 * date_picker_range-antd-T05: Type a contract period in YYYY-MM-DD
 *
 * Isolated card centered in the viewport, but with compact spacing
 * and a small-sized Ant Design RangePicker labeled 'Contract period (YYYY-MM-DD)'.
 * The input uses a strict display/entry format of YYYY-MM-DD for both start and
 * end and shows a mask while typing. The field starts empty. Clicking into either
 * side of the RangePicker allows keyboard entry. The calendar popover can also be
 * used, but the intended easy path is typing the dates. The value is committed when
 * the input loses focus or when Enter is pressed.
 *
 * Success: Start date = 2026-06-01, End date = 2026-06-15 (Contract period instance)
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (
      value &&
      value[0] &&
      value[1] &&
      value[0].format('YYYY-MM-DD') === '2026-06-01' &&
      value[1].format('YYYY-MM-DD') === '2026-06-15'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Contract period" style={{ width: 450 }} styles={{ body: { padding: 16 } }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="contract-period-range" style={{ fontWeight: 500, marginBottom: 8, display: 'block', fontSize: 13 }}>
          Contract period (YYYY-MM-DD)
        </label>
        <RangePicker
          id="contract-period-range"
          value={value}
          onChange={(dates) => setValue(dates)}
          format="YYYY-MM-DD"
          placeholder={['YYYY-MM-DD', 'YYYY-MM-DD']}
          style={{ width: '100%' }}
          size="small"
          data-testid="contract-period-range"
        />
        <div style={{ marginTop: 6, color: '#666', fontSize: 11 }}>
          Enter dates in YYYY-MM-DD format
        </div>
      </div>
    </Card>
  );
}
