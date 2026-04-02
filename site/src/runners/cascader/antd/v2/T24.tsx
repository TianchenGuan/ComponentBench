'use client';

/**
 * cascader-antd-v2-T24: ChangeOnSelect plus lazy-loaded final subtree in compact form
 *
 * Inline surface with a Cascader "Support area" using both changeOnSelect and lazy-loaded
 * children. Expanding Hardware loads Printers and Networking lazily. Once Printers appears,
 * select the intermediate path Hardware / Printers (do NOT select a leaf). A third column
 * with Install, Setup, Troubleshooting may also appear but should be ignored.
 * Click "Apply area" to confirm.
 *
 * Success: path equals [Hardware, Printers], "Apply area" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Breadcrumb } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const cascaderOptions = [
  {
    value: 'hardware',
    label: 'Hardware',
    children: [
      {
        value: 'printers', label: 'Printers',
        children: [
          { value: 'install', label: 'Install' },
          { value: 'setup', label: 'Setup' },
          { value: 'troubleshooting', label: 'Troubleshooting' },
        ],
      },
      {
        value: 'networking', label: 'Networking',
        children: [
          { value: 'routers', label: 'Routers' },
          { value: 'switches', label: 'Switches' },
        ],
      },
    ],
  },
  {
    value: 'software',
    label: 'Software',
    children: [
      { value: 'productivity', label: 'Productivity' },
      { value: 'security', label: 'Security' },
    ],
  },
];

const TARGET_PATH = ['hardware', 'printers'];

export default function T24({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 440, margin: '20px 60px 0 auto' }}>
        <Card
          size="small"
          style={{ marginBottom: 16, background: '#f6f8fa' }}
        >
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            Target scope (reference)
          </div>
          <Breadcrumb
            items={[
              { title: 'Hardware' },
              { title: 'Printers' },
            ]}
          />
        </Card>

        <Card title="Support Area Configuration">
          <div style={{ marginBottom: 12, fontSize: 12, color: '#888' }}>
            Select the intermediate support area. Leaf selection is not required.
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Support area
            </label>
            <Cascader
              style={{ width: '100%' }}
              options={cascaderOptions}
              value={value}
              onChange={(val) => setValue(val as string[])}
              placeholder="Select area"
              changeOnSelect
            />
          </div>
          <Button type="primary" style={{ marginTop: 16 }} onClick={handleApply}>
            Apply area
          </Button>
        </Card>
      </div>
    </div>
  );
}
