'use client';

/**
 * tree_view-antd-T10: Match reference: expand folders and select wireframes
 *
 * Layout: isolated_card positioned near the top-right of the viewport. Dark theme is enabled.
 * The card is split into two columns:
 * • Left: an AntD DirectoryTree titled "Design Assets" (directory-style tree with folder/file icons).
 * • Right: a visual "Reference" panel showing a breadcrumb-style path with folder/file icons.
 *
 * Tree structure (left):
 * Projects (id=projects)
 *   Alpha (id=projects/alpha)
 *     Design (id=projects/alpha/design)
 *       wireframes.fig (id=projects/alpha/design/wireframes)
 *       logo.svg (id=projects/alpha/design/logo)
 *     Specs (id=projects/alpha/specs)
 *   Beta (id=projects/beta)
 * Archive (id=archive)
 *
 * Initial state: all nodes are collapsed and no selection is active. Spacing is compact.
 * The reference panel shows the path Projects → Alpha → Design → wireframes.fig.
 *
 * Success: 
 * - Expanded nodes equal exactly {projects, projects/alpha, projects/alpha/design}.
 * - Selected node id equals 'projects/alpha/design/wireframes'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Typography, Space } from 'antd';
import { FolderOutlined, FileOutlined, RightOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;
const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
  {
    title: 'Projects',
    key: 'projects',
    children: [
      {
        title: 'Alpha',
        key: 'projects/alpha',
        children: [
          {
            title: 'Design',
            key: 'projects/alpha/design',
            children: [
              { title: 'wireframes.fig', key: 'projects/alpha/design/wireframes', isLeaf: true },
              { title: 'logo.svg', key: 'projects/alpha/design/logo', isLeaf: true },
            ],
          },
          {
            title: 'Specs',
            key: 'projects/alpha/specs',
            children: [
              { title: 'requirements.md', key: 'projects/alpha/specs/requirements', isLeaf: true },
            ],
          },
        ],
      },
      {
        title: 'Beta',
        key: 'projects/beta',
        children: [
          { title: 'README.md', key: 'projects/beta/readme', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: 'Archive',
    key: 'archive',
    children: [
      { title: 'old-files.zip', key: 'archive/old-files', isLeaf: true },
    ],
  },
];

const targetExpandedKeys = ['projects', 'projects/alpha', 'projects/alpha/design'];
const targetSelectedKey = 'projects/alpha/design/wireframes';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    const expandedMatch = setsEqual(expandedKeys as string[], targetExpandedKeys);
    const selectedMatch = selectedKeys.length === 1 && selectedKeys[0] === targetSelectedKey;
    
    if (!successFired.current && expandedMatch && selectedMatch) {
      successFired.current = true;
      onSuccess();
    }
  }, [expandedKeys, selectedKeys, onSuccess]);

  return (
    <Card style={{ width: 600 }} data-testid="tree-card">
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left: Directory Tree */}
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Design Assets</Text>
          <DirectoryTree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys)}
            selectedKeys={selectedKeys}
            onSelect={(keys) => setSelectedKeys(keys)}
            data-testid="tree-root"
            style={{ fontSize: 12 }}
          />
        </div>
        
        {/* Right: Reference panel */}
        <div style={{ flex: 1, padding: 16, background: 'rgba(0,0,0,0.1)', borderRadius: 8 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Reference</Text>
          <Space direction="vertical" size={4}>
            <Space size={4}>
              <FolderOutlined />
              <Text>Projects</Text>
              <RightOutlined style={{ fontSize: 10 }} />
            </Space>
            <Space size={4} style={{ paddingLeft: 16 }}>
              <FolderOutlined />
              <Text>Alpha</Text>
              <RightOutlined style={{ fontSize: 10 }} />
            </Space>
            <Space size={4} style={{ paddingLeft: 32 }}>
              <FolderOutlined />
              <Text>Design</Text>
              <RightOutlined style={{ fontSize: 10 }} />
            </Space>
            <Space size={4} style={{ paddingLeft: 48 }}>
              <FileOutlined />
              <Text strong style={{ color: '#1677ff' }}>wireframes.fig</Text>
            </Space>
          </Space>
        </div>
      </div>
    </Card>
  );
}
