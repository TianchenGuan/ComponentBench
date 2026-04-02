'use client';

/**
 * transfer_list-antd-T01: Select two beta testers
 *
 * Layout: an isolated card centered on the page titled "Beta tester selection".
 * The card contains a single Ant Design Transfer component with two columns
 * labeled "Available" (left/source) and "Selected" (right/target).
 * Each row has a checkbox and the person's full name.
 * Between the columns are the standard AntD transfer operation buttons (move right '>' and move left '<').
 *
 * Spacing is comfortable and the component is rendered at default size.
 * There is no search box. Initial state: the Selected column is empty and no items are checked.
 * There are 8 available names: Ava Patel, Noah Kim, Emma Chen, Liam Davis, Sofia Garcia,
 * Ethan Wright, Mia Johnson, and Lucas Brown. No other interactive UI is present (no clutter).
 *
 * Success: Target (right) list contains exactly: Ava Patel, Noah Kim (order ignore).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const allItems: TransferItem[] = [
  { key: 'ava-patel', title: 'Ava Patel' },
  { key: 'noah-kim', title: 'Noah Kim' },
  { key: 'emma-chen', title: 'Emma Chen' },
  { key: 'liam-davis', title: 'Liam Davis' },
  { key: 'sofia-garcia', title: 'Sofia Garcia' },
  { key: 'ethan-wright', title: 'Ethan Wright' },
  { key: 'mia-johnson', title: 'Mia Johnson' },
  { key: 'lucas-brown', title: 'Lucas Brown' },
];

const targetKeys = ['ava-patel', 'noah-kim'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [targetKeyState, setTargetKeyState] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(targetKeyState, targetKeys)) {
      successFired.current = true;
      onSuccess();
    }
  }, [targetKeyState, onSuccess]);

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeyState(newTargetKeys as string[]);
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys] as string[]);
  };

  return (
    <Card title="Beta tester selection" style={{ width: 700 }} data-testid="transfer-beta">
      <Transfer
        dataSource={allItems}
        titles={['Available', 'Selected']}
        targetKeys={targetKeyState}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={(item) => item.title}
        listStyle={{ width: 250, height: 300 }}
        data-testid="transfer-component"
      />
    </Card>
  );
}
