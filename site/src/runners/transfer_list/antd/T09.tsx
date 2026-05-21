'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const allItems: TransferItem[] = Array.from({ length: 80 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return { key: `customer-${num}`, title: `Customer ${num}` };
});

const targetKeys = ['customer-73', 'customer-74', 'customer-79'];

export default function T09({ onSuccess }: TaskComponentProps) {
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
    <Card title="Invite customers" style={{ width: 700 }} data-testid="transfer-customers">
      <Transfer
        dataSource={allItems}
        titles={['All customers', 'Invited']}
        targetKeys={targetKeyState}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={(item) => item.title}
        listStyle={{ width: 250, height: 280 }}
      />
    </Card>
  );
}
