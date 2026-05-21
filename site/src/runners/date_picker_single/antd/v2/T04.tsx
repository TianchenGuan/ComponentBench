'use client';

/**
 * date_picker_single-antd-v2-T04: Archived on in nested scroll + picker OK + Apply metadata
 */

import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [archivedOn, setArchivedOn] = useState<Dayjs | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (applied && archivedOn && archivedOn.format('YYYY-MM-DD') === '1998-12-31') {
      onSuccess();
    }
  }, [applied, archivedOn, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16, maxWidth: 720 }}>
      <div
        style={{
          flex: 1,
          maxHeight: 320,
          overflowY: 'auto',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 12,
          background: '#fafafa',
        }}
      >
        <Text strong>Activity</Text>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 12 }}>
            Event {i + 1}: review queue updated
          </div>
        ))}
      </div>
      <div
        style={{
          width: 300,
          maxHeight: 220,
          overflowY: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          padding: 12,
        }}
        data-testid="metadata-scroll-panel"
      >
        <Text strong style={{ display: 'block', marginBottom: 12 }}>
          Metadata
        </Text>
        <div style={{ marginBottom: 10 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Owner
          </Text>
          <Input size="small" defaultValue="Records team" style={{ marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Retention tag
          </Text>
          <Input size="small" defaultValue="Standard" style={{ marginTop: 4 }} />
        </div>
        <div style={{ height: 180 }} />
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="archived-on" style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>
            Archived on
          </label>
          <DatePicker
            id="archived-on"
            value={archivedOn}
            onChange={(d) => setArchivedOn(d)}
            format="YYYY-MM-DD"
            placeholder="Select date"
            style={{ width: '100%' }}
            data-testid="archived-on"
            needConfirm
            defaultPickerValue={dayjs('2026-02-01')}
          />
        </div>
        <Button type="primary" block style={{ marginTop: 8 }} onClick={() => setApplied(true)} data-testid="apply-metadata">
          Apply metadata
        </Button>
      </div>
    </div>
  );
}
