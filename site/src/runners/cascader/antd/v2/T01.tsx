'use client';

/**
 * cascader-antd-v2-T01: Lazy-loaded drawer category with deferred final submenu
 *
 * Drawer flow over a documentation settings page. Inside the drawer is one compact
 * Cascader labeled "Category". The first levels (Hardware, Printers) are immediate,
 * but leaf options under Printers load lazily after expansion. Final column siblings:
 * Install, Setup, Troubleshooting. Drawer footer: Cancel + Save category.
 *
 * Success: path equals [Hardware, Printers, Setup] AND "Save category" clicked.
 */

import React, { useState, useRef } from 'react';
import { Button, Drawer, Cascader, Space, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const cascaderOptions: Option[] = [
  {
    value: 'hardware',
    label: 'Hardware',
    children: [
      {
        value: 'printers',
        label: 'Printers',
        children: [
          { value: 'install', label: 'Install' },
          { value: 'setup', label: 'Setup' },
          { value: 'troubleshooting', label: 'Troubleshooting' },
        ],
      },
      {
        value: 'networking',
        label: 'Networking',
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
      {
        value: 'operating-systems',
        label: 'Operating Systems',
        children: [
          { value: 'windows', label: 'Windows' },
          { value: 'linux', label: 'Linux' },
        ],
      },
      {
        value: 'productivity',
        label: 'Productivity',
        children: [
          { value: 'office', label: 'Office Suite' },
          { value: 'email', label: 'Email Clients' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['hardware', 'printers', 'setup'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleSave = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 560, margin: '40px auto 0 120px' }}>
        <Typography.Title level={4}>Documentation Settings</Typography.Title>
        <div style={{ marginBottom: 16 }}>
          <Tag color="blue">Active</Tag>
          <span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>
            Last updated: 2 days ago
          </span>
        </div>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Manage knowledge base articles, categories, and taxonomy settings.
        </p>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Knowledge base category
        </Button>
      </div>

      <Drawer
        title="Knowledge base category"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={400}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>
                Save category
              </Button>
            </Space>
          </div>
        }
      >
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Category
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={cascaderOptions}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Please select"
            getPopupContainer={(trigger) => trigger.parentElement || document.body}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
            Select the primary category for this knowledge base article.
          </div>
        </div>
      </Drawer>
    </div>
  );
}
