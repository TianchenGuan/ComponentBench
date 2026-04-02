'use client';

/**
 * time_picker-antd-v2-T31: Quiet hours end at 11:45 PM with 12-hour confirm among two fields
 *
 * Alert settings card (compact, high clutter): toggles and badges above two TimePickers.
 * "Quiet hours start" stays 08:00; "Quiet hours end" starts 10:00 PM, use12Hours + needConfirm.
 *
 * Success: End time committed 23:45; start remains 08:00 (after OK on end picker).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TimePicker, Space, Switch, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T31({ onSuccess }: TaskComponentProps) {
  const [start, setStart] = useState<Dayjs | null>(dayjs().hour(8).minute(0).second(0).millisecond(0));
  const [end, setEnd] = useState<Dayjs | null>(dayjs().hour(22).minute(0).second(0).millisecond(0));
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (
      start &&
      end &&
      start.format('HH:mm') === '08:00' &&
      end.format('HH:mm') === '23:45'
    ) {
      fired.current = true;
      onSuccess();
    }
  }, [start, end, onSuccess]);

  return (
    <Card title="Alert settings" size="small" style={{ width: 380 }}>
      <Space wrap size={[4, 8]} style={{ marginBottom: 12 }}>
        <Tag color="blue">Priority</Tag>
        <Tag>Digest</Tag>
        <Space align="center">
          <Switch size="small" defaultChecked />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Push
          </Text>
        </Space>
        <Space align="center">
          <Switch size="small" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            SMS
          </Text>
        </Space>
      </Space>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="tp-quiet-start" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}>
          Quiet hours start
        </label>
        <TimePicker
          id="tp-quiet-start"
          value={start}
          onChange={(t) => setStart(t)}
          use12Hours
          format="h:mm A"
          needConfirm
          style={{ width: '100%' }}
          size="small"
          data-testid="tp-quiet-start"
        />
      </div>

      <div>
        <label htmlFor="tp-quiet-end" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}>
          Quiet hours end
        </label>
        <TimePicker
          id="tp-quiet-end"
          value={end}
          onChange={(t) => setEnd(t)}
          use12Hours
          format="h:mm A"
          needConfirm
          style={{ width: '100%' }}
          size="small"
          data-testid="tp-quiet-end"
        />
        <Text type="secondary" style={{ fontSize: 11, marginTop: 6, display: 'block' }}>
          Set end to 11:45 PM and confirm with OK. Leave start unchanged.
        </Text>
      </div>
    </Card>
  );
}
