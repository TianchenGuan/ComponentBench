'use client';

/**
 * progress_bar-antd-T06: Cancel an in-progress upload and confirm
 *
 * Layout: isolated_card centered, titled "Upload simulator".
 *
 * Target component: one Ant Design line Progress bar labeled "Primary upload", 
 * currently running at ~40% with status "active".
 *
 * Controls:
 * - "Cancel upload" button: opens an AntD Popconfirm anchored to the button, 
 *   with two actions: "Yes, cancel" and "Keep uploading".
 * - "Reset" button: sets progress to 0% but keeps status "normal" (distractor).
 *
 * Cancellation behavior (after confirming "Yes, cancel"):
 * - Progress percent becomes 0%.
 * - Progress status becomes "exception" (canceled/error styling) and remains stopped.
 *
 * Success: Progress bar status is "exception", value is 0%, and remains stopped for at least 1 second.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Button, Popconfirm, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [percent, setPercent] = useState(40);
  const [status, setStatus] = useState<'normal' | 'active' | 'success' | 'exception'>('active');
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Start running on mount
  useEffect(() => {
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
    }, 200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Check for success: status is "exception" and value is 0%, stable for 1 second
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (status === 'exception' && percent === 0 && !successFiredRef.current) {
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
  }, [status, percent, onSuccess]);

  const handleCancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setPercent(0);
    setStatus('exception');
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
        <Popconfirm
          title="Cancel upload?"
          description="Are you sure you want to cancel this upload?"
          onConfirm={handleCancel}
          okText="Yes, cancel"
          cancelText="Keep uploading"
        >
          <Button danger>
            Cancel upload
          </Button>
        </Popconfirm>
        <Button onClick={handleReset}>
          Reset
        </Button>
      </Space>
    </Card>
  );
}
