'use client';

/**
 * meter-antd-T05: Set CPU Budget meter in System Limits form
 *
 * Setup Description:
 * A form_section layout shows a "System Limits" panel with several standard form fields and two meters.
 * - Layout: form_section anchored in the center with a left-aligned form title.
 * - Clutter: low (a few text inputs and toggles are present but not required for success).
 * - Component: AntD Progress (type='line') meters.
 * - Spacing/scale: comfortable spacing, default size.
 * - Instances: 2 meters stacked with labels:
 *   * "CPU Budget" (interactive)
 *   * "Memory Budget" (interactive)
 * - Initial state: CPU Budget = 45%, Memory Budget = 60%.
 * - Interaction: clicking on a meter's bar sets that meter's value; each shows a numeric percent at the right.
 * - Feedback: immediate update; no Apply/Save.
 * - Distractors: a "Reset limits" button exists at the bottom of the panel (does nothing in this task 
 *   and should not be used).
 *
 * Success: The CPU Budget meter value is 70% (±2 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Input, Switch, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [cpuBudget, setCpuBudget] = useState(45);
  const [memoryBudget, setMemoryBudget] = useState(60);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(cpuBudget - 70) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [cpuBudget, onSuccess]);

  const handleCpuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setCpuBudget(Math.max(0, Math.min(100, percent)));
  };

  const handleMemoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setMemoryBudget(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card style={{ width: 500 }}>
      <Title level={4}>System Limits</Title>
      
      {/* Distractor form fields */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Server name</Text>
        <Input placeholder="production-01" style={{ width: '100%' }} />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Switch defaultChecked />
          <Text>Enable monitoring</Text>
        </Space>
      </div>

      {/* CPU Budget meter */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>CPU Budget</Text>
        <div
          onClick={handleCpuClick}
          style={{ cursor: 'pointer' }}
          data-testid="meter-cpu"
          data-instance-label="CPU Budget"
          data-meter-value={cpuBudget}
          role="meter"
          aria-valuenow={cpuBudget}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="CPU Budget"
        >
          <Progress
            percent={cpuBudget}
            showInfo
            status="normal"
          />
        </div>
      </div>

      {/* Memory Budget meter */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Memory Budget</Text>
        <div
          onClick={handleMemoryClick}
          style={{ cursor: 'pointer' }}
          data-testid="meter-mem"
          data-instance-label="Memory Budget"
          data-meter-value={memoryBudget}
          role="meter"
          aria-valuenow={memoryBudget}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Memory Budget"
        >
          <Progress
            percent={memoryBudget}
            showInfo
            status="normal"
          />
        </div>
      </div>

      <Button disabled style={{ marginTop: 8 }}>
        Reset limits
      </Button>
    </Card>
  );
}
