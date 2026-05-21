'use client';

/**
 * datetime_picker_range-antd-v2-T22: Cutover window — seconds + cross-midnight, drawer bottom context
 */

import React, { useState, useEffect } from 'react';
import { Button, Drawer, DatePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function T22({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (!value?.[0] || !value[1]) return;
    const startOk = value[0].format('YYYY-MM-DD HH:mm:ss') === '2026-11-07 23:30:15';
    const endOk = value[1].format('YYYY-MM-DD HH:mm:ss') === '2026-11-08 01:15:45';
    if (startOk && endOk) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div
      style={{
        padding: 8,
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}
    >
      <Button type="primary" size="small" onClick={() => setOpen(true)}>
        Cutover plan
      </Button>
      <Drawer
        title="Cutover plan"
        placement="bottom"
        height={320}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
          Set Cutover window (includes seconds). Confirm with OK in the picker.
        </Text>
        <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Cutover window</label>
        <RangePicker
          showTime={{ format: 'HH:mm:ss' }}
          format="YYYY-MM-DD HH:mm:ss"
          value={value}
          onChange={(dates) => setValue(dates)}
          placeholder={['Start', 'End']}
          style={{ width: '100%', maxWidth: 520 }}
          data-cb-instance="Cutover window"
          data-testid="dt-range-cutover"
          needConfirm
        />
      </Drawer>
    </div>
  );
}
