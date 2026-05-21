'use client';

/**
 * button-antd-T01: Generate report (primary button click)
 * 
 * Baseline isolated card in the center of the viewport titled "Report".
 * The card contains a short paragraph and a single Ant Design primary Button labeled "Generate report".
 * When clicked, shows toast "Report queued" and button label changes to "Queued".
 */

import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    message.success('Report queued');
    onSuccess();
  };

  return (
    <Card title="Report" style={{ width: 400 }}>
      <p style={{ marginBottom: 16 }}>
        Create a one-time report from the current data.
      </p>
      <Button
        type="primary"
        onClick={handleClick}
        disabled={clicked}
        data-testid="antd-btn-generate-report"
      >
        {clicked ? 'Queued' : 'Generate report'}
      </Button>
    </Card>
  );
}
