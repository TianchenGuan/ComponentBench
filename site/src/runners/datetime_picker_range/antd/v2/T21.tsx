'use client';

/**
 * datetime_picker_range-antd-v2-T21: Backup window in drawer — readOnly target + needConfirm
 */

import React, { useState, useEffect } from 'react';
import { Button, Drawer, DatePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const PRIMARY: [Dayjs, Dayjs] = [
  dayjs('2027-02-18 09:00', 'YYYY-MM-DD HH:mm'),
  dayjs('2027-02-18 10:00', 'YYYY-MM-DD HH:mm'),
];

export default function T21({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [backupValue, setBackupValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (!backupValue?.[0] || !backupValue[1]) return;
    const startOk = backupValue[0].format('YYYY-MM-DD HH:mm') === '2027-02-20 14:00';
    const endOk = backupValue[1].format('YYYY-MM-DD HH:mm') === '2027-02-20 15:15';
    if (startOk && endOk) {
      onSuccess();
    }
  }, [backupValue, onSuccess]);

  return (
    <div style={{ padding: 8 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open scheduling drawer
      </Button>
      <Drawer
        title="Scheduling"
        placement="right"
        width={420}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
          Edit only Backup window. Primary window must stay as shown.
        </Text>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Primary window</label>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={PRIMARY}
            disabled
            style={{ width: '100%' }}
            data-cb-instance="Primary window"
            data-testid="dt-range-primary"
          />
        </div>
        <div>
          <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Backup window</label>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={backupValue}
            onChange={(dates) => setBackupValue(dates)}
            placeholder={['Start', 'End']}
            style={{ width: '100%' }}
            inputReadOnly
            data-cb-instance="Backup window"
            data-testid="dt-range-backup"
            needConfirm
          />
        </div>
      </Drawer>
    </div>
  );
}
