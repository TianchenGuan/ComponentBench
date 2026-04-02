'use client';

/**
 * cascader-antd-v2-T15: Lazy-loaded compact form row with nested page and popup scroll
 *
 * Nested-scroll layout with stacked form rows. The target row "Knowledge base path"
 * contains a compact Cascader with lazy-loaded children. The Hardware subtree loads
 * children lazily; the final "Routers" option may require scrolling the popup column.
 * Select Hardware / Networking / Routers, then click "Apply row".
 *
 * Success: path equals [Hardware, Networking, Routers], "Apply row" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Input, Tag, ConfigProvider } from 'antd';
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
          { value: 'drivers', label: 'Drivers' },
          { value: 'firmware', label: 'Firmware' },
        ],
      },
      {
        value: 'networking', label: 'Networking',
        children: [
          { value: 'access-points', label: 'Access Points' },
          { value: 'cables', label: 'Cables' },
          { value: 'firewalls', label: 'Firewalls' },
          { value: 'modems', label: 'Modems' },
          { value: 'routers', label: 'Routers' },
          { value: 'switches', label: 'Switches' },
          { value: 'vpn', label: 'VPN Appliances' },
        ],
      },
      {
        value: 'storage', label: 'Storage',
        children: [
          { value: 'nas', label: 'NAS' },
          { value: 'san', label: 'SAN' },
          { value: 'backup', label: 'Backup' },
        ],
      },
    ],
  },
  {
    value: 'software',
    label: 'Software',
    children: [
      {
        value: 'operating-systems', label: 'Operating Systems',
        children: [
          { value: 'windows', label: 'Windows' },
          { value: 'linux', label: 'Linux' },
          { value: 'macos', label: 'macOS' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['hardware', 'networking', 'routers'];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider componentSize="small">
      <div style={{ padding: 24, maxHeight: '100vh', overflow: 'auto' }}>
        <div style={{ maxWidth: 520, margin: '0 0 0 80px' }}>
          <Card size="small" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontWeight: 500, fontSize: 12, flex: '0 0 110px' }}>Article title</label>
              <Input size="small" defaultValue="Printer Setup Guide" />
            </div>
          </Card>

          <Card size="small" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontWeight: 500, fontSize: 12, flex: '0 0 110px' }}>Author</label>
              <Input size="small" defaultValue="admin@corp.com" />
              <Tag color="blue">Verified</Tag>
            </div>
          </Card>

          <Card size="small" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontWeight: 500, fontSize: 12, flex: '0 0 110px' }}>
                Knowledge base path
              </label>
              <div style={{ flex: 1 }}>
                <Cascader
                  style={{ width: '100%' }}
                  options={cascaderOptions}
                  value={value}
                  onChange={(val) => setValue(val as string[])}
                  placeholder="Select path"
                />
              </div>
              <Button type="primary" size="small" onClick={handleApply}>
                Apply row
              </Button>
            </div>
          </Card>

          <Card size="small" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontWeight: 500, fontSize: 12, flex: '0 0 110px' }}>Tags</label>
              <div>
                <Tag>hardware</Tag>
                <Tag>setup</Tag>
                <Tag>internal</Tag>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
