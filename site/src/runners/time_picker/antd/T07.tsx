'use client';

/**
 * time_picker-antd-T07: Match the reference time (09:10)
 *
 * A compact-density isolated card is centered. At the top of the card, a non-interactive "Reference time"
 * widget shows a large digital display reading "09:10". Below it is a single Ant Design TimePicker labeled "Alarm time",
 * configured for 24-hour HH:mm. Clicking the input opens the standard hour/minute scroll-column dropdown. needConfirm is
 * disabled, so the selected time is committed immediately. There are no other time pickers or interactive distractors; the
 * only challenge is using the reference display (visual cue) to set the picker.
 *
 * Scene: spacing=compact, guidance=mixed
 *
 * Success: The TimePicker labeled "Alarm time" has canonical time value exactly 09:10 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '09:10') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Alarm Settings" style={{ width: 350 }} styles={{ body: { padding: 16 } }}>
      {/* Reference display */}
      <div
        data-testid="reference-time"
        style={{
          background: '#f0f5ff',
          border: '1px solid #adc6ff',
          borderRadius: 8,
          padding: '16px 24px',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Reference time</div>
        <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'monospace', color: '#1677ff' }}>
          09:10
        </div>
      </div>

      {/* Target picker */}
      <div>
        <label htmlFor="tp-alarm" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 13 }}>
          Alarm time
        </label>
        <TimePicker
          id="tp-alarm"
          value={value}
          onChange={(time) => setValue(time)}
          format="HH:mm"
          placeholder="Select a time"
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="tp-alarm"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 11 }}>
          (Make Alarm time match the reference)
        </div>
      </div>
    </Card>
  );
}
