'use client';

/**
 * date_picker_range-antd-T04: Use a preset range chip
 *
 * A form_section layout (simple trip-planning form) with light
 * theme and comfortable spacing. Fields include 'Destination' (text input), 'Travel
 * dates' (AntD RangePicker), and a non-functional 'Notes' textarea (distractor but
 * not required). The RangePicker is empty initially. When opened, the calendar popover
 * shows a 'Preset ranges' area with clickable chips such as 'Memorial Day week (May
 * 25–May 31, 2026)', 'Independence Day week (Jul 4–Jul 10, 2026)', and 'Labor Day
 * weekend (Sep 5–Sep 7, 2026)'. Selecting a preset immediately fills the start and
 * end dates in the input and closes the popover (no separate OK button).
 *
 * Success: Start date = 2026-05-25, End date = 2026-05-31 (Travel dates instance)
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Input, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (
      value &&
      value[0] &&
      value[1] &&
      value[0].format('YYYY-MM-DD') === '2026-05-25' &&
      value[1].format('YYYY-MM-DD') === '2026-05-31'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const presets = [
    { label: 'Memorial Day week (May 25–May 31, 2026)', value: [dayjs('2026-05-25'), dayjs('2026-05-31')] as [Dayjs, Dayjs] },
    { label: 'Independence Day week (Jul 4–Jul 10, 2026)', value: [dayjs('2026-07-04'), dayjs('2026-07-10')] as [Dayjs, Dayjs] },
    { label: 'Labor Day weekend (Sep 5–Sep 7, 2026)', value: [dayjs('2026-09-05'), dayjs('2026-09-07')] as [Dayjs, Dayjs] },
  ];

  return (
    <Card title="Trip Planner" style={{ width: 550 }}>
      <Form layout="vertical">
        <Form.Item label="Destination">
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            data-testid="destination"
          />
        </Form.Item>

        <Form.Item label="Travel dates (use a preset)">
          <RangePicker
            id="travel-dates-range"
            value={value}
            onChange={(dates) => setValue(dates)}
            format="YYYY-MM-DD"
            placeholder={['Start date', 'End date']}
            style={{ width: '100%' }}
            data-testid="travel-dates-range"
            presets={presets}
          />
        </Form.Item>

        <Form.Item label="Notes">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            data-testid="notes"
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
