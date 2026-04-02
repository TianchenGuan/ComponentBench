'use client';

/**
 * tree_view-antd-T05: Select Invoices in Folder access tree (2 instances)
 *
 * Layout: settings_panel with two columns. Left column is a sidebar titled "Navigation" containing a Tree for app sections.
 * Right column is a panel titled "Folder access" containing a second Tree that controls folder permissions.
 *
 * Tree instances (E6=2):
 * 1) "Navigation" tree (left): root nodes like "Dashboard", "Settings", "Billing".
 * 2) "Folder access" tree (right, TARGET): root nodes "Finance", "HR", "Engineering".
 *    "Finance" has children "Invoices", "Budgets", "Payroll".
 *
 * Configuration: both are standard AntD Tree components (selectable=true, checkable=false).
 * Initial state: both trees are collapsed; the left tree has "Dashboard" selected by default;
 * right tree has nothing selected.
 *
 * Clutter: the right panel also contains non-interactive helper text and a disabled "Save changes" button.
 *
 * Success: In the Tree instance labeled 'Folder access', the selected node id equals 'perm/finance/invoices'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Button, Typography } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const navigationTreeData: TreeDataNode[] = [
  { title: 'Dashboard', key: 'nav/dashboard', isLeaf: true },
  { title: 'Settings', key: 'nav/settings', isLeaf: true },
  { title: 'Billing', key: 'nav/billing', isLeaf: true },
];

const folderAccessTreeData: TreeDataNode[] = [
  {
    title: 'Finance',
    key: 'perm/finance',
    children: [
      { title: 'Invoices', key: 'perm/finance/invoices', isLeaf: true },
      { title: 'Budgets', key: 'perm/finance/budgets', isLeaf: true },
      { title: 'Payroll', key: 'perm/finance/payroll', isLeaf: true },
    ],
  },
  { title: 'HR', key: 'perm/hr', isLeaf: true },
  { title: 'Engineering', key: 'perm/engineering', isLeaf: true },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [navExpandedKeys, setNavExpandedKeys] = useState<React.Key[]>([]);
  const [navSelectedKeys, setNavSelectedKeys] = useState<React.Key[]>(['nav/dashboard']);
  
  const [folderExpandedKeys, setFolderExpandedKeys] = useState<React.Key[]>([]);
  const [folderSelectedKeys, setFolderSelectedKeys] = useState<React.Key[]>([]);
  
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && folderSelectedKeys.length === 1 && folderSelectedKeys[0] === 'perm/finance/invoices') {
      successFired.current = true;
      onSuccess();
    }
  }, [folderSelectedKeys, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 24, width: 700 }}>
      {/* Left: Navigation */}
      <Card title="Navigation" style={{ width: 200 }} data-testid="navigation-tree">
        <Tree
          treeData={navigationTreeData}
          expandedKeys={navExpandedKeys}
          onExpand={(keys) => setNavExpandedKeys(keys)}
          selectedKeys={navSelectedKeys}
          onSelect={(keys) => setNavSelectedKeys(keys)}
          selectable={true}
          checkable={false}
        />
      </Card>

      {/* Right: Folder access (TARGET) */}
      <Card title="Folder access" style={{ flex: 1 }} data-testid="folder-access-tree">
        <Tree
          treeData={folderAccessTreeData}
          expandedKeys={folderExpandedKeys}
          onExpand={(keys) => setFolderExpandedKeys(keys)}
          selectedKeys={folderSelectedKeys}
          onSelect={(keys) => setFolderSelectedKeys(keys)}
          selectable={true}
          checkable={false}
        />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Select folders to configure access permissions for team members.
          </Text>
          <Button disabled>Save changes</Button>
        </div>
      </Card>
    </div>
  );
}
