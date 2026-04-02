'use client';

/**
 * progress_bar-antd-T02: Reset progress back to 0%
 *
 * Layout: isolated_card centered. Card title "Upload simulator".
 *
 * Target component: one Ant Design line Progress bar labeled "Primary upload". 
 * The percentage text is visible. The bar starts pre-filled at 65% with status "active" 
 * (as if an upload is mid-flight).
 *
 * Controls:
 * - "Reset" button (primary control for this task): immediately sets the Progress percent to 0% 
 *   and status to "normal".
 * - "Start upload" button: would start filling again (distractor).
 * - "Pause" button: pauses at current value (distractor).
 *
 * Success: Progress bar value is 0% and status is "normal".
 */

import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [percent, setPercent] = useState(65);
  const [status, setStatus] = useState<'normal' | 'active' | 'success' | 'exception'>('active');

  useEffect(() => {
    if (percent === 0 && status === 'normal') {
      onSuccess();
    }
  }, [percent, status, onSuccess]);

  const handleReset = () => {
    setPercent(0);
    setStatus('normal');
  };

  return (
    <Card title="Upload simulator" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary upload</Text>
        <Progress
          percent={percent}
          status={status}
          data-testid="primary-progress"
        />
      </div>
      <Space>
        <Button onClick={() => {}}>
          Start upload
        </Button>
        <Button disabled>
          Pause
        </Button>
        <Button type="primary" onClick={handleReset}>
          Reset
        </Button>
      </Space>
    </Card>
  );
}
