'use client';

/**
 * calendar_embedded-antd-T05: Pick a date in the Secondary calendar (two instances)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card is split into two columns with two Ant Design Calendar instances:
 *   - Left calendar labeled "Primary"
 *   - Right calendar labeled "Secondary"
 * Both calendars initially show February 2026 and start with no selected date.
 * Each calendar has its own small "Selected date:" readout directly beneath it.
 * The calendars are visually similar; the only distinguishing cue is the column label above each one.
 * There is no other UI on the page (clutter: none).
 *
 * Success: The selected date of the Secondary calendar equals 2026-02-24.
 *          The Primary calendar remains unmodified (still has no selected date).
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryDate, setPrimaryDate] = useState<Dayjs | null>(null);
  const [secondaryDate, setSecondaryDate] = useState<Dayjs | null>(null);
  const [primaryMonth, setPrimaryMonth] = useState<Dayjs>(dayjs('2026-02-01'));
  const [secondaryMonth, setSecondaryMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (
      secondaryDate &&
      secondaryDate.format('YYYY-MM-DD') === '2026-02-24' &&
      primaryDate === null
    ) {
      onSuccess();
    }
  }, [primaryDate, secondaryDate, onSuccess]);

  return (
    <Card style={{ width: 700 }} data-testid="calendar-card">
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Primary Calendar */}
        <div style={{ flex: 1 }} data-testid="calendar-primary">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Primary</div>
          <Calendar
            fullscreen={false}
            value={primaryMonth}
            onSelect={(date) => setPrimaryDate(date)}
            onPanelChange={(date) => setPrimaryMonth(date)}
          />
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>Selected date: </span>
            <span data-testid="primary-selected">
              {primaryDate ? primaryDate.format('YYYY-MM-DD') : '—'}
            </span>
          </div>
        </div>

        {/* Secondary Calendar */}
        <div style={{ flex: 1 }} data-testid="calendar-secondary">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Secondary</div>
          <Calendar
            fullscreen={false}
            value={secondaryMonth}
            onSelect={(date) => setSecondaryDate(date)}
            onPanelChange={(date) => setSecondaryMonth(date)}
          />
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>Selected date: </span>
            <span data-testid="secondary-selected">
              {secondaryDate ? secondaryDate.format('YYYY-MM-DD') : '—'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
