'use client';

/**
 * toggle_button_group_multi-antd-T03: Hotel amenities selection
 *
 * Layout: isolated_card centered in the viewport.
 *
 * The card is labeled "Amenities" and contains a multi-select toggle button group 
 * (Ant Design checkbox group rendered as button-like toggles).
 *
 * - Options: Wi‑Fi, Parking, Pool, Breakfast.
 * - Initial state: Parking is selected; Wi‑Fi, Pool, and Breakfast are not selected.
 * - Selecting an option toggles it on; clicking a selected option toggles it off.
 * - No confirmation step; the selection state is shown immediately by highlighted buttons and checkmarks.
 * - No other interactive elements on the page (clutter=none).
 *
 * Success: Selected options equal exactly: Wi‑Fi, Breakfast
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

const AMENITIES = ['Wi‑Fi', 'Parking', 'Pool', 'Breakfast'];
const TARGET_SET = new Set(['Wi‑Fi', 'Breakfast']);

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Parking']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Amenities" style={{ width: 450 }} data-testid="amenities-group">
      <div style={{ marginBottom: 8, color: '#666' }}>
        Select Wi‑Fi and Breakfast.
      </div>
      <Checkbox.Group
        value={selected}
        onChange={(values) => setSelected(values as string[])}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
      >
        {AMENITIES.map(amenity => (
          <Checkbox
            key={amenity}
            value={amenity}
            style={{
              padding: '8px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              background: selected.includes(amenity) ? '#1677ff' : '#fff',
              color: selected.includes(amenity) ? '#fff' : '#333',
            }}
            data-testid={`amenity-${amenity.toLowerCase().replace('‑', '-')}`}
          >
            {amenity}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Card>
  );
}
