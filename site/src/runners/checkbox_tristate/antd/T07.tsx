'use client';

/**
 * checkbox_tristate-antd-T07: Open Notifications panel and enable usage analytics
 *
 * Layout: form_section titled "Account preferences", centered.
 * The section contains an Ant Design Collapse/Accordion with three panels:
 * - "Profile"
 * - "Notifications" (contains the target)
 * - "Security"
 *
 * Only one panel is open at a time; initially "Profile" is open and "Notifications" is collapsed.
 * Inside the "Notifications" panel is a single Ant Design tri-state checkbox labeled "Usage analytics"
 * with a short description under it ("Help improve the product").
 * Initial state of "Usage analytics": Unchecked.
 * 
 * Clutter: medium. The opened panels also contain unrelated fields.
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Card, Collapse, Checkbox, Input, Select } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>(['profile']);
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  const items = [
    {
      key: 'profile',
      label: 'Profile',
      children: (
        <div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#666' }}>Display name</label>
            <Input placeholder="Enter your name" style={{ marginTop: 4 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#666' }}>Language</label>
            <Select
              placeholder="Select language"
              style={{ width: '100%', marginTop: 4 }}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      children: (
        <div>
          <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={state === 'checked'}
              indeterminate={state === 'indeterminate'}
              data-testid="usage-analytics-checkbox"
            >
              Usage analytics
            </Checkbox>
          </div>
          <div style={{ marginTop: 4, marginLeft: 24, fontSize: 12, color: '#999' }}>
            Help improve the product
          </div>
        </div>
      ),
    },
    {
      key: 'security',
      label: 'Security',
      children: (
        <div>
          <Input.Password placeholder="Current password" style={{ marginBottom: 8 }} />
          <Input.Password placeholder="New password" />
        </div>
      ),
    },
  ];

  return (
    <Card title="Account preferences" style={{ width: 480 }}>
      <Collapse
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        items={items}
      />
    </Card>
  );
}
