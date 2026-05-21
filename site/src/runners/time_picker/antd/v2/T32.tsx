'use client';

/**
 * time_picker-antd-v2-T32: Audit cutoff at 13:07:30 with seconds in a compact drawer
 *
 * Drawer opened via "Edit audit cutoff"; TimePicker "Audit cutoff" with seconds, needConfirm, starts 13:00:00.
 *
 * Success: Committed time 13:07:30 after OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, TimePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T32({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Dayjs | null>(dayjs('13:00:00', 'HH:mm:ss'));
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (value && value.format('HH:mm:ss') === '13:07:30') {
      fired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ padding: 8 }}>
      <Button type="primary" size="small" onClick={() => setOpen(true)} data-testid="open-audit-drawer">
        Edit audit cutoff
      </Button>

      <Drawer
        title="Edit audit cutoff"
        placement="right"
        width={320}
        open={open}
        onClose={() => setOpen(false)}
        styles={{ body: { paddingTop: 12 } }}
      >
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>
          Compact editor — use OK in the picker to apply seconds.
        </Text>
        <label htmlFor="tp-audit-cutoff" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}>
          Audit cutoff
        </label>
        <TimePicker
          id="tp-audit-cutoff"
          value={value}
          onChange={(t) => setValue(t)}
          format="HH:mm:ss"
          needConfirm
          style={{ width: '100%' }}
          size="small"
          data-testid="tp-audit-cutoff"
        />
      </Drawer>
    </div>
  );
}
