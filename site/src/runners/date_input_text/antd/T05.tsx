'use client';

/**
 * date_input_text-antd-T05: AntD pick the correct field among two instances
 * 
 * Layout: form_section centered in the viewport, resembling a typical booking form.
 * Components: Two Ant Design DatePicker inputs shown inline in the same section:
 *   1) "Start date" (pre-filled with 2026-05-10)
 *   2) "End date" (empty)
 * Both fields use the same YYYY-MM-DD format and both allow manual typing.
 * Sub-controls: each input has its own calendar icon and clear behavior.
 * Distractors (clutter=low): there is also a "Guests" numeric input and a disabled "Promo code" text box, but they do not affect success.
 * Feedback: the "End date" field shows the selected/typed date once committed.
 * 
 * Success: The "End date" DatePicker value equals 2026-05-20.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, InputNumber, Input, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2026-05-10'));
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [guests, setGuests] = useState<number | null>(2);

  useEffect(() => {
    if (endDate && endDate.format('YYYY-MM-DD') === '2026-05-20') {
      onSuccess();
    }
  }, [endDate, onSuccess]);

  return (
    <Card title="Booking" style={{ width: 480 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <label htmlFor="start-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Start date
          </label>
          <DatePicker
            id="start-date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            style={{ width: '100%' }}
            data-testid="start-date"
            allowClear
          />
        </div>

        <div>
          <label htmlFor="end-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            End date
          </label>
          <DatePicker
            id="end-date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            style={{ width: '100%' }}
            data-testid="end-date"
            allowClear
          />
        </div>

        <div>
          <label htmlFor="guests" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Guests
          </label>
          <InputNumber
            id="guests"
            value={guests}
            onChange={(val) => setGuests(val)}
            min={1}
            max={10}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="promo-code" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Promo code
          </label>
          <Input
            id="promo-code"
            placeholder="Enter code"
            disabled
            style={{ width: '100%' }}
          />
        </div>
      </Space>
    </Card>
  );
}
