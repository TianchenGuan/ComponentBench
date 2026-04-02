'use client';

/**
 * transfer_list-antd-T03: Clear selected assignees
 *
 * Layout: isolated card centered on the page titled "Task assignees".
 * A single AntD Transfer component is displayed with columns "Unassigned" (left) and "Assigned" (right).
 * Between them are the standard transfer buttons.
 *
 * Spacing comfortable, default scale, light theme, no search input.
 * Initial state: the Assigned (right) list contains 3 names: Alice Nguyen, Ben Ortiz, and Chloe Park.
 * The Unassigned (left) list contains 5 names: Daniel Reed, Eva Müller, Farah Ali, George King, Hana Sato.
 * No other interactive elements are on the page.
 *
 * Success: Target (right) list is empty.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const allItems: TransferItem[] = [
  { key: 'alice-nguyen', title: 'Alice Nguyen' },
  { key: 'ben-ortiz', title: 'Ben Ortiz' },
  { key: 'chloe-park', title: 'Chloe Park' },
  { key: 'daniel-reed', title: 'Daniel Reed' },
  { key: 'eva-muller', title: 'Eva Müller' },
  { key: 'farah-ali', title: 'Farah Ali' },
  { key: 'george-king', title: 'George King' },
  { key: 'hana-sato', title: 'Hana Sato' },
];

// Initial target keys (pre-assigned)
const initialTargetKeys = ['alice-nguyen', 'ben-ortiz', 'chloe-park'];
// Goal: empty
const targetKeys: string[] = [];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [targetKeyState, setTargetKeyState] = useState<string[]>(initialTargetKeys);
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
    <Card title="Task assignees" style={{ width: 700 }} data-testid="transfer-assignees">
      <Transfer
        dataSource={allItems}
        titles={['Unassigned', 'Assigned']}
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
