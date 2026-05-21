'use client';

/**
 * transfer_list-antd-T05: Add three countries using search
 *
 * Layout: isolated card centered on the page titled "Country allowlist".
 * It contains a single AntD Transfer component with titles "All countries" (left)
 * and "Enabled countries" (right).
 *
 * Configuration: showSearch is enabled, so a search input appears at the top of each column.
 * The list contains 30 country names. Initial state: Enabled countries is empty.
 *
 * The component is default scale, comfortable spacing, light theme, no extra clutter.
 *
 * Success: Target (right) list contains exactly: Canada, Japan, Kenya (order ignore).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const allItems: TransferItem[] = [
  { key: 'argentina', title: 'Argentina' },
  { key: 'australia', title: 'Australia' },
  { key: 'brazil', title: 'Brazil' },
  { key: 'canada', title: 'Canada' },
  { key: 'chile', title: 'Chile' },
  { key: 'china', title: 'China' },
  { key: 'denmark', title: 'Denmark' },
  { key: 'egypt', title: 'Egypt' },
  { key: 'france', title: 'France' },
  { key: 'germany', title: 'Germany' },
  { key: 'india', title: 'India' },
  { key: 'indonesia', title: 'Indonesia' },
  { key: 'italy', title: 'Italy' },
  { key: 'japan', title: 'Japan' },
  { key: 'jordan', title: 'Jordan' },
  { key: 'kenya', title: 'Kenya' },
  { key: 'mexico', title: 'Mexico' },
  { key: 'netherlands', title: 'Netherlands' },
  { key: 'nigeria', title: 'Nigeria' },
  { key: 'norway', title: 'Norway' },
  { key: 'peru', title: 'Peru' },
  { key: 'poland', title: 'Poland' },
  { key: 'singapore', title: 'Singapore' },
  { key: 'spain', title: 'Spain' },
  { key: 'sweden', title: 'Sweden' },
  { key: 'switzerland', title: 'Switzerland' },
  { key: 'thailand', title: 'Thailand' },
  { key: 'turkey', title: 'Turkey' },
  { key: 'united-kingdom', title: 'United Kingdom' },
  { key: 'united-states', title: 'United States' },
];

const targetKeys = ['canada', 'japan', 'kenya'];

export default function T05({ onSuccess }: TaskComponentProps) {
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

  const filterOption = (inputValue: string, option: TransferItem) =>
    option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  return (
    <Card title="Country allowlist" style={{ width: 700 }} data-testid="transfer-countries">
      <Transfer
        dataSource={allItems}
        titles={['All countries', 'Enabled countries']}
        targetKeys={targetKeyState}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={(item) => item.title}
        listStyle={{ width: 250, height: 350 }}
        showSearch
        filterOption={filterOption}
        data-testid="transfer-component"
      />
    </Card>
  );
}
