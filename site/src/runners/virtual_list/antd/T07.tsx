'use client';

/**
 * virtual_list-antd-T07: Select the row that matches a visual reference card
 *
 * Layout: isolated_card titled "People Directory".
 * Target component: one virtualized list with 30 unique people.
 * Visual guidance: a "Target" card above the list shows the avatar color + role tag of the target.
 * Each person has a unique name, unique avatar color + role combination.
 *
 * Success: Select the row matching the target (person whose avatar color and role match the Target card).
 */

import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface PersonItem {
  key: string;
  name: string;
  role: string;
  avatarColor: string;
}

const roleColors: Record<string, string> = {
  Support: 'blue',
  Sales: 'green',
  Engineering: 'purple',
  Marketing: 'orange',
  HR: 'cyan',
  Design: 'magenta',
};

const people: PersonItem[] = [
  { key: 'p-01', name: 'Alex Lee', role: 'Support', avatarColor: '#f56a00' },
  { key: 'p-02', name: 'Jordan Martinez', role: 'Sales', avatarColor: '#7265e6' },
  { key: 'p-03', name: 'Taylor Smith', role: 'Engineering', avatarColor: '#ffbf00' },
  { key: 'p-04', name: 'Morgan Kim', role: 'Marketing', avatarColor: '#00a2ae' },
  { key: 'p-05', name: 'Casey Brown', role: 'HR', avatarColor: '#87d068' },
  { key: 'p-06', name: 'Riley Johnson', role: 'Support', avatarColor: '#1890ff' },
  { key: 'p-07', name: 'Quinn Chen', role: 'Sales', avatarColor: '#722ed1' },
  { key: 'p-08', name: 'Avery Patel', role: 'Engineering', avatarColor: '#f5222d' },
  { key: 'p-09', name: 'Parker Garcia', role: 'Marketing', avatarColor: '#eb2f96' },
  { key: 'p-10', name: 'Drew Wilson', role: 'HR', avatarColor: '#fa8c16' },
  { key: 'p-11', name: 'Sam Rivera', role: 'Design', avatarColor: '#13c2c2' },
  { key: 'p-12', name: 'Jamie Brooks', role: 'Support', avatarColor: '#52c41a' },
  { key: 'p-13', name: 'Reese Cooper', role: 'Sales', avatarColor: '#2f54eb' },
  { key: 'p-14', name: 'Blake Nguyen', role: 'Engineering', avatarColor: '#faad14' },
  { key: 'p-15', name: 'Hayden Cruz', role: 'Marketing', avatarColor: '#a0d911' },
  { key: 'p-16', name: 'Dakota Fields', role: 'HR', avatarColor: '#1677ff' },
  { key: 'p-17', name: 'Emery Walsh', role: 'Design', avatarColor: '#ff4d4f' },
  { key: 'p-18', name: 'Finley Adams', role: 'Support', avatarColor: '#9254de' },
  { key: 'p-19', name: 'Sage Thompson', role: 'Sales', avatarColor: '#ff7a45' },
  { key: 'p-20', name: 'Rowan Mitchell', role: 'Engineering', avatarColor: '#36cfc9' },
  { key: 'p-21', name: 'Kendall Hayes', role: 'Marketing', avatarColor: '#597ef7' },
  { key: 'p-22', name: 'Logan Price', role: 'HR', avatarColor: '#f759ab' },
  { key: 'p-23', name: 'Ellis Grant', role: 'Design', avatarColor: '#ffa940' },
  { key: 'p-24', name: 'Harley Ross', role: 'Support', avatarColor: '#73d13d' },
  { key: 'p-25', name: 'Tatum Burke', role: 'Sales', avatarColor: '#40a9ff' },
  { key: 'p-26', name: 'River Fox', role: 'Engineering', avatarColor: '#b37feb' },
  { key: 'p-27', name: 'Shay Delgado', role: 'Marketing', avatarColor: '#ff85c0' },
  { key: 'p-28', name: 'Jules Warren', role: 'HR', avatarColor: '#ffc53d' },
  { key: 'p-29', name: 'Ari Hoffman', role: 'Design', avatarColor: '#95de64' },
  { key: 'p-30', name: 'Kai Ramirez', role: 'Support', avatarColor: '#69c0ff' },
];

const TARGET_KEY = 'p-21';
const targetPerson = people.find(p => p.key === TARGET_KEY)!;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (selectedKey === TARGET_KEY) {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  const selectedPerson = people.find(p => p.key === selectedKey);

  return (
    <Card
      title="People Directory"
      style={{ width: 480 }}
      data-testid="vl-primary"
    >
      <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Text strong style={{ marginRight: 8 }}>Target:</Text>
          <Avatar
            style={{ backgroundColor: targetPerson.avatarColor }}
            icon={<UserOutlined />}
            size={40}
          />
          <Tag color={roleColors[targetPerson.role]}>{targetPerson.role}</Tag>
        </div>
      </Card>

      <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
        <VirtualList
          data={people}
          height={340}
          itemHeight={56}
          itemKey="key"
        >
          {(item: PersonItem) => (
            <div
              key={item.key}
              data-item-key={item.key}
              aria-selected={selectedKey === item.key}
              onClick={() => setSelectedKey(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: selectedKey === item.key ? '#e6f4ff' : 'transparent',
                gap: 12,
              }}
            >
              <Avatar
                style={{ backgroundColor: item.avatarColor }}
                icon={<UserOutlined />}
              />
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <Tag color={roleColors[item.role]}>{item.role}</Tag>
            </div>
          )}
        </VirtualList>
      </div>
      <div style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        Selected person: {selectedPerson?.name || 'none'}
      </div>
    </Card>
  );
}
