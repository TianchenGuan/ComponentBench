'use client';

/**
 * datetime_picker_range-antd-T08: Cutover window: set cross-midnight range with seconds (dark theme)
 *
 * Layout: isolated_card centered in the viewport, rendered in a dark theme.
 * Spacing is comfortable and scale is default.
 * A single AntD RangePicker labeled "Cutover window" has showTime enabled with seconds visible and an explicit format 'YYYY-MM-DD HH:mm:ss'.
 * The popover includes calendar selection and time columns for hours, minutes, and seconds; an "OK" button is required to confirm the final value.
 * Initial state: empty. No other UI elements.
 *
 * Success: start=2026-11-07T23:30:15, end=2026-11-08T01:15:45 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, ConfigProvider, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (value && value[0] && value[1]) {
      const startMatch = value[0].format('YYYY-MM-DD HH:mm:ss') === '2026-11-07 23:30:15';
      const endMatch = value[1].format('YYYY-MM-DD HH:mm:ss') === '2026-11-08 01:15:45';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Card
        title="Cutover window (dark mode)"
        style={{ width: 550, background: '#1f1f1f' }}
        styles={{ header: { color: '#fff' }, body: { color: '#fff' } }}
      >
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block', color: '#fff' }}>
            Cutover window
          </label>
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 8 }}>
            Format: YYYY-MM-DD HH:mm:ss
          </div>
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            value={value}
            onChange={(dates) => setValue(dates)}
            placeholder={['Start', 'End']}
            style={{ width: '100%' }}
            data-cb-instance="Cutover window"
            data-testid="dt-range-cutover"
            needConfirm
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
