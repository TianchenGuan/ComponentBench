'use client';

/**
 * listbox_single-antd-T04: Active project: clear selection
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A centered isolated card titled "Active project" contains a standalone AntD Menu listbox with five items:
 * "Apollo", "Beacon", "Cascade", "Drift", "Eon". Exactly one item can be selected, but the card also provides
 * a small text button labeled "Clear selection" above the list. Initial selection is "Apollo".
 * When cleared, no item remains highlighted and a small caption under the list reads "No active project selected".
 *
 * Success: Selected option value equals: null (no selection)
 */

import React, { useState } from 'react';
import { Card, Menu, Button, Typography } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { key: 'apollo', label: 'Apollo' },
  { key: 'beacon', label: 'Beacon' },
  { key: 'cascade', label: 'Cascade' },
  { key: 'drift', label: 'Drift' },
  { key: 'eon', label: 'Eon' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>('apollo');

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
  };

  const handleClear = () => {
    setSelected(null);
    onSuccess();
  };

  return (
    <Card 
      title="Active project" 
      style={{ width: 360 }}
      extra={
        <Button type="link" size="small" onClick={handleClear}>
          Clear selection
        </Button>
      }
    >
      <Menu
        data-cb-listbox-root
        data-cb-selected-value={selected || 'null'}
        mode="inline"
        selectedKeys={selected ? [selected] : []}
        onSelect={handleSelect}
        items={options.map(opt => ({
          key: opt.key,
          label: opt.label,
          'data-cb-option-value': opt.key,
        }))}
        style={{ border: 'none' }}
      />
      {selected === null && (
        <div style={{ marginTop: 12, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
          <Text type="secondary">No active project selected</Text>
        </div>
      )}
    </Card>
  );
}
