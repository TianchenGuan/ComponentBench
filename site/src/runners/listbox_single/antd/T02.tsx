'use client';

/**
 * listbox_single-antd-T02: Language listbox: select English (US)
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered isolated card titled "Language" contains a vertical selectable AntD Menu acting as a listbox.
 * Items appear with small leading icons (flag glyphs) and text labels: "English (UK)", "English (US)", 
 * "Español", "Français". Only one can be selected. Initial selection is "English (UK)". No search box or extra buttons.
 *
 * Success: Selected option value equals: en-US
 */

import React, { useState } from 'react';
import { Card, Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'en-UK', label: '🇬🇧 English (UK)' },
  { key: 'en-US', label: '🇺🇸 English (US)' },
  { key: 'es', label: '🇪🇸 Español' },
  { key: 'fr', label: '🇫🇷 Français' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('en-UK');

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
    if (key === 'en-US') {
      onSuccess();
    }
  };

  return (
    <Card title="Language" style={{ width: 360 }}>
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
