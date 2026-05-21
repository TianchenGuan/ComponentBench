'use client';

/**
 * listbox_multi-antd-T03: Transfer: select candidates in Available
 *
 * Layout: isolated_card centered titled "Candidate shortlist".
 * Target component: an Ant Design Transfer widget used purely as a multi-select listbox. Two columns are visible:
 *   - Left column title: "Available candidates" with a list of names and checkboxes.
 *   - Right column title: "Selected" but it is empty and shows the empty-state text.
 * Transfer buttons (move right / move left) are present but are NOT required for success.
 * Options in the left list (8): Avery, Blake, Casey, Drew, Eden, Jordan, Kai, Morgan.
 * Initial state: no items selected.
 * No search box (showSearch=false). No pagination. No scrolling needed.
 *
 * Success: The target listbox (Available candidates) has exactly these selected items: Avery, Jordan, Kai.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer, Typography } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

interface DataItem {
  key: string;
  title: string;
}

const mockData: DataItem[] = [
  { key: 'Avery', title: 'Avery' },
  { key: 'Blake', title: 'Blake' },
  { key: 'Casey', title: 'Casey' },
  { key: 'Drew', title: 'Drew' },
  { key: 'Eden', title: 'Eden' },
  { key: 'Jordan', title: 'Jordan' },
  { key: 'Kai', title: 'Kai' },
  { key: 'Morgan', title: 'Morgan' },
];

const targetSet = ['Avery', 'Jordan', 'Kai'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const successFired = useRef(false);

  // Check success based on selectedKeys in the left/source column only
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

  return (
    <Card title="Candidate shortlist" style={{ width: 600 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Candidate shortlist (select candidates to review).
      </Text>
      <Transfer
        dataSource={mockData}
        titles={['Available candidates', 'Selected']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={(item) => item.title}
        showSearch={false}
        listStyle={{ width: 220, height: 280 }}
      />
    </Card>
  );
}
