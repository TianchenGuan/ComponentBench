'use client';

/**
 * listbox_multi-antd-T08: Dark Transfer with pagination: pick projects
 *
 * Layout: isolated_card in dark theme, anchored near the bottom-right of the viewport.
 * Target component: Ant Design Transfer used as a multi-select listbox.
 * Left column title: "All projects"; right column title: "Selected" (empty).
 * Configuration: showSearch=true; pagination enabled with page size 10; showSelectAll=true.
 * There are 60 projects in the left list with similar naming patterns (e.g., Project Omega 01–20, Project Sigma 01–20, Project Tau 01–20).
 * Initial state: no items selected.
 *
 * Success: The target listbox has exactly: Project Omega 03, Project Omega 14, Project Sigma 07, Project Sigma 19, Project Tau 02.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer, Typography, ConfigProvider, theme } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

interface DataItem {
  key: string;
  title: string;
}

// Generate 60 projects
const generateProjects = (): DataItem[] => {
  const projects: DataItem[] = [];
  const prefixes = ['Omega', 'Sigma', 'Tau'];
  prefixes.forEach((prefix) => {
    for (let i = 1; i <= 20; i++) {
      const name = `Project ${prefix} ${i.toString().padStart(2, '0')}`;
      projects.push({ key: name, title: name });
    }
  });
  return projects;
};

const mockData = generateProjects();
const targetSet = [
  'Project Omega 03',
  'Project Omega 14',
  'Project Sigma 07',
  'Project Sigma 19',
  'Project Tau 02',
];

export default function T08({ onSuccess }: TaskComponentProps) {
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
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Card
        style={{
          width: 700,
          background: '#1f1f1f',
          border: '1px solid #434343',
        }}
      >
        <Text style={{ display: 'block', marginBottom: 16, color: '#ffffffa6' }}>
          Project access: select projects to review.
        </Text>
        <Transfer
          dataSource={mockData}
          titles={['All projects', 'Selected']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item) => item.title}
          showSearch
          showSelectAll
          filterOption={filterOption}
          pagination={{ pageSize: 10 }}
          listStyle={{ width: 280, height: 400, background: '#141414' }}
        />
      </Card>
    </ConfigProvider>
  );
}
