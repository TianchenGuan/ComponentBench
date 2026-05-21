'use client';

/**
 * progress_bar-antd-T03: Hide the percentage text on the progress bar
 *
 * Layout: isolated_card centered. Card title "Upload simulator".
 *
 * Target component: one Ant Design line Progress bar labeled "Primary upload", currently at 30% 
 * with status "normal". By default, AntD Progress displays a percentage readout next to the bar.
 *
 * Sub-controls:
 * - A small switch control labeled "Show percentage text" located directly under the progress bar.
 *   - ON: Progress renders its info text (e.g., "30%").
 *   - OFF: Progress hides the info text (showInfo=false) but the bar fill remains unchanged.
 *
 * Distractors:
 * - "Start upload" button and "Reset" button are present but not needed.
 *
 * Success: showInfo is disabled (percentage text hidden), value remains 30%.
 */

import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Switch, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (!showInfo) {
      onSuccess();
    }
  }, [showInfo, onSuccess]);

  return (
    <Card title="Upload simulator" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary upload</Text>
        <Progress
          percent={30}
          status="normal"
          showInfo={showInfo}
          data-testid="primary-progress"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Switch
            checked={showInfo}
            onChange={setShowInfo}
          />
          <Text>Show percentage text</Text>
        </Space>
      </div>
      <Space>
        <Button>
          Start upload
        </Button>
        <Button>
          Reset
        </Button>
      </Space>
    </Card>
  );
}
