'use client';

/**
 * time_picker-antd-v2-T34: Recovery from partial draft in adjacent time pickers
 *
 * Meeting card: Start 7:00 PM (fixed), End 7:30 PM initially; both 12h + needConfirm. Target End 9:05 PM.
 *
 * Success: End committed 21:05; start remains 19:00.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TimePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T34({ onSuccess }: TaskComponentProps) {
  const [start, setStart] = useState<Dayjs | null>(dayjs().hour(19).minute(0).second(0).millisecond(0));
  const [end, setEnd] = useState<Dayjs | null>(dayjs().hour(19).minute(30).second(0).millisecond(0));
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (
      start &&
      end &&
      start.format('HH:mm') === '19:00' &&
      end.format('HH:mm') === '21:05'
    ) {
      fired.current = true;
      onSuccess();
    }
  }, [start, end, onSuccess]);

  return (
    <Card title="Meeting" size="small" style={{ width: 400 }}>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>
        Adjacent pickers — drafts need OK. Change only End time.
      </Text>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="tp-meet-start" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}>
            Start time
          </label>
          <TimePicker
            id="tp-meet-start"
            value={start}
            onChange={(t) => setStart(t)}
            use12Hours
            format="h:mm A"
            needConfirm
            style={{ width: '100%' }}
            size="small"
            data-testid="tp-meet-start"
          />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="tp-meet-end" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}>
            End time
          </label>
          <TimePicker
            id="tp-meet-end"
            value={end}
            onChange={(t) => setEnd(t)}
            use12Hours
            format="h:mm A"
            needConfirm
            style={{ width: '100%' }}
            size="small"
            data-testid="tp-meet-end"
          />
        </div>
      </div>
    </Card>
  );
}
