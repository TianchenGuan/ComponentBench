'use client';

/**
 * date_picker_single-antd-T09: Match the primary event date to a visual reference
 *
 * Scene: Centered isolated card in light theme with comfortable spacing.
 *
 * Reference: At the top of the card there is a non-interactive "Reference date" card showing a stylized calendar tile (month abbreviation + day number) and a small mini-month calendar with one day highlighted. This reference corresponds to a single target date.
 *
 * Target components: Two Ant Design DatePicker instances are stacked below the reference:
 * - "Primary event date" (TARGET) - initially empty.
 * - "Backup event date" (distractor) - initially set to "2027-10-03".
 *
 * Interaction: Each DatePicker opens its own popover calendar. To match the reference, the agent must navigate to the correct month/year (October 2027) and click the correct day.
 *
 * Distractors: A non-functional "Timezone" dropdown is present but does not affect success (clutter=low).
 *
 * Feedback: Selecting a day updates only the active input.
 *
 * Success: Target instance (Primary event date) must have selected date = 2027-10-10.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryDate, setPrimaryDate] = useState<Dayjs | null>(null);
  const [backupDate, setBackupDate] = useState<Dayjs | null>(dayjs('2027-10-03'));
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    if (primaryDate && primaryDate.format('YYYY-MM-DD') === '2027-10-10') {
      onSuccess();
    }
  }, [primaryDate, onSuccess]);

  return (
    <Card title="Event scheduling" style={{ width: 450 }}>
      {/* Visual Reference Card */}
      <div
        data-testid="ref-date"
        style={{
          background: '#f0f5ff',
          border: '1px solid #adc6ff',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Reference date</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          {/* Stylized calendar tile */}
          <div
            style={{
              background: '#1677ff',
              color: '#fff',
              borderRadius: 8,
              padding: '8px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 12, textTransform: 'uppercase' }}>Oct</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>10</div>
            <div style={{ fontSize: 12 }}>2027</div>
          </div>
          {/* Mini calendar visualization */}
          <div style={{ fontSize: 12, color: '#666' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>October 2027</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 20px)', gap: 2, fontSize: 10 }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontWeight: 500 }}>{d}</div>
              ))}
              {/* First week empty cells + days */}
              {[null, null, null, null, null, 1, 2].map((d, i) => (
                <div key={`w1-${i}`} style={{ textAlign: 'center' }}>{d || ''}</div>
              ))}
              {/* Second week - 10 is highlighted */}
              {[3, 4, 5, 6, 7, 8, 9].map((d) => (
                <div key={`w2-${d}`} style={{ textAlign: 'center' }}>{d}</div>
              ))}
              {/* Third week */}
              {[10, 11, 12, 13, 14, 15, 16].map((d) => (
                <div
                  key={`w3-${d}`}
                  style={{
                    textAlign: 'center',
                    background: d === 10 ? '#1677ff' : 'transparent',
                    color: d === 10 ? '#fff' : 'inherit',
                    borderRadius: 2,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <div>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Primary event date
          </label>
          <DatePicker
            value={primaryDate}
            onChange={(date) => setPrimaryDate(date)}
            format="YYYY-MM-DD"
            placeholder="Select date"
            style={{ width: '100%' }}
            data-testid="primary-event-date"
          />
        </div>

        <div>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Backup event date
          </label>
          <DatePicker
            value={backupDate}
            onChange={(date) => setBackupDate(date)}
            format="YYYY-MM-DD"
            placeholder="Select date"
            style={{ width: '100%' }}
            data-testid="backup-event-date"
          />
        </div>

        <div>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Timezone
          </label>
          <Select
            value={timezone}
            onChange={(val) => setTimezone(val)}
            style={{ width: '100%' }}
            options={[
              { value: 'UTC', label: 'UTC' },
              { value: 'EST', label: 'EST (UTC-5)' },
              { value: 'PST', label: 'PST (UTC-8)' },
            ]}
            data-testid="timezone-select"
          />
        </div>
      </Space>
    </Card>
  );
}
