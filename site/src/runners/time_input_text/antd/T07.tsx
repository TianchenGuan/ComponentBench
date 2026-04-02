'use client';

/**
 * time_input_text-antd-T07: Set End time in a Start/End pair
 * 
 * Layout: form_section centered in the viewport. Light theme, comfortable spacing.
 * A form section titled "Working window" contains two AntD TimePicker fields:
 * 1) "Start time" (prefilled with 09:00)
 * 2) "End time" (empty)
 * - Both fields use format='HH:mm', allowClear=true, needConfirm=false.
 * - Distractors (clutter=low): above the section there is a text input "Name" and a non-functional "Timezone" dropdown; they are not required.
 * - Only the "End time" TimePicker value determines success.
 * 
 * Success: The TimePicker instance labeled "End time" has committed value 18:00 (24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker, Input, Select, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [startTime] = useState<Dayjs | null>(dayjs('09:00', 'HH:mm'));
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (endTime && endTime.format('HH:mm') === '18:00') {
      onSuccess();
    }
  }, [endTime, onSuccess]);

  return (
    <Card title="Working window" style={{ width: 450 }}>
      {/* Distractors */}
      <Form layout="vertical">
        <Form.Item label="Name" style={{ marginBottom: 16 }}>
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item label="Timezone" style={{ marginBottom: 24 }}>
          <Select placeholder="Select timezone" disabled>
            <Select.Option value="utc">UTC</Select.Option>
            <Select.Option value="est">EST</Select.Option>
          </Select>
        </Form.Item>
      </Form>

      {/* Target fields */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="start-time" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Start time
          </label>
          <TimePicker
            id="start-time"
            value={startTime}
            format="HH:mm"
            allowClear
            needConfirm={false}
            style={{ width: '100%' }}
            data-testid="start-time"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="end-time" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            End time
          </label>
          <TimePicker
            id="end-time"
            value={endTime}
            onChange={(time) => setEndTime(time)}
            format="HH:mm"
            allowClear
            needConfirm={false}
            style={{ width: '100%' }}
            data-testid="end-time"
          />
        </div>
      </div>
    </Card>
  );
}
