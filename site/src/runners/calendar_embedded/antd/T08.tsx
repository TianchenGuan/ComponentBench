'use client';

/**
 * calendar_embedded-antd-T08: Select a date and press Apply in a dark settings panel
 *
 * Layout: settings_panel (dark theme, comfortable spacing, default scale) centered in the viewport.
 * The panel section is titled "Maintenance window" and contains one embedded Ant Design Calendar labeled "Maintenance date".
 * The calendar initially shows February 2026 with no committed selection.
 * Interaction is two-phase:
 *   1) Clicking a day sets a "Pending" highlight on the calendar (visual selection state).
 *   2) The choice is only committed when the user clicks the primary button labeled "Apply" in the panel footer.
 * The panel footer contains two buttons: "Cancel" (secondary) and "Apply" (primary). Clicking Cancel reverts any pending selection back to the last committed value (initially none).
 * A readout line labeled "Confirmed date:" displays the committed ISO date (YYYY-MM-DD) and updates only after Apply is pressed.
 * No other interactive controls affect success (clutter is limited to the settings panel chrome).
 *
 * Success: The committed/confirmed date equals 2027-01-19.
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar, Button, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [pendingDate, setPendingDate] = useState<Dayjs | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs('2026-02-01'));

  useEffect(() => {
    if (confirmedDate && confirmedDate.format('YYYY-MM-DD') === '2027-01-19') {
      onSuccess();
    }
  }, [confirmedDate, onSuccess]);

  const handleSelect = (date: Dayjs) => {
    setPendingDate(date);
    setCurrentMonth(date);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  const handleApply = () => {
    if (pendingDate) {
      setConfirmedDate(pendingDate);
      setPendingDate(null);
    }
  };

  const handleCancel = () => {
    setPendingDate(null);
  };

  return (
    <Card
      title="Maintenance window"
      style={{ width: 420, background: '#1f1f1f', border: '1px solid #333' }}
      headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
      bodyStyle={{ background: '#1f1f1f' }}
      data-testid="settings-panel"
    >
      <div style={{ marginBottom: 8, color: '#ccc', fontWeight: 500 }}>Maintenance date</div>
      <div style={{ background: '#2a2a2a', padding: 8, borderRadius: 4 }}>
        <Calendar
          fullscreen={false}
          value={currentMonth}
          onSelect={handleSelect}
          onPanelChange={handlePanelChange}
          data-testid="calendar-embedded"
        />
      </div>
      
      <div style={{ marginTop: 16, fontSize: 14, color: '#ccc' }}>
        <span style={{ fontWeight: 500 }}>Confirmed date: </span>
        <span data-testid="confirmed-date">
          {confirmedDate ? confirmedDate.format('YYYY-MM-DD') : '(none)'}
        </span>
      </div>

      {pendingDate && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#999' }}>
          <span>Pending: </span>
          <span data-testid="pending-date">{pendingDate.format('YYYY-MM-DD')}</span>
        </div>
      )}

      <div style={{ marginTop: 16, borderTop: '1px solid #333', paddingTop: 16 }}>
        <Space>
          <Button onClick={handleCancel} data-testid="cancel-button">
            Cancel
          </Button>
          <Button type="primary" onClick={handleApply} data-testid="apply-button">
            Apply
          </Button>
        </Space>
      </div>
    </Card>
  );
}
