'use client';

/**
 * date_input_text-antd-T08: AntD masked date input in dark compact small card
 * 
 * Layout: isolated_card anchored at the top-right of the viewport (not centered).
 * Theme/spacing: dark theme with compact spacing; the component uses the small size variant.
 * Component: one Ant Design DatePicker labeled "Cutoff date".
 * Configuration: the field uses a mask-like date format (YYYY-MM-DD) where the caret advances by segments; the placeholder shows a partially formatted mask (e.g., "YYYY-MM-DD" with guides).
 * Initial state: empty. No popup is open.
 * Sub-controls/behavior: the input attempts to align to the last valid date on blur if the typed text is close but incomplete; arrow keys can move between segments; the calendar icon is present but small.
 * Distractors: none.
 * Feedback: once a valid date is committed, the masked field displays the fully formatted date.
 * 
 * Success: The "Cutoff date" value equals 2026-12-31 after the input is committed.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, ConfigProvider, theme } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '2026-12-31') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          padding: 12,
        },
      }}
    >
      <Card 
        title="Cutoff" 
        style={{ width: 280 }}
        size="small"
      >
        <div>
          <label htmlFor="cutoff-date" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}>
            Cutoff date
          </label>
          <DatePicker
            id="cutoff-date"
            value={value}
            onChange={(date) => setValue(date)}
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            style={{ width: '100%' }}
            size="small"
            data-testid="cutoff-date"
            allowClear
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
