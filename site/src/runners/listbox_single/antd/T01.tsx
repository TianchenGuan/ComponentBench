'use client';

/**
 * listbox_single-antd-T01: Preferred channel: choose Email
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered isolated card titled "Notification settings" contains a vertical AntD Menu styled as a standalone 
 * listbox (no submenus). The list has three items: "SMS", "Email", and "Push". Exactly one item can be selected 
 * at a time; the selected item is highlighted. Initial selection is "SMS". There are no other interactive controls on the card.
 *
 * Success: Selected option value equals: email
 */

import React, { useState } from 'react';
import { Card, Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'sms', label: 'SMS' },
  { key: 'email', label: 'Email' },
  { key: 'push', label: 'Push' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('sms');

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
    if (key === 'email') {
      onSuccess();
    }
  };

  return (
    <Card title="Notification settings" style={{ width: 360 }}>
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
