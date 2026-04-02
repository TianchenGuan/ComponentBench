'use client';

/**
 * icon_button-antd-T04: Reset sort mode to None (cycle icon button)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "List controls" contains one row labeled "Sort mode". 
 * Clicking the icon button cycles the mode: None → A→Z → Z→A → None …
 * Initial state: mode shows "Z→A" (data-cb-mode="za").
 * 
 * Success: The sort icon button's canonical mode equals "none" (data-cb-mode="none").
 */

import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

type SortMode = 'none' | 'az' | 'za';

const MODES: SortMode[] = ['none', 'az', 'za'];
const MODE_LABELS: Record<SortMode, string> = {
  none: 'None',
  az: 'A→Z',
  za: 'Z→A',
};

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [mode, setMode] = useState<SortMode>('za'); // Initial state is Z→A

  const handleCycle = () => {
    const currentIndex = MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODES.length;
    const newMode = MODES[nextIndex];
    setMode(newMode);
    
    if (newMode === 'none') {
      onSuccess();
    }
  };

  return (
    <Card title="List controls" style={{ width: 350 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Sort mode: {MODE_LABELS[mode]}</span>
        <Button
          type="text"
          icon={<SortAscendingOutlined />}
          onClick={handleCycle}
          aria-label="Change sort mode"
          data-cb-mode={mode}
          data-testid="antd-icon-btn-sort"
        />
      </div>
    </Card>
  );
}
