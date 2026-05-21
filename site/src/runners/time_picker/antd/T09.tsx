'use client';

/**
 * time_picker-antd-T09: Set dinner time to 9:05 PM (12-hour, confirm)
 *
 * A compact-density isolated card is centered. It contains one Ant Design TimePicker labeled "Dinner time",
 * rendered in the small size tier. The picker is configured with use12Hours=true (12-hour format with an AM/PM selector)
 * and displays times like "9:05 PM". The dropdown panel includes scroll columns for hour, minute, and meridiem (AM/PM).
 * needConfirm=true is enabled, so after selecting 9, 05, and PM, the user must click the "OK" button in the panel to commit
 * the change. The initial value shown is 7:00 PM.
 *
 * Scene: spacing=compact, scale=small
 *
 * Success: The "Dinner time" TimePicker has canonical time value exactly 21:05 (24-hour equivalent of 9:05 PM).
 *          The value must be committed via the panel's "OK" button (needConfirm enabled).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('19:00', 'HH:mm'));

  useEffect(() => {
    if (value && value.format('HH:mm') === '21:05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Meal Schedule" style={{ width: 320 }} styles={{ body: { padding: 12 } }}>
      <div>
        <label htmlFor="tp-dinner" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 13 }}>
          Dinner time
        </label>
        <TimePicker
          id="tp-dinner"
          size="small"
          value={value}
          onChange={(time) => setValue(time)}
          format="h:mm A"
          use12Hours
          needConfirm={true}
          style={{ width: '100%' }}
          data-testid="tp-dinner"
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: 11 }}>
          (Set to 9:05 PM and confirm with OK)
        </div>
      </div>
    </Card>
  );
}
