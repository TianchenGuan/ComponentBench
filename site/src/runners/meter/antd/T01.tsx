'use client';

/**
 * meter-antd-T01: Set Fuel Level meter to 50%
 *
 * Setup Description:
 * A single centered isolated card shows a labeled meter titled "Fuel Level".
 * - Layout: isolated_card, placed in the center of the viewport.
 * - Component: AntD Progress (type='line') used as a meter approximation with a clickable track.
 * - Spacing/scale: comfortable spacing, default size.
 * - Instances: 1 meter instance.
 * - Sub-controls: the progress track is interactive; clicking on the track sets the meter value 
 *   to the nearest whole percent based on click position. The percent text is shown to the right (showInfo=true).
 * - Initial state: 20%.
 * - Distractors: none (only a non-interactive label and helper text "Range 0–100").
 * - Feedback: value updates immediately after click; no Apply/Save button.
 *
 * Success: The Fuel Level meter value is 50% (±3 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(20);
  const progressRef = useRef<HTMLDivElement>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(value - 50) <= 3 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card title="Fuel Level" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Range 0–100</Text>
        <div
          ref={progressRef}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          data-testid="meter-fuel"
          data-meter-value={value}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Fuel Level"
        >
          <Progress
            percent={value}
            showInfo
            status="normal"
          />
        </div>
      </div>
    </Card>
  );
}
