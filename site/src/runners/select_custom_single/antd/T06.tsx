'use client';

/**
 * select_custom_single-antd-T06: Search and select assignee Ava Stone
 *
 * Layout: centered isolated card titled "Create issue".
 * The card contains one Ant Design Select labeled "Assignee".
 *
 * Configuration: showSearch is enabled, so when the dropdown opens there is a text search input at the top
 * and the list filters as you type.
 *
 * Initial state: no assignee selected (placeholder "Select a person").
 * The dropdown list contains 30 people with similar-looking name structure (First Last), each option custom-rendered with:
 * - a small circular avatar on the left
 * - the person's name as text on the right
 *
 * Target option: "Ava Stone".
 * The list is long enough that scrolling is possible, but searching is the intended fast path.
 *
 * Feedback: selecting an assignee immediately sets the value in the field and closes the dropdown.
 *
 * Success: The Select labeled "Assignee" has selected value exactly "Ava Stone".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const people = [
  'Alex Johnson', 'Amy Chen', 'Anna Davis', 'Ava Stone', 'Ben Miller',
  'Brian Lee', 'Carlos Garcia', 'Chris Wilson', 'Daniel Brown', 'David Kim',
  'Elena Rodriguez', 'Emma Thompson', 'Eric Martinez', 'Grace Liu', 'Hannah White',
  'Jack Anderson', 'James Taylor', 'Jennifer Clark', 'Jessica Moore', 'John Smith',
  'Kate Williams', 'Kevin Jones', 'Laura Hall', 'Liam Young', 'Linda King',
  'Mark Wright', 'Michael Scott', 'Nina Patel', 'Oliver Green', 'Sarah Adams',
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Ava Stone') {
      onSuccess();
    }
  };

  return (
    <Card title="Create issue" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Assignee</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        You can type to search.
      </Text>
      <Select
        data-testid="assignee-select"
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        showSearch
        placeholder="Select a person"
        optionFilterProp="label"
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
        }
        options={people.map(name => ({
          value: name,
          label: name,
        }))}
        optionRender={(option) => (
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            {option.label}
          </Space>
        )}
      />
    </Card>
  );
}
