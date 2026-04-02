'use client';

/**
 * listbox_single-antd-T05: Two categories: set Secondary to Hardware
 *
 * Scene: light theme, comfortable spacing, form_section layout, placed at center of the viewport.
 * Component scale is default. Page contains 2 instance(s) of this listbox type; guidance is text; clutter is low.
 * A form_section layout shows two side-by-side cards. Left card: "Primary category" listbox (AntD Menu) with items
 * "Software", "Hardware", "Services", initial selection "Software". Right card: "Secondary category" listbox (same component)
 * with the same items, initial selection "Services". Each listbox has its own label above it.
 * The task targets the right-hand list labeled "Secondary category".
 *
 * Success: Selected option value equals: hardware (in Secondary category)
 * require_correct_instance: true
 */

import React, { useState } from 'react';
import { Card, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { key: 'software', label: 'Software' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'services', label: 'Services' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primarySelected, setPrimarySelected] = useState<string>('software');
  const [secondarySelected, setSecondarySelected] = useState<string>('services');

  const handlePrimarySelect: MenuProps['onSelect'] = ({ key }) => {
    setPrimarySelected(key);
  };

  const handleSecondarySelect: MenuProps['onSelect'] = ({ key }) => {
    setSecondarySelected(key);
    if (key === 'hardware') {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Card style={{ width: 280 }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Primary category</Text>
        <Menu
          data-cb-listbox-root
          data-cb-instance="primary"
          data-cb-selected-value={primarySelected}
          mode="inline"
          selectedKeys={[primarySelected]}
          onSelect={handlePrimarySelect}
          items={options.map(opt => ({
            key: opt.key,
            label: opt.label,
            'data-cb-option-value': opt.key,
          }))}
          style={{ border: 'none' }}
        />
      </Card>
      
      <Card style={{ width: 280 }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Secondary category</Text>
        <Menu
          data-cb-listbox-root
          data-cb-instance="secondary"
          data-cb-selected-value={secondarySelected}
          mode="inline"
          selectedKeys={[secondarySelected]}
          onSelect={handleSecondarySelect}
          items={options.map(opt => ({
            key: opt.key,
            label: opt.label,
            'data-cb-option-value': opt.key,
          }))}
          style={{ border: 'none' }}
        />
      </Card>
    </div>
  );
}
