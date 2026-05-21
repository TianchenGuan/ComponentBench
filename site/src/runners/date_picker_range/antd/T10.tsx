'use client';

/**
 * date_picker_range-antd-T10: Set an open-ended range (start only) with OK
 *
 * An isolated card placed near the bottom-left of the viewport
 * (placement bottom_left) using a dark theme. The card contains a single Ant Design
 * RangePicker labeled 'Project window (end date optional)'. The RangePicker is configured
 * to allow the end date to be empty (allowEmpty for end=true) and uses needConfirm=true,
 * so the calendar panel shows OK/Cancel actions. The input starts with both values
 * empty; helper text below the field says 'If the end date is unknown, leave it
 * blank and confirm.'
 *
 * Success: Start date = 2026-10-03, End date = null (empty), confirmed with OK
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    // Success when start is Oct 3, 2026 and end is null/empty, and was confirmed
    if (
      confirmedRef.current &&
      value &&
      value[0] &&
      value[0].format('YYYY-MM-DD') === '2026-10-03' &&
      !value[1]
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setValue(dates);
    // With needConfirm, onChange is only called when OK is pressed
    confirmedRef.current = true;
  };

  return (
    <Card title="Project window" style={{ width: 480 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Project window (end date optional)
        </label>
        <RangePicker
          value={value}
          onChange={handleChange}
          format="YYYY-MM-DD"
          placeholder={['Start date', 'End date (optional)']}
          style={{ width: '100%' }}
          data-testid="project-window-range"
          allowEmpty={[false, true]}
          needConfirm
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          If the end date is unknown, leave it blank and confirm.
        </Text>
      </div>
    </Card>
  );
}
