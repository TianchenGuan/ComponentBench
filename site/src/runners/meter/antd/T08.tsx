'use client';

/**
 * meter-antd-T08: Set small Signal Strength meter to 67%
 *
 * Setup Description:
 * A compact meter card is positioned in the bottom-right corner of the viewport.
 * - Layout: isolated_card; placement bottom_right.
 * - Spacing/scale: compact spacing and small scale; the bar is short and thin.
 * - Component: AntD Progress (type='line') styled small; showInfo=false (no printed percent).
 * - Instances: 1 labeled "Signal Strength".
 * - Interaction: clicking on the bar sets the value based on click position. Fine adjustment is available 
 *   via keyboard: when focused, Left/Right arrow changes by 1%.
 * - Observability: value is not printed; hovering the bar shows a small tooltip with the exact percent.
 * - Initial state: 50%.
 * - Distractors: a tiny "Help" link under the bar (opens a non-blocking tooltip) which is not required.
 * - Feedback: the fill updates immediately; tooltip reflects the current value.
 *
 * Success: Signal Strength meter value is 67% (±1 percentage point).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Tooltip } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(50);
  const meterRef = useRef<HTMLDivElement>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(value - 67) <= 1 && !successFiredRef.current) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setValue(prev => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setValue(prev => Math.min(100, prev + 1));
    }
  };

  return (
    <Card size="small" style={{ width: 250 }}>
      <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Signal Strength</Text>
      <Tooltip title={`${value}%`} placement="top">
        <div
          ref={meterRef}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{ cursor: 'pointer', outline: 'none' }}
          data-testid="meter-signal"
          data-meter-value={value}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Signal Strength"
        >
          <Progress
            percent={value}
            showInfo={false}
            size="small"
            status="normal"
          />
        </div>
      </Tooltip>
      <Tooltip title="Adjust signal settings">
        <Link style={{ fontSize: 10, display: 'block', marginTop: 4 }}>Help</Link>
      </Tooltip>
    </Card>
  );
}
