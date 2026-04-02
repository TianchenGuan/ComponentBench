'use client';

/**
 * listbox_single-antd-T07: Report frequency: set Weekly and save
 *
 * Scene: light theme, comfortable spacing, settings_panel layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is medium.
 * A settings_panel layout shows several read-only toggles and inputs as distractors (timezone text, a disabled switch,
 * and a help link). In the middle, a labeled card "Report frequency" contains a selectable AntD Menu listbox with
 * items "Daily", "Weekly", "Monthly". Initial selection is "Monthly", but changes are not committed until the user
 * clicks the primary button "Save changes" at the bottom of the panel. A secondary "Cancel" button reverts to the
 * last saved value. After saving, a small toast "Saved" appears.
 *
 * Success: Selected option value equals: weekly (after clicking Save changes)
 * require_confirm: true, confirm_control: Save changes
 */

import React, { useState } from 'react';
import { Card, Menu, Button, Switch, Typography, message, Space } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

const options = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [staged, setStaged] = useState<string>('monthly');
  const [committed, setCommitted] = useState<string>('monthly');

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setStaged(key);
  };

  const handleSave = () => {
    setCommitted(staged);
    if (staged === 'weekly') {
      message.success('Saved');
      onSuccess();
    } else {
      message.success('Saved');
    }
  };

  const handleCancel = () => {
    setStaged(committed);
  };

  return (
    <div style={{ width: 400 }}>
      {/* Distractor section */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Text type="secondary">Timezone: UTC-5 (Eastern)</Text>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text>Dark mode</Text>
          <Switch disabled />
        </Space>
      </Card>

      {/* Main listbox */}
      <Card title="Report frequency" style={{ marginBottom: 16 }}>
        <Menu
          data-cb-listbox-root
          data-cb-selected-value={staged}
          data-cb-committed-value={committed}
          mode="inline"
          selectedKeys={[staged]}
          onSelect={handleSelect}
          items={options.map(opt => ({
            key: opt.key,
            label: opt.label,
            'data-cb-option-value': opt.key,
          }))}
          style={{ border: 'none' }}
        />
      </Card>

      {/* Distractor help link */}
      <div style={{ marginBottom: 16 }}>
        <Link type="secondary">Need help? Contact support</Link>
      </div>

      {/* Action buttons */}
      <Space>
        <Button type="primary" onClick={handleSave}>Save changes</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Space>
    </div>
  );
}
