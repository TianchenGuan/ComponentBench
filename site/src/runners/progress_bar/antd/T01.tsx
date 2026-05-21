'use client';

/**
 * progress_bar-antd-T01: Complete Primary upload to 100%
 *
 * Layout: isolated_card centered in the viewport. The card title is "Upload simulator".
 *
 * Target component: one Ant Design line Progress bar labeled "Primary upload". It shows a 
 * percentage text to the right (showInfo enabled) and animates smoothly while running. 
 * Initial value is 0% with status "normal".
 *
 * Controls:
 * - "Start upload" button: begins increasing the Progress percent from 0% to 100% over ~10 seconds.
 * - "Pause" button (disabled until started): pauses at the current percent.
 * - "Reset" button: returns to 0%.
 * - "Cancel" button: opens a confirmation popover (not required for this task).
 *
 * Success: Progress bar value is exactly 100% and status is "success".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Button, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState<'normal' | 'active' | 'success' | 'exception'>('normal');
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (percent >= 100 && status === 'success') {
      onSuccess();
    }
  }, [percent, status, onSuccess]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    setStatus('active');
    intervalRef.current = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          setStatus('success');
          return 100;
        }
        return prev + 1;
      });
    }, 100); // 10 seconds total
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
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
        <Button type="primary" onClick={handleStart} disabled={isRunning || percent >= 100}>
          Start upload
        </Button>
        <Button onClick={handlePause} disabled={!isRunning}>
          Pause
        </Button>
        <Button onClick={handleReset}>
          Reset
        </Button>
        <Button disabled>
          Cancel
        </Button>
      </Space>
    </Card>
  );
}
