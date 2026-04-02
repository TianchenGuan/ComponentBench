'use client';

/**
 * tree_view-antd-T03: Check README.md permission
 *
 * Layout: isolated_card centered, header "Repository Access".
 * Single Ant Design Tree configured with checkable=true (checkboxes appear before each node).
 * Tree represents a repository: root "src", "docs", and "README.md" (README is a root-level leaf).
 * "docs" has children "CONTRIBUTING.md" and "CHANGELOG.md".
 *
 * Initial state: no nodes are checked; no nodes are expanded; selection is empty.
 * Clicking a checkbox toggles check state; clicking a label selects a node but does not toggle the checkbox.
 *
 * Success: The node id 'repo/readme' is checked in the tree's checked state.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';

const treeData: TreeDataNode[] = [
  {
    title: 'src',
    key: 'repo/src',
    children: [
      { title: 'index.ts', key: 'repo/src/index', isLeaf: true },
      { title: 'utils.ts', key: 'repo/src/utils', isLeaf: true },
    ],
  },
  {
    title: 'docs',
    key: 'repo/docs',
    children: [
      { title: 'CONTRIBUTING.md', key: 'repo/docs/contributing', isLeaf: true },
      { title: 'CHANGELOG.md', key: 'repo/docs/changelog', isLeaf: true },
    ],
  },
  { title: 'README.md', key: 'repo/readme', isLeaf: true },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && checkedKeys.includes('repo/readme')) {
      successFired.current = true;
      onSuccess();
    }
  }, [checkedKeys, onSuccess]);

  return (
    <Card title="Repository Access" style={{ width: 400 }} data-testid="tree-card">
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        checkedKeys={checkedKeys}
        onCheck={(checked) => {
          const keys = Array.isArray(checked) ? checked : checked.checked;
          setCheckedKeys(keys);
        }}
        checkable={true}
        selectable={true}
        data-testid="tree-root"
      />
    </Card>
  );
}
