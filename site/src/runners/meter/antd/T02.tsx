'use client';

/**
 * meter-antd-T02: Reset Battery Health meter to 0%
 *
 * Setup Description:
 * A centered isolated card shows a single meter titled "Battery Health".
 * - Layout: isolated_card at center.
 * - Component: AntD Progress (type='line') used as a meter approximation.
 * - Spacing/scale: comfortable, default.
 * - Instances: 1.
 * - Sub-controls: an inline "Reset" control appears next to the meter label (treated as part of the 
 *   meter widget). Clicking it immediately sets the meter value to 0%.
 * - Initial state: 65%.
 * - Distractors: a disabled "Reset all" button appears below the card (disabled and should not be needed).
 * - Feedback: value text updates immediately; no Apply/Save.
 *
 * Success: The Battery Health meter value is exactly 0%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(65);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (value === 0 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleReset = () => {
    setValue(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card 
      title={
        <Space>
          <span>Battery Health</span>
          <Button 
            size="small" 
            onClick={handleReset}
            data-testid="meter-battery-reset"
          >
            Reset
          </Button>
        </Space>
      } 
      style={{ width: 450 }}
    >
      <div style={{ marginBottom: 16 }}>
        <div
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          data-testid="meter-battery"
          data-meter-value={value}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Battery Health"
        >
          <Progress
            percent={value}
            showInfo
            status="normal"
          />
        </div>
      </div>
      <Button disabled style={{ marginTop: 8 }}>
        Reset all
      </Button>
    </Card>
  );
}
