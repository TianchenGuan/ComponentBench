'use client';

/**
 * tree_view-antd-T02: Select Engineering > Frontend
 *
 * Layout: isolated_card centered with title "Team Directory".
 * One Ant Design Tree lists departments as a hierarchy. Root nodes: "Engineering", "Sales", "HR".
 * Engineering has children: "Frontend", "Backend", and "QA". Sales has children: "Accounts", "Partnerships".
 *
 * Configuration: selectable=true (default), checkable=false.
 * Initial state: all roots are collapsed, and the currently selected item is "Sales" (selectedKeys=['org/sales']).
 *
 * Success: The selected Tree node id equals 'org/engineering/frontend'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';

const treeData: TreeDataNode[] = [
  {
    title: 'Engineering',
    key: 'org/engineering',
    children: [
      { title: 'Frontend', key: 'org/engineering/frontend', isLeaf: true },
      { title: 'Backend', key: 'org/engineering/backend', isLeaf: true },
      { title: 'QA', key: 'org/engineering/qa', isLeaf: true },
    ],
  },
  {
    title: 'Sales',
    key: 'org/sales',
    children: [
      { title: 'Accounts', key: 'org/sales/accounts', isLeaf: true },
      { title: 'Partnerships', key: 'org/sales/partnerships', isLeaf: true },
    ],
  },
  { title: 'HR', key: 'org/hr', isLeaf: true },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['org/sales']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && selectedKeys.length === 1 && selectedKeys[0] === 'org/engineering/frontend') {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card title="Team Directory" style={{ width: 400 }} data-testid="tree-card">
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        selectedKeys={selectedKeys}
        onSelect={(keys) => setSelectedKeys(keys)}
        selectable={true}
        checkable={false}
        data-testid="tree-root"
      />
    </Card>
  );
}
