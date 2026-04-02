'use client';

/**
 * checkbox_group-antd-T09: Set accessibility options (dark, small) and apply
 *
 * Scene: dark theme; compact spacing; a single isolated card centered in the viewport; small-sized controls.
 * Ant Design page rendered in dark theme with compact spacing and small component sizing.
 * The card titled "Accessibility" contains:
 * - One Checkbox.Group labeled "Accessibility options" with 12 tightly spaced options
 * - A small "Apply" button at the bottom right
 * - A "Reset to defaults" link (present but not required)
 * Initial state: High contrast and Larger text are checked by default.
 * Success: After clicking Apply, the saved selection equals: Reduce motion, Underline links, Focus outline, Keyboard shortcuts.
 */

import React, { useState, useRef } from 'react';
import { Card, Checkbox, Typography, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title, Link } = Typography;

const accessibilityOptions = [
  'High contrast', 'Reduce motion', 'Larger text', 'Larger icons',
  'Screen reader hints', 'Underline links', 'Focus outline', 'Color-blind friendly',
  'Keyboard shortcuts', 'Sticky keys', 'Captions (default)', 'Captions (large)'
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['High contrast', 'Larger text']);
  const [pendingChanges, setPendingChanges] = useState(false);
  const hasSucceeded = useRef(false);

  const handleChange = (checkedValues: string[]) => {
    setSelected(checkedValues);
    setPendingChanges(true);
  };

  const handleApply = () => {
    setPendingChanges(false);
    const targetSet = new Set(['Reduce motion', 'Underline links', 'Focus outline', 'Keyboard shortcuts']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  const handleReset = () => {
    setSelected(['High contrast', 'Larger text']);
    setPendingChanges(true);
  };

  return (
    <Card 
      title="Accessibility" 
      style={{ width: 420 }}
      styles={{ body: { padding: '12px 16px' } }}
    >
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>Accessibility options</Text>
      {pendingChanges && (
        <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 11 }}>
          Pending changes...
        </Text>
      )}
      <Checkbox.Group
        data-testid="cg-accessibility-options"
        value={selected}
        onChange={(checkedValues) => handleChange(checkedValues as string[])}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {accessibilityOptions.map(option => (
            <Checkbox key={option} value={option} style={{ fontSize: 12 }}>
              {option}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
      
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link onClick={handleReset} style={{ fontSize: 12 }}>Reset to defaults</Link>
        <Button type="primary" size="small" onClick={handleApply} data-testid="btn-apply">
          Apply
        </Button>
      </div>
    </Card>
  );
}
