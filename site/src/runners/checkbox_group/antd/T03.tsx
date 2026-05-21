'use client';

/**
 * checkbox_group-antd-T03: Choose Express shipping only
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Ant Design page with a single isolated card titled "Checkout".
 * Inside the card is one Checkbox.Group labeled "Shipping speed". The group contains three options:
 * - Standard (checked by default)
 * - Express (unchecked)
 * - Overnight (unchecked)
 * Success: In the 'Shipping speed' checkbox group, Express is checked and the other options are unchecked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['Standard', 'Express', 'Overnight'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Standard']);

  useEffect(() => {
    const targetSet = new Set(['Express']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Checkout" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Shipping speed</Text>
      <Checkbox.Group
        data-testid="cg-shipping-speed"
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
