'use client';

/**
 * tree_view-antd-T04: Collapse Archive folder
 *
 * Layout: isolated_card centered, header "Project Files".
 * Single Ant Design Tree with root nodes: "Projects", "Archive", "Trash".
 * "Archive" contains subfolders "2023" and "2024".
 *
 * Initial state: "Archive" is expanded by default (its children are visible). "Projects" is collapsed. No node is selected.
 * Configuration: selectable=true, checkable=false, default expand/collapse caret control.
 *
 * Success: The Tree node id 'archive' is not expanded (its children are not rendered/visible).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';

const treeData: TreeDataNode[] = [
  {
    title: 'Projects',
    key: 'projects',
    children: [
      { title: 'Alpha', key: 'projects/alpha', isLeaf: true },
      { title: 'Beta', key: 'projects/beta', isLeaf: true },
    ],
  },
  {
    title: 'Archive',
    key: 'archive',
    children: [
      { title: '2023', key: 'archive/2023', isLeaf: true },
      { title: '2024', key: 'archive/2024', isLeaf: true },
    ],
  },
  { title: 'Trash', key: 'trash', isLeaf: true },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['archive']);
  const successFired = useRef(false);
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the initial render since archive is expanded by default
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (!successFired.current && !expandedKeys.includes('archive')) {
      successFired.current = true;
      onSuccess();
    }
  }, [expandedKeys, onSuccess]);

  return (
    <Card title="Project Files" style={{ width: 400 }} data-testid="tree-card">
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        selectable={true}
        checkable={false}
        data-testid="tree-root"
      />
    </Card>
  );
}
