'use client';

/**
 * datetime_picker_single-antd-T09: AntD small/compact dashboard with 3 instances
 *
 * Theme: light. Spacing: compact. Scale: small (inputs and icons are reduced).
 * Layout: dashboard with three small cards in a row: Primary schedule, Backup schedule, Staging schedule.
 * Instances: 3 AntD DatePicker(showTime) inputs with identical styling:
 *   - "Primary schedule" (left)
 *   - "Backup schedule" (center)  ← TARGET
 *   - "Staging schedule" (right)
 * Each picker uses format "YYYY-MM-DD HH:mm" and shows an OK confirm button (needConfirm=true).
 * Initial state:
 *   - Primary: 2026-03-15 06:05 (already correct but NOT the target instance)
 *   - Backup: 2026-03-15 06:00 (must change minutes to 05)
 *   - Staging: 2026-03-15 06:05 (distractor correct value)
 * Clutter (medium): the dashboard also contains a small line chart and a "Refresh" button; they do nothing for success.
 *
 * Success: Only the DatePicker labeled "Backup schedule" is committed to 2026-03-15 06:05.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primarySchedule, setPrimarySchedule] = useState<Dayjs | null>(dayjs('2026-03-15 06:05', 'YYYY-MM-DD HH:mm'));
  const [backupSchedule, setBackupSchedule] = useState<Dayjs | null>(dayjs('2026-03-15 06:00', 'YYYY-MM-DD HH:mm'));
  const [stagingSchedule, setStagingSchedule] = useState<Dayjs | null>(dayjs('2026-03-15 06:05', 'YYYY-MM-DD HH:mm'));

  useEffect(() => {
    if (backupSchedule && backupSchedule.format('YYYY-MM-DD HH:mm') === '2026-03-15 06:05') {
      onSuccess();
    }
  }, [backupSchedule, onSuccess]);

  return (
    <div style={{ width: 700 }}>
      {/* Header with refresh button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Schedules</h3>
        <Button size="small" icon={<ReloadOutlined />}>Refresh</Button>
      </div>

      {/* Mini chart placeholder (clutter) */}
      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#999', fontSize: 12 }}>📊 System load chart</span>
      </div>

      {/* Three schedule cards */}
      <Space size="small" style={{ display: 'flex' }}>
        <Card size="small" title="Primary schedule" style={{ width: 210 }}>
          <DatePicker
            size="small"
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={primarySchedule}
            onChange={(datetime) => setPrimarySchedule(datetime)}
            needConfirm
            style={{ width: '100%' }}
            data-testid="dt-primary"
          />
        </Card>

        <Card size="small" title="Backup schedule" style={{ width: 210 }}>
          <DatePicker
            size="small"
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={backupSchedule}
            onChange={(datetime) => setBackupSchedule(datetime)}
            needConfirm
            style={{ width: '100%' }}
            data-testid="dt-backup"
          />
        </Card>

        <Card size="small" title="Staging schedule" style={{ width: 210 }}>
          <DatePicker
            size="small"
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={stagingSchedule}
            onChange={(datetime) => setStagingSchedule(datetime)}
            needConfirm
            style={{ width: '100%' }}
            data-testid="dt-staging"
          />
        </Card>
      </Space>
    </div>
  );
}
