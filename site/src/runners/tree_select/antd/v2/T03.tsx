'use client';

/**
 * tree_select-antd-v2-T03: Strict-check drawer — exact parent-plus-leaf notification scopes
 *
 * Drawer flow with treeCheckable + treeCheckStrictly. Parent and child checkboxes are independent.
 * Select exactly "Company / Engineering" AND "Company / Engineering / Platform / Queues".
 * Click "Save scopes" to commit.
 *
 * Success: Exactly {company-engineering, company-engineering-platform-queues} selected + saved.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, TreeSelect, Drawer, Space, Typography, Tag } from 'antd';
import { setsEqual } from '../../types';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const treeData = [
  {
    value: 'company', title: 'Company', children: [
      {
        value: 'company-engineering', title: 'Engineering', children: [
          {
            value: 'company-engineering-platform', title: 'Platform', children: [
              { value: 'company-engineering-platform-queues', title: 'Queues' },
              { value: 'company-engineering-platform-cache', title: 'Cache' },
              { value: 'company-engineering-platform-database', title: 'Database' },
            ],
          },
          {
            value: 'company-engineering-frontend', title: 'Frontend', children: [
              { value: 'company-engineering-frontend-web', title: 'Web' },
              { value: 'company-engineering-frontend-mobile', title: 'Mobile' },
            ],
          },
        ],
      },
      {
        value: 'company-sales', title: 'Sales', children: [
          { value: 'company-sales-americas', title: 'Americas' },
          { value: 'company-sales-emea', title: 'EMEA' },
        ],
      },
      {
        value: 'company-hr', title: 'HR', children: [
          { value: 'company-hr-recruiting', title: 'Recruiting' },
        ],
      },
    ],
  },
];

const TARGET_SET = ['company-engineering', 'company-engineering-platform-queues'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Array<{ label: string; value: string }>>([]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed) {
      const vals = selected.map((s) => s.value);
      if (setsEqual(vals, TARGET_SET)) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [committed, selected, onSuccess]);

  const handleSave = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 8 }}>Release Settings</Text>
      <Card size="small" style={{ maxWidth: 500, marginBottom: 16 }}>
        <Space>
          <Tag color="blue">Release v3.1</Tag>
          <Tag>Staging</Tag>
        </Space>
      </Card>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>Notification scopes</Button>

      <Drawer
        title="Notification Scopes"
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save scopes</Button>
          </Space>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Scopes</Text>
        <TreeSelect
          style={{ width: '100%' }}
          value={selected}
          onChange={(val) => { setSelected(val); setCommitted(false); }}
          treeData={treeData}
          treeCheckable
          treeCheckStrictly
          placeholder="Select notification scopes"
          showSearch={false}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
      </Drawer>
    </div>
  );
}
