'use client';

/**
 * tree_view-antd-T01: Expand Projects folder
 *
 * Layout: isolated_card centered on the page with a header "Project Files".
 * The card contains a single Ant Design Tree showing a small file hierarchy with root nodes:
 * "Projects", "Archive", and "Trash". Only "Projects" has children (e.g., "Alpha", "Beta").
 * The tree uses default AntD affordances: a small caret/switcher icon to the left of expandable nodes.
 *
 * Initial state: all root nodes are collapsed; no node is selected; no checkboxes are shown (checkable=false).
 *
 * Success: The Tree node with id 'projects' is in expanded state (its children are rendered/visible).
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
  { title: 'Archive', key: 'archive', isLeaf: true },
  { title: 'Trash', key: 'trash', isLeaf: true },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && expandedKeys.includes('projects')) {
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
