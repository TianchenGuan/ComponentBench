'use client';

/**
 * transfer_list-antd-T02: Enable all regions
 *
 * Layout: isolated card in the center titled "Regional availability".
 * A single AntD Transfer component is shown with titles "All regions" (left)
 * and "Enabled Regions" (right). The header includes the standard select-all checkbox for each column.
 *
 * Spacing is comfortable, size is default, light theme.
 * Initial state: Enabled Regions is empty.
 * The left list contains exactly 6 regions: North America, South America, Europe, Africa, Asia, Oceania.
 * No search box and no additional controls besides the built-in transfer operations.
 *
 * Success: Target (right) list contains exactly all 6 regions (order ignore).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const allItems: TransferItem[] = [
  { key: 'north-america', title: 'North America' },
  { key: 'south-america', title: 'South America' },
  { key: 'europe', title: 'Europe' },
  { key: 'africa', title: 'Africa' },
  { key: 'asia', title: 'Asia' },
  { key: 'oceania', title: 'Oceania' },
];

const targetKeys = allItems.map((item) => item.key);

export default function T02({ onSuccess }: TaskComponentProps) {
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
    <Card title="Regional availability" style={{ width: 700 }} data-testid="transfer-regions">
      <Transfer
        dataSource={allItems}
        titles={['All regions', 'Enabled Regions']}
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
