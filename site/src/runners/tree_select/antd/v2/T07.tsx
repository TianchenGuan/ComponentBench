'use client';

/**
 * tree_select-antd-v2-T07: Replace wrong default checked leaf and keep exact two-item set
 *
 * Nested-scroll layout. treeCheckable TreeSelect labeled "Archive scopes".
 * Initial set: {Teams/Platform/Database, Teams/Platform/Cache}.
 * Must remove Cache, keep Database, add Teams/Support/Identity.
 * Final = {teams-platform-database, teams-support-identity}. Click "Apply archive scopes".
 *
 * Success: Exact set matches, Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, TreeSelect, Button, Typography, Space, Tag } from 'antd';
import { setsEqual } from '../../types';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const treeData = [
  {
    value: 'teams', title: 'Teams', selectable: false, children: [
      {
        value: 'teams-platform', title: 'Platform', selectable: false, children: [
          { value: 'teams-platform-database', title: 'Database' },
          { value: 'teams-platform-cache', title: 'Cache' },
          { value: 'teams-platform-queues', title: 'Queues' },
        ],
      },
      {
        value: 'teams-support', title: 'Support', selectable: false, children: [
          { value: 'teams-support-identity', title: 'Identity' },
          { value: 'teams-support-billing', title: 'Billing' },
        ],
      },
      {
        value: 'teams-frontend', title: 'Frontend', selectable: false, children: [
          { value: 'teams-frontend-web', title: 'Web' },
          { value: 'teams-frontend-mobile', title: 'Mobile' },
        ],
      },
    ],
  },
];

const TARGET_SET = ['teams-platform-database', 'teams-support-identity'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['teams-platform-database', 'teams-platform-cache']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && setsEqual(selected, TARGET_SET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selected, onSuccess]);

  return (
    <div style={{ padding: 16, height: '150vh' }}>
      <div style={{ maxWidth: 480, marginLeft: 60, paddingTop: 40 }}>
        <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 8 }}>Archive Settings</Text>
        <Space style={{ marginBottom: 12 }}>
          <Tag color="blue">Retention: 90d</Tag>
          <Tag>Region: US-East</Tag>
        </Space>
        <Card title="Archive Scopes" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Archive scopes</Text>
              <TreeSelect
                style={{ width: '100%' }}
                value={selected}
                onChange={(val) => { setSelected(val); setCommitted(false); }}
                treeData={treeData}
                treeCheckable
                placeholder="Select scopes"
                showSearch={false}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              />
            </div>
            <Button type="primary" onClick={() => setCommitted(true)}>Apply archive scopes</Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
