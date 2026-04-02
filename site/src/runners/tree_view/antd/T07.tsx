'use client';

/**
 * tree_view-antd-T07: Scroll to and select Event 47 (virtualized)
 *
 * Layout: isolated_card placed near the bottom-left of the viewport. Header: "Audit Events".
 * Single Ant Design Tree configured with a fixed height (virtual scroll enabled) so only ~10 items
 * are visible at once; a scrollbar appears inside the tree area.
 *
 * Tree content: one root node "All events" (already expanded) containing 60 leaf nodes named
 * "Event 01" … "Event 60". The target is "Event 47".
 *
 * Density: compact spacing mode is enabled in the page (smaller row height), and the tree is rendered
 * at small scale. Initial state: "Event 01" is selected by default; "Event 47" is not initially visible
 * without scrolling.
 *
 * Success: The selected node id equals 'audit/event-47'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';

// Generate 60 event nodes
const eventNodes: TreeDataNode[] = Array.from({ length: 60 }, (_, i) => ({
  title: `Event ${String(i + 1).padStart(2, '0')}`,
  key: `audit/event-${String(i + 1).padStart(2, '0')}`,
  isLeaf: true,
}));

const treeData: TreeDataNode[] = [
  {
    title: 'All events',
    key: 'audit/all',
    children: eventNodes,
  },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['audit/all']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['audit/event-01']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && selectedKeys.length === 1 && selectedKeys[0] === 'audit/event-47') {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card title="Audit Events" style={{ width: 350 }} data-testid="tree-card">
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        selectedKeys={selectedKeys}
        onSelect={(keys) => setSelectedKeys(keys)}
        height={250}
        selectable={true}
        checkable={false}
        data-testid="tree-root"
        style={{ fontSize: 12 }}
      />
    </Card>
  );
}
