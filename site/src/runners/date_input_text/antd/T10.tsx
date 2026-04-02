'use client';

/**
 * date_input_text-antd-T10: AntD match reference date with Apply in a cluttered dashboard
 * 
 * Layout: dashboard scene anchored at the bottom-right of the viewport (not centered).
 * Components: Two Ant Design DatePicker inputs in a "Deadlines" panel:
 *   - "Primary deadline" (pre-filled with 2026-04-01)
 *   - "Backup deadline" (empty)
 * Both use YYYY-MM-DD format and allow manual typing.
 * Visual reference: a separate tile labeled "Reference calendar" shows the target date prominently as "APR 09 2026".
 * Clutter (medium): the dashboard also contains a small activity feed and two filter chips; they are irrelevant.
 * Confirmation: a sticky footer bar contains "Discard" and a primary "Apply changes" button. Changes are not persisted until "Apply changes" is clicked.
 * Feedback: clicking "Apply changes" shows a toast "Changes applied" and the sticky bar disappears.
 * 
 * Success: The "Backup deadline" DatePicker value equals the reference date 2026-04-09 AND user clicked "Apply changes".
 */

import React, { useState, useRef } from 'react';
import { Card, DatePicker, Button, Space, Tag, Typography, message, List } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [primaryDeadline, setPrimaryDeadline] = useState<Dayjs | null>(dayjs('2026-04-01'));
  const [backupDeadline, setBackupDeadline] = useState<Dayjs | null>(null);
  const [applied, setApplied] = useState(false);
  const successTriggered = useRef(false);

  const activityFeed = [
    'User logged in at 9:00 AM',
    'Report generated at 10:15 AM',
    'Settings updated at 11:30 AM',
  ];

  const handleApply = () => {
    if (backupDeadline && backupDeadline.format('YYYY-MM-DD') === '2026-04-09' && !successTriggered.current) {
      successTriggered.current = true;
      setApplied(true);
      message.success('Changes applied');
      onSuccess();
    } else {
      message.info('Changes applied');
      setApplied(true);
    }
  };

  const handleDiscard = () => {
    setBackupDeadline(null);
    setPrimaryDeadline(dayjs('2026-04-01'));
  };

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {/* Main Dashboard Panel */}
      <Card title="Deadlines" style={{ width: 360 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <label htmlFor="primary-deadline" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
              Primary deadline
            </label>
            <DatePicker
              id="primary-deadline"
              value={primaryDeadline}
              onChange={(date) => setPrimaryDeadline(date)}
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              style={{ width: '100%' }}
              data-testid="primary-deadline"
              allowClear
            />
          </div>

          <div>
            <label htmlFor="backup-deadline" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
              Backup deadline
            </label>
            <DatePicker
              id="backup-deadline"
              value={backupDeadline}
              onChange={(date) => setBackupDeadline(date)}
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              style={{ width: '100%' }}
              data-testid="backup-deadline"
              allowClear
            />
          </div>

          {/* Filter chips (distractors) */}
          <div>
            <Space>
              <Tag>Q1 2026</Tag>
              <Tag>All Teams</Tag>
            </Space>
          </div>

          {/* Activity feed (distractor) */}
          <div>
            <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
              Recent Activity
            </Text>
            <List
              size="small"
              dataSource={activityFeed}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 0', fontSize: 11, color: '#888' }}>
                  {item}
                </List.Item>
              )}
            />
          </div>

          {/* Sticky footer bar */}
          {!applied && (
            <div style={{ 
              borderTop: '1px solid #e8e8e8', 
              paddingTop: 12, 
              marginTop: 8,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}>
              <Button onClick={handleDiscard}>
                Discard
              </Button>
              <Button 
                type="primary" 
                onClick={handleApply}
                data-testid="apply-changes"
              >
                Apply changes
              </Button>
            </div>
          )}
        </Space>
      </Card>

      {/* Reference Calendar Tile */}
      <Card style={{ width: 200 }}>
        <div
          data-testid="reference-calendar-tile"
          style={{
            textAlign: 'center',
            padding: 16,
          }}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8, fontWeight: 600 }}>
            REFERENCE CALENDAR
          </div>
          <div style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#1677ff',
            letterSpacing: 1,
            padding: '12px 8px',
            border: '2px solid #1677ff',
            borderRadius: 8,
          }}>
            APR 09 2026
          </div>
        </div>
      </Card>
    </div>
  );
}
