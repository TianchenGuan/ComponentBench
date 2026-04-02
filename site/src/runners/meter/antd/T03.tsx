'use client';

/**
 * meter-antd-T03: Enable Auto mode on Network Load meter
 *
 * Setup Description:
 * A single meter card is centered on a dark-themed page.
 * - Layout: isolated_card, placement center.
 * - Theme: dark (text and controls are high-contrast on a dark background).
 * - Component: AntD Progress (type='line') used as a meter approximation.
 * - Spacing/scale: comfortable spacing, default size.
 * - Instances: 1 labeled "Network Load".
 * - Sub-controls: inside the meter header row, an "Auto" pill toggle (part of the meter widget) 
 *   switches the meter between determinate (fixed percent) and indeterminate (animated) mode.
 * - Initial state: determinate at 40% (shows "40%").
 * - Desired state: Auto ON → indeterminate animation; the numeric percent label is replaced by "Auto".
 * - Distractors: a read-only status line below shows "Last updated: just now".
 * - Feedback: toggle updates immediately; no Apply/Save.
 *
 * Success: The Network Load meter is in indeterminate (Auto) mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [isAuto, setIsAuto] = useState(false);
  const [value] = useState(40);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (isAuto && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isAuto, onSuccess]);

  const handleToggleAuto = () => {
    setIsAuto(!isAuto);
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Network Load</span>
          <Tag 
            color={isAuto ? 'blue' : 'default'}
            onClick={handleToggleAuto}
            style={{ cursor: 'pointer', marginLeft: 8 }}
            data-testid="meter-network-auto-toggle"
          >
            Auto
          </Tag>
        </div>
      } 
      style={{ width: 450 }}
    >
      <div 
        style={{ marginBottom: 16 }}
        data-testid="meter-network"
        data-meter-mode={isAuto ? 'indeterminate' : 'determinate'}
        data-meter-value={isAuto ? undefined : value}
        role="meter"
        aria-valuenow={isAuto ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Network Load"
      >
        {isAuto ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Progress
              percent={100}
              showInfo={false}
              status="active"
              style={{ flex: 1 }}
            />
            <Text>Auto</Text>
          </div>
        ) : (
          <Progress
            percent={value}
            showInfo
            status="normal"
          />
        )}
      </div>
      <Text type="secondary">Last updated: just now</Text>
    </Card>
  );
}
