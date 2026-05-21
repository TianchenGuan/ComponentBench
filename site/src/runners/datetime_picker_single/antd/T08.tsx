'use client';

/**
 * datetime_picker_single-antd-T08: AntD set datetime including seconds (dark theme)
 *
 * Theme: dark mode.
 * Layout: isolated card centered.
 * Component: one AntD DatePicker with showTime enabled for hours, minutes, AND seconds (format like "YYYY-MM-DD HH:mm:ss").
 * Behavior: needConfirm=true; an OK button must be clicked to commit the selection.
 * Initial state: "2026-02-20 19:05:00" (seconds currently 00, so the user must adjust seconds to 30).
 * Sub-controls: calendar for the date + a time panel that includes seconds selection.
 *
 * Success: The DatePicker labeled "Video publish timestamp" is committed to 2026-02-20 19:05:30 (local time). OK was used to confirm the seconds-level time.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, ConfigProvider, theme } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-02-20 19:05:00', 'YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm:ss') === '2026-02-20 19:05:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Card title="Video Publishing" style={{ width: 450 }}>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="dt-video" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Video publish timestamp
          </label>
          <DatePicker
            id="dt-video"
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            value={value}
            onChange={(datetime) => setValue(datetime)}
            placeholder="Select date and time"
            allowClear
            needConfirm
            style={{ width: '100%' }}
            data-testid="dt-video"
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
