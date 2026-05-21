'use client';

/**
 * datetime_picker_single-antd-T05: AntD match a reference datetime in settings panel
 *
 * Layout: settings_panel with a left "System Settings" nav and a main content area; the target field is in the main panel.
 * Clutter (low): a few unrelated toggles (Email alerts, Auto-update) and a plain text input (Hostname). None affect success.
 * Target component: one AntD DatePicker with showTime labeled "Maintenance window start".
 * Guidance: a blue "Reference" badge above the field shows the desired datetime in human format: "Reference: Tue, Feb 17, 2026 · 10:00 AM".
 * Behavior: needConfirm=true so the picker footer has an OK button. allowClear=true.
 * Initial state: currently set to "2026-02-17 09:00" (one hour off) to prevent no-op success.
 *
 * Success: The DatePicker labeled "Maintenance window start" equals the reference badge datetime (Tue, Feb 17, 2026 10:00 AM).
 *          The value is committed by clicking OK.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Switch, Input, Badge, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-02-17 09:00', 'YYYY-MM-DD HH:mm'));
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-02-17 10:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* Left sidebar */}
      <div style={{ width: 180, background: '#fafafa', padding: 16, borderRadius: 8 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>System Settings</div>
        <div style={{ color: '#666', marginBottom: 8 }}>General</div>
        <div style={{ color: '#1677ff', marginBottom: 8, fontWeight: 500 }}>Maintenance</div>
        <div style={{ color: '#666', marginBottom: 8 }}>Security</div>
      </div>

      {/* Main panel */}
      <Card title="Maintenance" style={{ flex: 1, maxWidth: 450 }}>
        {/* Clutter controls */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>Email alerts</Text>
            <Switch checked={emailAlerts} onChange={setEmailAlerts} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>Auto-update</Text>
            <Switch checked={autoUpdate} onChange={setAutoUpdate} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Text style={{ display: 'block', marginBottom: 4 }}>Hostname</Text>
            <Input defaultValue="server-01" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Target field with reference */}
        <div>
          <Badge.Ribbon
            text="Reference: Tue, Feb 17, 2026 · 10:00 AM"
            color="blue"
            style={{ marginRight: -12 }}
          >
            <div
              data-testid="ref-maintenance-start"
              style={{ paddingTop: 8, paddingRight: 120 }}
            >
              <label htmlFor="dt-maintenance" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
                Maintenance window start
              </label>
              <DatePicker
                id="dt-maintenance"
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                value={value}
                onChange={(datetime) => setValue(datetime)}
                placeholder="Select date and time"
                allowClear
                needConfirm
                style={{ width: '100%' }}
                data-testid="dt-maintenance-start"
              />
            </div>
          </Badge.Ribbon>
        </div>
      </Card>
    </div>
  );
}
