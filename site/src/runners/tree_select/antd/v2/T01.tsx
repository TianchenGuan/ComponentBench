'use client';

/**
 * tree_select-antd-v2-T01: Prefilled-neighbor decoy — set Backup service path and apply
 *
 * Settings panel with toggles, segmented controls, and status chips. Two TreeSelect controls:
 * "Primary service path" prefilled with Mobile Web, "Backup service path" starts empty.
 * Button "Apply routing" commits both. Only Backup should change.
 *
 * Success: Backup = svc-company-eng-frontend-web, Primary unchanged, Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, TreeSelect, Button, Space, Typography, Switch, Tag, Segmented } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const treeData = [
  {
    value: 'company', title: 'Company', selectable: false, children: [
      {
        value: 'company-engineering', title: 'Engineering', selectable: false, children: [
          {
            value: 'company-eng-frontend', title: 'Frontend', selectable: false, children: [
              { value: 'svc-company-eng-frontend-web', title: 'Web' },
              { value: 'svc-company-eng-frontend-mobileweb', title: 'Mobile Web' },
            ],
          },
          {
            value: 'company-eng-backend', title: 'Backend', selectable: false, children: [
              { value: 'svc-company-eng-backend-api', title: 'API' },
              { value: 'svc-company-eng-backend-data', title: 'Data' },
            ],
          },
          { value: 'svc-company-eng-qa', title: 'QA' },
        ],
      },
      {
        value: 'company-sales', title: 'Sales', selectable: false, children: [
          {
            value: 'company-sales-americas', title: 'Americas', selectable: false, children: [
              { value: 'svc-company-sales-americas-usa', title: 'USA' },
              { value: 'svc-company-sales-americas-ca', title: 'Canada' },
            ],
          },
          {
            value: 'company-sales-emea', title: 'EMEA', selectable: false, children: [
              { value: 'svc-company-sales-emea-uk', title: 'UK' },
              { value: 'svc-company-sales-emea-de', title: 'Germany' },
            ],
          },
        ],
      },
      {
        value: 'company-hr', title: 'HR', selectable: false, children: [
          { value: 'svc-company-hr-recruiting', title: 'Recruiting' },
          { value: 'svc-company-hr-peopleops', title: 'People Ops' },
        ],
      },
    ],
  },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<string>('svc-company-eng-frontend-mobileweb');
  const [backupValue, setBackupValue] = useState<string | undefined>(undefined);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && backupValue === 'svc-company-eng-frontend-web' && primaryValue === 'svc-company-eng-frontend-mobileweb') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, backupValue, primaryValue, onSuccess]);

  return (
    <div style={{ padding: 16, maxWidth: 560, marginLeft: 80 }}>
      <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>Service Routing</Text>
      <div style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Switch defaultChecked size="small" /> <Text type="secondary">Auto-route</Text>
        <Segmented options={['Standard', 'Priority']} size="small" />
        <Tag color="green">Healthy</Tag>
        <Tag>v2.4.1</Tag>
      </div>
      <Card title="Routing Configuration" size="small">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Primary service path</Text>
            <TreeSelect
              style={{ width: '100%' }}
              value={primaryValue}
              onChange={(val) => { setPrimaryValue(val); setCommitted(false); }}
              treeData={treeData}
              placeholder="Please select"
              showSearch={false}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Backup service path</Text>
            <TreeSelect
              style={{ width: '100%' }}
              value={backupValue}
              onChange={(val) => { setBackupValue(val); setCommitted(false); }}
              treeData={treeData}
              placeholder="Please select"
              showSearch={false}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          </div>
          <Button type="primary" onClick={() => setCommitted(true)}>Apply routing</Button>
        </Space>
      </Card>
    </div>
  );
}
