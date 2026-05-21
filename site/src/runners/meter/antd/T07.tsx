'use client';

/**
 * meter-antd-T07: Open Latency Meter details popover
 *
 * Setup Description:
 * An isolated card is anchored near the top-left of the viewport (not centered).
 * - Layout: isolated_card; placement top_left.
 * - Component: AntD Progress (type='line') used as a meter approximation.
 * - Spacing/scale: comfortable spacing, default size.
 * - Instances: 1 labeled "Latency Meter".
 * - Sub-controls: a small "Details" info icon (ⓘ) at the right end of the meter row opens a Popover.
 * - Initial state: details popover closed; meter shows 42%.
 * - Overlay behavior: clicking the info icon opens a popover anchored to the meter; popover contains 
 *   read-only text lines like "Current: 42%" and "Range: 0–100".
 * - Distractors: the card also contains a non-interactive sparkline image under the meter (should not be clicked).
 * - Feedback: popover appears instantly and stays open until clicking outside.
 *
 * Success: The Latency Meter details popover is open for the correct meter instance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Popover, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [value] = useState(42);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (isPopoverOpen && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isPopoverOpen, onSuccess]);

  const popoverContent = (
    <div data-testid="meter-latency-popover">
      <Text style={{ display: 'block' }}>Current: {value}%</Text>
      <Text style={{ display: 'block' }}>Range: 0–100</Text>
    </div>
  );

  return (
    <Card title="Latency Meter" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div 
            style={{ flex: 1 }}
            data-testid="meter-latency"
            data-meter-value={value}
            data-details-open={isPopoverOpen}
            role="meter"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Latency Meter"
          >
            <Progress
              percent={value}
              showInfo
              status="normal"
            />
          </div>
          <Popover 
            content={popoverContent} 
            title="Details"
            trigger="click"
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
          >
            <Button 
              type="text" 
              size="small" 
              icon={<InfoCircleOutlined />}
              data-testid="meter-latency-details"
            />
          </Popover>
        </div>
      </div>
      
      {/* Sparkline distractor (non-interactive) */}
      <div 
        style={{ 
          height: 40, 
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          borderRadius: 4,
          opacity: 0.5
        }}
      />
    </Card>
  );
}
