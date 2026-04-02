'use client';

/**
 * datetime_picker_range-antd-T05: Backup window: set range in a form with two pickers
 *
 * Layout: form_section centered with a short 'Schedule settings' form.
 * Light theme, comfortable spacing, default scale.
 * Two AntD RangePickers with showTime are present and visually similar: "Primary window" (pre-filled) and "Backup window" (empty).
 * Each RangePicker opens a popover calendar+time panel and requires clicking "OK" to commit the selection.
 * Clutter: low—there is a text input labeled "Job name" and a toggle "Notify on failure", but they do not affect success.
 *
 * Success: The "Backup window" RangePicker equals start=2026-02-20T14:00:00, end=2026-02-20T15:15:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Input, Switch, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryValue] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs('2026-02-18 09:00', 'YYYY-MM-DD HH:mm'),
    dayjs('2026-02-18 10:00', 'YYYY-MM-DD HH:mm'),
  ]);
  const [backupValue, setBackupValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [jobName, setJobName] = useState('Daily Backup');
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (backupValue && backupValue[0] && backupValue[1]) {
      const startMatch = backupValue[0].format('YYYY-MM-DD HH:mm') === '2026-02-20 14:00';
      const endMatch = backupValue[1].format('YYYY-MM-DD HH:mm') === '2026-02-20 15:15';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [backupValue, onSuccess]);

  return (
    <Card title="Schedule Settings" style={{ width: 500 }}>
      {/* Clutter controls */}
      <div style={{ marginBottom: 16 }}>
        <Text style={{ display: 'block', marginBottom: 4 }}>Job name</Text>
        <Input
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          style={{ width: '100%', marginBottom: 12 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Notify on failure</Text>
          <Switch checked={notify} onChange={setNotify} />
        </div>
      </div>

      {/* Primary window (pre-filled) */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Primary window
        </label>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={primaryValue}
          disabled
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Primary window"
          data-testid="dt-range-primary"
        />
      </div>

      {/* Backup window (empty, target) */}
      <div>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Backup window
        </label>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={backupValue}
          onChange={(dates) => setBackupValue(dates)}
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Backup window"
          data-testid="dt-range-backup"
          needConfirm
        />
      </div>
    </Card>
  );
}
