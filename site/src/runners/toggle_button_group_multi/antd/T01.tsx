'use client';

/**
 * toggle_button_group_multi-antd-T01: Delivery days toggle set
 *
 * Layout: isolated_card centered in the viewport.
 *
 * A single card titled "Delivery days" contains one toggle-button-style multi-select group 
 * implemented with Ant Design checkboxes styled as pill buttons.
 *
 * - Options (left to right): Monday, Tuesday, Wednesday, Thursday, Friday.
 * - Each option is a rectangular/pill button that can be toggled on/off; selected buttons show 
 *   a filled background plus a check indicator.
 * - Initial state: no day is selected.
 * - No other components affect success; there is no Apply/Save button for this card.
 * - No distractors (clutter=none).
 *
 * Success: Selected options equal exactly: Monday, Wednesday, Friday
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TARGET_SET = new Set(['Monday', 'Wednesday', 'Friday']);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Delivery days" style={{ width: 450 }} data-testid="delivery-days-group">
      <div style={{ marginBottom: 8, color: '#666' }}>
        Select Monday, Wednesday, and Friday.
      </div>
      <Checkbox.Group
        value={selected}
        onChange={(values) => setSelected(values as string[])}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
      >
        {DAYS.map(day => (
          <Checkbox
            key={day}
            value={day}
            style={{
              padding: '8px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: 20,
              background: selected.includes(day) ? '#1677ff' : '#fff',
              color: selected.includes(day) ? '#fff' : '#333',
            }}
            data-testid={`day-${day.toLowerCase()}`}
          >
            {day}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Card>
  );
}
