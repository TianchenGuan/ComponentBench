'use client';

/**
 * listbox_multi-antd-T05: Transfer search: select roles
 *
 * Layout: form_section centered in the viewport. Above the target component are two unrelated text inputs ("Email" and "Team").
 * Target component: an Ant Design Transfer widget used as a multi-select listbox.
 * Left column title: "Available roles". Right column title: "Assigned" (empty).
 * Configuration: showSearch=true, showSelectAll=true. A search input appears at the top of the left list.
 * Options in the left list (20 total). Examples include: Viewer, Editor, Admin, Billing Admin, Compliance Viewer, Support Agent, etc.
 * Initial state: none selected.
 *
 * Success: The target listbox (Available roles) has exactly: Editor, Billing Admin, Compliance Viewer, Support Agent.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer, Input, Typography, Space } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

interface DataItem {
  key: string;
  title: string;
}

const allRoles = [
  'Viewer',
  'Editor',
  'Admin',
  'Billing Admin',
  'Compliance Viewer',
  'Support Agent',
  'Read-only Auditor',
  'Project Owner',
  'Team Lead',
  'Security Admin',
  'Data Analyst',
  'Marketing Manager',
  'Product Manager',
  'HR Manager',
  'Finance Manager',
  'IT Support',
  'DevOps Engineer',
  'QA Engineer',
  'Designer',
  'Intern',
];

const mockData: DataItem[] = allRoles.map((role) => ({ key: role, title: role }));
const targetSet = ['Editor', 'Billing Admin', 'Compliance Viewer', 'Support Agent'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selectedKeys, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys.map(k => String(k)));
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    _targetSelectedKeys
  ) => {
    setSelectedKeys(sourceSelectedKeys.map(k => String(k)));
  };

  const filterOption = (inputValue: string, item: DataItem) =>
    item.title.toLowerCase().includes(inputValue.toLowerCase());

  return (
    <Card style={{ width: 700, padding: 24 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Invite user: choose roles from the Available roles list.
      </Text>
      <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
        <div>
          <Text strong>Email</Text>
          <Input placeholder="user@example.com" style={{ marginTop: 4 }} />
        </div>
        <div>
          <Text strong>Team</Text>
          <Input placeholder="Engineering" style={{ marginTop: 4 }} />
        </div>
      </Space>
      <Transfer
        dataSource={mockData}
        titles={['Available roles', 'Assigned']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={(item) => item.title}
        showSearch
        showSelectAll
        filterOption={filterOption}
        listStyle={{ width: 280, height: 350 }}
      />
    </Card>
  );
}
