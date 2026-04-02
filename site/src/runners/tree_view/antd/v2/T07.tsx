'use client';

/**
 * tree_view-antd-v2-T07: Reference preview — open exact folder path and select wireframes
 *
 * Dark dashboard panel. Left side: reference preview card showing breadcrumb
 * "Projects → Alpha → Design → wireframes.fig". Right side: AntD DirectoryTree titled "Design assets".
 * Tree: Projects→{Alpha→{Design→{wireframes.fig[target], logo.svg}, Specs}, Beta}, Archive.
 * Initial: all collapsed, nothing selected.
 * Success: selected = projects/alpha/design/wireframes,
 *          expanded = exactly {projects, projects/alpha, projects/alpha/design}, "Use selection" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Button, Typography, Tag, Space } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const treeData: TreeDataNode[] = [
  {
    title: 'Projects', key: 'projects', icon: <FolderOutlined />,
    children: [
      {
        title: 'Alpha', key: 'projects/alpha', icon: <FolderOutlined />,
        children: [
          {
            title: 'Design', key: 'projects/alpha/design', icon: <FolderOutlined />,
            children: [
              { title: 'wireframes.fig', key: 'projects/alpha/design/wireframes', isLeaf: true },
              { title: 'logo.svg', key: 'projects/alpha/design/logo', isLeaf: true },
            ],
          },
          { title: 'Specs', key: 'projects/alpha/specs', icon: <FolderOutlined />, isLeaf: true },
        ],
      },
      { title: 'Beta', key: 'projects/beta', icon: <FolderOutlined />, isLeaf: true },
    ],
  },
  { title: 'Archive', key: 'archive', icon: <FolderOutlined />, isLeaf: true },
];

const REQUIRED_EXPANDED = ['projects', 'projects/alpha', 'projects/alpha/design'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      selectedKeys.length === 1 &&
      selectedKeys[0] === 'projects/alpha/design/wireframes' &&
      setsEqual(expandedKeys as string[], REQUIRED_EXPANDED)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedKeys, expandedKeys, onSuccess]);

  const handleUse = () => setCommitted(true);

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <Title level={4}>Asset Browser</Title>

      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <Card size="small" style={{ width: 220 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Reference preview</Text>
          <div style={{ marginTop: 10 }}>
            <Space size={4} wrap>
              <Tag>Projects</Tag><Text type="secondary">→</Text>
              <Tag>Alpha</Tag><Text type="secondary">→</Text>
              <Tag>Design</Tag><Text type="secondary">→</Text>
              <Tag color="blue">wireframes.fig</Tag>
            </Space>
          </div>
        </Card>

        <Card title="Design assets" size="small" style={{ flex: 1 }}>
          <Tree.DirectoryTree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => { setExpandedKeys(keys); setCommitted(false); }}
            selectedKeys={selectedKeys}
            onSelect={(keys) => { setSelectedKeys(keys); setCommitted(false); }}
            data-testid="tree-root"
          />
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <Button type="primary" size="small" onClick={handleUse}>Use selection</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
