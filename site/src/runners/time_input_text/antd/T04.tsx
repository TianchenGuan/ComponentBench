'use client';

/**
 * time_input_text-antd-T04: Match the suggested time badge
 * 
 * Layout: isolated_card centered. Light theme, comfortable spacing.
 * The card is titled "Pickup". At the top of the card there is a blue badge labeled "Suggested time" that displays "10:30".
 * Below it there is one AntD TimePicker labeled "Pickup time".
 * - Configuration: format='HH:mm', needConfirm=false, allowClear=true.
 * - Initial state: Pickup time is empty.
 * - The badge is purely informational; only the TimePicker value determines success.
 * - Clutter=low: the card includes the informational badge and a small help icon, but no other inputs.
 * 
 * Success: The TimePicker labeled "Pickup time" has committed value equal to the badge time (10:30).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker, Badge, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const targetTime = '10:30';

  useEffect(() => {
    if (value && value.format('HH:mm') === targetTime) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Pickup" style={{ width: 400 }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Badge 
          color="blue" 
          text={
            <span>
              Suggested time: <strong data-testid="suggested-time-badge">{targetTime}</strong>
            </span>
          } 
        />
        <QuestionCircleOutlined style={{ color: '#999', cursor: 'help' }} />
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="pickup-time" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Pickup time
        </label>
        <TimePicker
          id="pickup-time"
          value={value}
          onChange={(time) => setValue(time)}
          format="HH:mm"
          allowClear
          needConfirm={false}
          style={{ width: '100%' }}
          data-testid="pickup-time"
        />
      </div>
    </Card>
  );
}
