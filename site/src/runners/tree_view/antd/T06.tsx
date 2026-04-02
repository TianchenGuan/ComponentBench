'use client';

/**
 * tree_view-antd-T06: Search and select Q4 Summary
 *
 * Layout: isolated_card centered, titled "Reports". At the top of the card there is a small search input
 * labeled "Search reports" (placeholder: "Type to filter…"). Below it is a single Ant Design Tree with
 * many report nodes grouped by year and quarter.
 *
 * Tree structure (partial):
 * • "2025" → "Q1" → "Q1 Summary.pdf", …
 * • "2025" → "Q4" → "Q4 Summary.pdf" (TARGET leaf)
 * • "2024" → "Q4" → "Q4 Summary.pdf" (distractor with same filename but different year)
 *
 * Behavior: typing in the search input filters/highlights matching titles and auto-expands parent nodes.
 * Initial state: the tree is fully collapsed; no node is selected; search input is empty.
 *
 * Success: The selected node id equals 'reports/2025/q4/summary' (the 2025 Q4 Summary).
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Tree, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';

const treeData: TreeDataNode[] = [
  {
    title: '2025',
    key: 'reports/2025',
    children: [
      {
        title: 'Q1',
        key: 'reports/2025/q1',
        children: [
          { title: 'Q1 Summary.pdf', key: 'reports/2025/q1/summary', isLeaf: true },
          { title: 'Q1 Details.pdf', key: 'reports/2025/q1/details', isLeaf: true },
        ],
      },
      {
        title: 'Q2',
        key: 'reports/2025/q2',
        children: [
          { title: 'Q2 Summary.pdf', key: 'reports/2025/q2/summary', isLeaf: true },
        ],
      },
      {
        title: 'Q3',
        key: 'reports/2025/q3',
        children: [
          { title: 'Q3 Summary.pdf', key: 'reports/2025/q3/summary', isLeaf: true },
        ],
      },
      {
        title: 'Q4',
        key: 'reports/2025/q4',
        children: [
          { title: 'Q4 Summary.pdf', key: 'reports/2025/q4/summary', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: '2024',
    key: 'reports/2024',
    children: [
      {
        title: 'Q4',
        key: 'reports/2024/q4',
        children: [
          { title: 'Q4 Summary.pdf', key: 'reports/2024/q4/summary', isLeaf: true },
        ],
      },
    ],
  },
];

// Helper to get all parent keys of nodes matching search
function getParentKeys(key: string, tree: TreeDataNode[]): string[] {
  const parts = key.split('/');
  const parents: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    parents.push(parts.slice(0, i).join('/'));
  }
  return parents;
}

// Helper to find all keys matching search term
function findMatchingKeys(nodes: TreeDataNode[], searchValue: string): string[] {
  const matches: string[] = [];
  const search = searchValue.toLowerCase();
  
  function traverse(node: TreeDataNode) {
    if (String(node.title).toLowerCase().includes(search)) {
      matches.push(node.key as string);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  nodes.forEach(traverse);
  return matches;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const successFired = useRef(false);

  // Auto-expand when searching
  useEffect(() => {
    if (searchValue) {
      const matchingKeys = findMatchingKeys(treeData, searchValue);
      const parentKeys = new Set<string>();
      matchingKeys.forEach(key => {
        getParentKeys(key, treeData).forEach(pk => parentKeys.add(pk));
      });
      setExpandedKeys(Array.from(parentKeys));
      setAutoExpandParent(true);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!successFired.current && selectedKeys.length === 1 && selectedKeys[0] === 'reports/2025/q4/summary') {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  // Highlight matching text
  const renderTreeNodes = useMemo(() => {
    const search = searchValue.toLowerCase();
    
    function renderNode(node: TreeDataNode): TreeDataNode {
      const title = String(node.title);
      const index = title.toLowerCase().indexOf(search);
      
      let titleNode: React.ReactNode = title;
      if (search && index > -1) {
        const beforeStr = title.substring(0, index);
        const matchStr = title.substring(index, index + search.length);
        const afterStr = title.substring(index + search.length);
        titleNode = (
          <span>
            {beforeStr}
            <span style={{ color: '#f50', fontWeight: 'bold' }}>{matchStr}</span>
            {afterStr}
          </span>
        );
      }
      
      return {
        ...node,
        title: titleNode,
        children: node.children?.map(renderNode),
      };
    }
    
    return treeData.map(renderNode);
  }, [searchValue]);

  return (
    <Card title="Reports" style={{ width: 450 }} data-testid="tree-card">
      <Input
        placeholder="Type to filter…"
        prefix={<SearchOutlined />}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ marginBottom: 16 }}
        data-testid="search-input"
      />
      <Tree
        treeData={renderTreeNodes}
        expandedKeys={expandedKeys}
        onExpand={(keys) => {
          setExpandedKeys(keys);
          setAutoExpandParent(false);
        }}
        selectedKeys={selectedKeys}
        onSelect={(keys) => setSelectedKeys(keys)}
        autoExpandParent={autoExpandParent}
        selectable={true}
        checkable={false}
        data-testid="tree-root"
      />
    </Card>
  );
}
