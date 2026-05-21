'use client';

/**
 * stepper-antd-T10: Settings panel: scroll to Advanced step
 *
 * Layout: settings_panel anchored toward bottom-left (placement=bottom_left).
 * Spacing/scale: spacing=compact and scale=small.
 * Component: Ant Design Steps titled "Release pipeline" with 9 steps in horizontal overflow.
 * Steps: "Overview" → "Permissions" → "Notifications" → "Integrations" → "Billing" → "Logs" → "Advanced" → "Review" → "Done".
 * Initial state: Active step is "Overview" (index 0).
 * Success: Active step label is "Advanced" (step 7, index 6).
 */

import React, { useState, useRef } from 'react';
import { Steps, Card, Switch, Select } from 'antd';
import type { TaskComponentProps } from '../types';

const steps = [
  { title: 'Overview' },
  { title: 'Permissions' },
  { title: 'Notifications' },
  { title: 'Integrations' },
  { title: 'Billing' },
  { title: 'Logs' },
  { title: 'Advanced' },
  { title: 'Review' },
  { title: 'Done' },
];

const TARGET_STEP_INDEX = 6;
const TARGET_STEP_LABEL = 'Advanced';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleChange = (value: number) => {
    setCurrent(value);
    if (value === TARGET_STEP_INDEX) {
      onSuccess();
    }
  };

  return (
    <Card
      title="Release pipeline"
      style={{ width: 450 }}
      styles={{ body: { padding: 12 } }}
    >
      {/* Reference strip */}
      <div
        style={{
          marginBottom: 12,
          padding: 8,
          background: '#f5f5f5',
          borderRadius: 4,
          fontSize: 12,
        }}
        data-testid="stepper-reference"
      >
        <span style={{ color: '#666' }}>Target step: </span>
        <strong style={{ color: '#1677ff' }}>{TARGET_STEP_LABEL}</strong>
      </div>

      {/* Scrollable step header row */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: 8,
        }}
        data-testid="stepper-header-scroll"
      >
        <Steps
          current={current}
          onChange={handleChange}
          items={steps}
          size="small"
          style={{ minWidth: 900 }}
          data-testid="stepper-release"
        />
      </div>

      {/* Content */}
      <div style={{ marginTop: 12, padding: 12, background: '#fafafa', borderRadius: 8 }}>
        <p style={{ margin: 0, fontSize: 12 }}>
          Current step: {steps[current]?.title}
        </p>
      </div>

      {/* Distractors */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch size="small" />
          <span style={{ fontSize: 12, color: '#666' }}>Enable beta features</span>
        </div>
        <Select
          placeholder="Environment"
          size="small"
          style={{ width: 150 }}
          options={[
            { value: 'dev', label: 'Development' },
            { value: 'prod', label: 'Production' },
          ]}
        />
      </div>
    </Card>
  );
}
