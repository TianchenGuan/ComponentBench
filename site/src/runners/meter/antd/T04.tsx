'use client';

/**
 * meter-antd-T04: Match Water Tank meter to reference
 *
 * Setup Description:
 * A centered isolated card contains two horizontal meters aligned in a simple two-row stack.
 * - Layout: isolated_card, placement center.
 * - Component: two AntD Progress (type='line') meters.
 * - Spacing/scale: comfortable spacing, default size.
 * - Instances: 2 meters of the same type labeled:
 *   * "Water Tank (Target)" – interactive (click-to-set on the bar).
 *   * "Water Tank (Reference)" – read-only (not clickable), used only as a visual reference.
 * - Guidance: visual (the reference meter has no numeric label; it only shows the filled bar length).
 * - Initial state: Target at 10%; Reference at ~65% (visually two-thirds full).
 * - Distractors: none.
 * - Feedback: Target meter updates immediately as you click; no Apply/Save.
 *
 * Success: The Water Tank (Target) meter matches the Water Tank (Reference) meter (±3 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const REFERENCE_VALUE = 65;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [targetValue, setTargetValue] = useState(10);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(targetValue - REFERENCE_VALUE) <= 3 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [targetValue, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setTargetValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card title="Water Tank" style={{ width: 450 }}>
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Water Tank (Reference)</Text>
        <div
          data-testid="meter-water-ref"
          data-meter-value={REFERENCE_VALUE}
          role="meter"
          aria-valuenow={REFERENCE_VALUE}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Water Tank Reference"
          style={{ pointerEvents: 'none' }}
        >
          <Progress
            percent={REFERENCE_VALUE}
            showInfo={false}
            status="normal"
          />
        </div>
      </div>
      
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Water Tank (Target)</Text>
        <div
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          data-testid="meter-water-target"
          data-meter-value={targetValue}
          data-instance-label="Water Tank (Target)"
          role="meter"
          aria-valuenow={targetValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Water Tank Target"
        >
          <Progress
            percent={targetValue}
            showInfo={false}
            status="normal"
          />
        </div>
      </div>
    </Card>
  );
}
