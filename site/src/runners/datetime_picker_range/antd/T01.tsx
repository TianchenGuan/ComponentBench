'use client';

/**
 * datetime_picker_range-antd-T01: Support window: set same-day morning range
 *
 * Layout: isolated_card centered in the viewport with a single labeled field "Support window".
 * Theme is light with comfortable spacing and default component scale.
 * Component: Ant Design DatePicker.RangePicker configured with showTime enabled (24-hour, hour+minute).
 * A small 'Target' chip on the card repeats the requested range as a visual reference (mixed guidance).
 * Clicking either input opens a popover panel showing a calendar and a time selector; the panel includes "OK" and "Cancel" actions.
 * Initial state: empty (no start/end selected). There are no other interactive elements on the card.
 *
 * Success: The RangePicker value equals start=2026-02-14T09:30:00, end=2026-02-14T11:00:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (value && value[0] && value[1]) {
      const startMatch = value[0].format('YYYY-MM-DD HH:mm') === '2026-02-14 09:30';
      const endMatch = value[1].format('YYYY-MM-DD HH:mm') === '2026-02-14 11:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [value, onSuccess]);

  return (
    <Card title="Support Window Scheduler" style={{ width: 500 }}>
      <div style={{ marginBottom: 16 }}>
        <Tag color="blue">Target: 2026-02-14 09:30 – 2026-02-14 11:00</Tag>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Support window
        </label>
        <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
          Please choose a start and end date/time.
        </div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={value}
          onChange={(dates) => setValue(dates)}
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Support window"
          data-testid="dt-range-support"
          needConfirm
        />
      </div>
    </Card>
  );
}
