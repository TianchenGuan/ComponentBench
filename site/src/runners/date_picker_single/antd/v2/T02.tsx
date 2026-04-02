'use client';

/**
 * date_picker_single-antd-v2-T02: Follow-up date in drawer with disabled weekends and blackout days
 */

import React, { useState, useEffect } from 'react';
import { Button, Drawer, DatePicker, Card, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [followUp, setFollowUp] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (followUp && followUp.format('YYYY-MM-DD') === '2026-10-13') {
      onSuccess();
    }
  }, [followUp, onSuccess]);

  const disabledDate = (current: Dayjs) => {
    const dow = current.day();
    if (dow === 0 || dow === 6) return true;
    const iso = current.format('YYYY-MM-DD');
    return iso === '2026-10-12' || iso === '2026-10-14';
  };

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Edit follow-up plan
      </Button>
      <Drawer title="Follow-up plan" placement="right" width={400} open={open} onClose={() => setOpen(false)}>
        <Card size="small" style={{ marginBottom: 12 }} styles={{ body: { padding: 12 } }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Business-day scheduling only: weekends and listed blackout days cannot be selected.
          </Text>
        </Card>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="follow-up-date" style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>
            Follow-up date
          </label>
          <DatePicker
            id="follow-up-date"
            value={followUp}
            onChange={(d) => setFollowUp(d)}
            format="YYYY-MM-DD"
            placeholder="Select date"
            style={{ width: '100%' }}
            data-testid="follow-up-date"
            needConfirm
            disabledDate={disabledDate}
            defaultPickerValue={dayjs('2026-02-01')}
          />
        </div>
        <Card size="small" title="Summary" styles={{ header: { fontSize: 13 } }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Last touch: none
          </Text>
        </Card>
        <Card size="small" title="SLA" style={{ marginTop: 8 }} styles={{ header: { fontSize: 13 } }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Target response: 24h
          </Text>
        </Card>
      </Drawer>
    </div>
  );
}
