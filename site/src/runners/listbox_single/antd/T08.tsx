'use client';

/**
 * listbox_single-antd-T08: Time zone list: scroll to Pacific/Honolulu
 *
 * Scene: light theme, compact spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is small. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered isolated card titled "Time zone" contains a scrollable AntD Menu listbox constrained to about 220px
 * height in compact spacing and small scale. The list contains ~50 IANA time zones sorted alphabetically
 * (e.g., "America/New_York", "Europe/London", …, "Pacific/Honolulu", "Pacific/Tahiti"). Only one can be selected.
 * Initial selection is "America/New_York". The target item is not visible initially and requires scrolling
 * within the listbox (not the page).
 *
 * Success: Selected option value equals: Pacific/Honolulu
 */

import React, { useState } from 'react';
import { Card, Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

// A subset of IANA time zones, sorted alphabetically
const timezones = [
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/New_York',
  'America/Sao_Paulo',
  'America/Toronto',
  'Asia/Bangkok',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Melbourne',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Moscow',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Stockholm',
  'Europe/Vienna',
  'Europe/Warsaw',
  'Europe/Zurich',
  'Pacific/Auckland',
  'Pacific/Fiji',
  'Pacific/Guam',
  'Pacific/Honolulu',
  'Pacific/Tahiti',
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('America/New_York');

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
    if (key === 'Pacific/Honolulu') {
      onSuccess();
    }
  };

  return (
    <Card title="Time zone" style={{ width: 320 }} bodyStyle={{ padding: 0 }}>
      <div 
        style={{ 
          height: 220, 
          overflowY: 'auto',
          padding: '8px 0',
        }}
      >
        <Menu
          data-cb-listbox-root
          data-cb-selected-value={selected}
          mode="inline"
          selectedKeys={[selected]}
          onSelect={handleSelect}
          items={timezones.map(tz => ({
            key: tz,
            label: <span style={{ fontSize: 12 }}>{tz}</span>,
            'data-cb-option-value': tz,
          }))}
          style={{ border: 'none' }}
        />
      </div>
    </Card>
  );
}
