'use client';

/**
 * listbox_single-antd-T06: Match the reference icon in Quick actions
 *
 * Scene: dark theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is visual; clutter is none.
 * A centered isolated card in dark theme titled "Quick actions" shows a small reference chip above a vertical
 * AntD Menu listbox. The chip displays only an icon (no text): 🧾. The listbox contains four items, each with a
 * leading icon and text: "Upload" (⬆️), "Invoice" (🧾), "Export" (📤), "Archive" (🗄️). Only one can be selected.
 * Initial selection is "Upload". The goal is specified visually via the reference icon chip.
 *
 * Success: Selected option value equals: invoice (matching 🧾)
 */

import React, { useState } from 'react';
import { Card, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { key: 'upload', label: '⬆️ Upload' },
  { key: 'invoice', label: '🧾 Invoice' },
  { key: 'export', label: '📤 Export' },
  { key: 'archive', label: '🗄️ Archive' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('upload');

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
    if (key === 'invoice') {
      onSuccess();
    }
  };

  return (
    <Card 
      title="Quick actions" 
      style={{ width: 360 }}
    >
      {/* Reference chip */}
      <div 
        data-cb-reference-chip
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          padding: '4px 12px', 
          background: '#333', 
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 20 }}>🧾</Text>
      </div>

      <Menu
        data-cb-listbox-root
        data-cb-selected-value={selected}
        mode="inline"
        selectedKeys={[selected]}
        onSelect={handleSelect}
        items={options.map(opt => ({
          key: opt.key,
          label: opt.label,
          'data-cb-option-value': opt.key,
        }))}
        style={{ border: 'none' }}
      />
    </Card>
  );
}
