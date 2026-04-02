'use client';

/**
 * checkbox_group-antd-T04: Clear all dietary restrictions
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Single-card Ant Design page titled "Lunch order".
 * There is one Checkbox.Group labeled "Dietary restrictions" with three options:
 * - Vegetarian (checked by default)
 * - Vegan (unchecked)
 * - Gluten-free (checked by default)
 * Success: The 'Dietary restrictions' checkbox group has no options checked (empty selection).
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['Vegetarian', 'Vegan', 'Gluten-free'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Vegetarian', 'Gluten-free']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Lunch order" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Dietary restrictions</Text>
      <Checkbox.Group
        data-testid="cg-dietary-restrictions"
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
