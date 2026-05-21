'use client';

/**
 * datetime_picker_single-antd-T06: AntD set datetime on the correct instance (2 pickers)
 *
 * Layout: form_section titled "Availability" centered in the viewport.
 * Spacing: comfortable; fields are stacked with clear labels.
 * Instances: 2 datetime pickers (same canonical type) on the page:
 *   1) "Start time" (top)
 *   2) "End time" (bottom)  ← TARGET
 * Both are AntD DatePicker with showTime and allowClear.
 * Behavior: needConfirm=true (OK button required to commit).
 * Initial state:
 *   - Start time: "2026-03-01 09:00"
 *   - End time: "2026-03-01 17:00" (currently wrong; must change to 18:00)
 * Clutter (low): a non-interactive hint text about office hours and one unrelated checkbox "Send invite email" (not required).
 *
 * Success: Only the "End time" DatePicker is updated to 2026-03-01 18:00 (local time). The new value is committed via OK.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Checkbox, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('2026-03-01 09:00', 'YYYY-MM-DD HH:mm'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('2026-03-01 17:00', 'YYYY-MM-DD HH:mm'));
  const [sendInvite, setSendInvite] = useState(false);

  useEffect(() => {
    if (endTime && endTime.format('YYYY-MM-DD HH:mm') === '2026-03-01 18:00') {
      onSuccess();
    }
  }, [endTime, onSuccess]);

  return (
    <Card title="Availability" style={{ width: 400 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Set your available hours for meetings.
      </Text>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="dt-start" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Start time
        </label>
        <DatePicker
          id="dt-start"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={startTime}
          onChange={(datetime) => setStartTime(datetime)}
          placeholder="Select start time"
          allowClear
          needConfirm
          style={{ width: '100%' }}
          data-testid="dt-start"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="dt-end" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          End time
        </label>
        <DatePicker
          id="dt-end"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={endTime}
          onChange={(datetime) => setEndTime(datetime)}
          placeholder="Select end time"
          allowClear
          needConfirm
          style={{ width: '100%' }}
          data-testid="dt-end"
        />
      </div>

      <Checkbox checked={sendInvite} onChange={(e) => setSendInvite(e.target.checked)}>
        Send invite email
      </Checkbox>
    </Card>
  );
}
