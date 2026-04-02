'use client';

/**
 * date_picker_range-antd-T01: Open Booking dates calendar
 *
 * Layout is an isolated card centered in the viewport with a single
 * Ant Design RangePicker labeled 'Booking dates'. Theme is light with comfortable
 * spacing and default component scale. The RangePicker is an input with two date
 * fields (start and end) separated by a small icon separator; it is initially empty
 * and shows a placeholder like 'Select date range'. Clicking anywhere in the input
 * opens a popover calendar panel (two months visible side-by-side) anchored to the
 * input. There are no other interactive elements on the card (no clutter).
 *
 * Success: The picker overlay/popover is open for the 'Booking dates' instance.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker } from 'antd';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <Card title="Booking dates" style={{ width: 500 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="booking-dates-range" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
          Booking dates
        </label>
        <RangePicker
          id="booking-dates-range"
          placeholder={['Start date', 'End date']}
          style={{ width: '100%' }}
          data-testid="booking-dates-range"
          open={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
        />
      </div>
    </Card>
  );
}
