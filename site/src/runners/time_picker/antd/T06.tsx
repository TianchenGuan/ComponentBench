'use client';

/**
 * time_picker-antd-T06: Set End time to 17:45 (two fields)
 *
 * The page shows a form section titled "Scheduling" centered in the viewport. Within the section are several
 * common form fields (a text input for "Title", a dropdown for "Timezone", and a checkbox for "All-day") that serve as realistic
 * clutter but are not required for success. The target components are two Ant Design TimePicker inputs: one labeled "Start
 * time" (initially 09:00) and one labeled "End time" (initially 17:00). Both use 24-hour HH:mm format and open a dropdown
 * with hour/minute scroll columns. needConfirm is disabled so selection commits immediately. The task specifically targets
 * the "End time" instance.
 *
 * Scene: layout=form_section, instances=2, clutter=low
 *
 * Success: The TimePicker instance labeled "End time" has canonical time value exactly 17:45 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker, Input, Select, Checkbox, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('09:00', 'HH:mm'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('17:00', 'HH:mm'));

  useEffect(() => {
    if (endTime && endTime.format('HH:mm') === '17:45') {
      onSuccess();
    }
  }, [endTime, onSuccess]);

  return (
    <Card title="Scheduling" style={{ width: 450 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Clutter fields */}
        <div>
          <label htmlFor="title" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Title
          </label>
          <Input id="title" placeholder="Event title" style={{ width: '100%' }} />
        </div>

        <div>
          <label htmlFor="timezone" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Timezone
          </label>
          <Select
            id="timezone"
            defaultValue="UTC"
            style={{ width: '100%' }}
            options={[
              { value: 'UTC', label: 'UTC' },
              { value: 'EST', label: 'EST' },
              { value: 'PST', label: 'PST' },
            ]}
          />
        </div>

        <Checkbox>All-day</Checkbox>

        {/* Target fields */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="tp-start" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Start time
            </label>
            <TimePicker
              id="tp-start"
              value={startTime}
              onChange={(time) => setStartTime(time)}
              format="HH:mm"
              needConfirm={false}
              style={{ width: '100%' }}
              data-testid="tp-start"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="tp-end" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              End time
            </label>
            <TimePicker
              id="tp-end"
              value={endTime}
              onChange={(time) => setEndTime(time)}
              format="HH:mm"
              needConfirm={false}
              style={{ width: '100%' }}
              data-testid="tp-end"
            />
          </div>
        </div>

        <div style={{ color: '#666', fontSize: 12 }}>
          (Set End time to 17:45)
        </div>
      </Space>
    </Card>
  );
}
