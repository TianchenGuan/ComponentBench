'use client';

/**
 * progress_bar-antd-T07: Match Target progress to a Reference bar (45%)
 *
 * Layout: isolated_card centered, titled "Progress matching".
 *
 * Target components (instances=2):
 * 1) "Reference" progress bar (AntD Progress, line): fixed at 45% and shows its percent text.
 * 2) "Target" progress bar (AntD Progress, line): starts at 10%. Its percent text is hidden 
 *    (showInfo=false) so the user relies on the bar fill and the label "Target".
 *
 * Controls (affect ONLY the Target bar):
 * - "–5%" and "+5%" small buttons directly to the right of the Target bar.
 * - A "Reset Target" link sets Target back to 10% (distractor).
 *
 * Success: Target progress bar value is within ±1% of 45% (only Target instance counts).
 */

import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [targetPercent, setTargetPercent] = useState(10);
  const successFiredRef = React.useRef(false);

  useEffect(() => {
    if (targetPercent >= 44 && targetPercent <= 46 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [targetPercent, onSuccess]);

  const handleDecrease = () => {
    setTargetPercent((prev) => Math.max(0, prev - 5));
  };

  const handleIncrease = () => {
    setTargetPercent((prev) => Math.min(100, prev + 5));
  };

  const handleReset = () => {
    setTargetPercent(10);
    successFiredRef.current = false;
  };

  return (
    <Card title="Progress matching" style={{ width: 500 }}>
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Reference</Text>
        <Progress
          percent={45}
          status="normal"
          data-testid="reference-progress"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Target</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Progress
            percent={targetPercent}
            showInfo={false}
            status="normal"
            style={{ flex: 1 }}
            data-testid="target-progress"
          />
          <Space size="small">
            <Button size="small" onClick={handleDecrease}>–5%</Button>
            <Button size="small" onClick={handleIncrease}>+5%</Button>
          </Space>
        </div>
      </div>
      <Link onClick={handleReset}>Reset Target</Link>
    </Card>
  );
}
