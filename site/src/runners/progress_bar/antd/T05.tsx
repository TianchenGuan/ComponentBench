'use client';

/**
 * progress_bar-antd-T05: Pause upload near 60%
 *
 * Layout: isolated_card centered, titled "Upload simulator".
 *
 * Target component: one Ant Design line Progress bar labeled "Primary upload", 
 * starting at 0% with visible percent text.
 *
 * Controls:
 * - "Start upload": begins filling from 0% upward at a steady rate.
 * - "Pause": stops the progress at its current value (toggles to "Resume" when paused).
 * - "Reset": returns to 0% (distractor).
 *
 * Success: Progress bar value is within ±2% of 60% and remains stable for at least 1 second.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Button, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [percent, setPercent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: within ±2% of 60% and stable for 1 second
  useEffect(() => {
    // Clear any existing stability timer
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    // If within tolerance and not running, start stability timer
    if (!isRunning && percent >= 58 && percent <= 62 && !successFiredRef.current) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 1000);
    }

    return () => {
      if (stabilityRef.current) {
        clearTimeout(stabilityRef.current);
      }
    };
  }, [percent, isRunning, onSuccess]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setPercent(0);
    successFiredRef.current = false;
  };

  return (
    <Card title="Upload simulator" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary upload</Text>
        <Progress
          percent={percent}
          status={isRunning ? 'active' : 'normal'}
          data-testid="primary-progress"
        />
      </div>
      <Space>
        <Button type="primary" onClick={handleStart} disabled={isRunning || percent > 0}>
          Start upload
        </Button>
        {isRunning ? (
          <Button onClick={handlePause}>
            Pause
          </Button>
        ) : (
          <Button onClick={handleResume} disabled={percent === 0 || percent >= 100}>
            Resume
          </Button>
        )}
        <Button onClick={handleReset}>
          Reset
        </Button>
      </Space>
    </Card>
  );
}
