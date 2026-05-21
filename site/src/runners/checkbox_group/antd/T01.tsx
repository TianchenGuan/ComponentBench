'use client';

/**
 * checkbox_group-antd-T01: Select Apple and Orange (Fruits)
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * You are on a simple Ant Design demo page in a light theme. In the middle of the page there is a single isolated card titled "Snack planner".
 * Inside the card there is one Checkbox.Group labeled "Fruits". It is displayed inline (no popovers/modals). The group has three options:
 * - Apple
 * - Pear
 * - Orange
 * Initial state: none of the checkboxes are selected.
 * Success: The checkbox group labeled 'Fruits' has exactly Apple and Orange checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['Apple', 'Pear', 'Orange'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Apple', 'Orange']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Snack planner" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Fruits</Text>
      <Checkbox.Group
        data-testid="cg-fruits"
        value={selected}
        onChange={(checkedValues) => setSelected(checkedValues as string[])}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map(option => (
            <Checkbox key={option} value={option}>
              {option}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    </Card>
  );
}
