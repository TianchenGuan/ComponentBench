'use client';

/**
 * tree_view-antd-v2-T03: Remote files drawer — lazy-load quarter folder and choose forecast workbook
 *
 * Drawer flow. Base page shows attachments table and metadata. "Attach remote file" opens drawer
 * with AntD Tree using loadData. Expanding "Remote" reveals years immediately. Expanding "2026"
 * triggers loading spinner then shows Q1-Q4. Q3 contains target "Q3 Forecast.xlsx".
 * Success: selected = remote/2026/q3/forecast_xlsx, expanded contains {remote, remote/2026, remote/2026/q3},
 *          "Attach file" clicked.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Tree, Button, Drawer, Typography, Space, Table, Tag } from 'antd';
import { CloudOutlined, PaperClipOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const initialTreeData: TreeDataNode[] = [
  {
    title: 'Remote',
    key: 'remote',
    children: [
      { title: '2025', key: 'remote/2025', isLeaf: true },
      { title: '2026', key: 'remote/2026', isLeaf: false },
    ],
  },
];

function makeQuarterChildren(quarter: string): TreeDataNode[] {
  const q = quarter.toUpperCase();
  const prefix = `remote/2026/${quarter}`;
  if (quarter === 'q3') {
    return [
      { title: `${q} Forecast.xlsx`, key: `${prefix}/forecast_xlsx`, isLeaf: true },
      { title: `${q} Notes.md`, key: `${prefix}/notes_md`, isLeaf: true },
      { title: `${q} Budget.csv`, key: `${prefix}/budget_csv`, isLeaf: true },
    ];
  }
  return [{ title: `${q} Data.xlsx`, key: `${prefix}/data_xlsx`, isLeaf: true }];
}

const quarterNodes: TreeDataNode[] = ['q1', 'q2', 'q3', 'q4'].map((q) => ({
  title: q.toUpperCase(),
  key: `remote/2026/${q}`,
  isLeaf: false,
  children: makeQuarterChildren(q),
}));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [treeData, setTreeData] = useState<TreeDataNode[]>(initialTreeData);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<React.Key[]>([]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      selectedKeys.length === 1 &&
      selectedKeys[0] === 'remote/2026/q3/forecast_xlsx' &&
      (expandedKeys as string[]).includes('remote') &&
      (expandedKeys as string[]).includes('remote/2026') &&
      (expandedKeys as string[]).includes('remote/2026/q3')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedKeys, expandedKeys, onSuccess]);

  const onLoadData = useCallback(
    (node: TreeDataNode): Promise<void> =>
      new Promise((resolve) => {
        if (node.key === 'remote/2026' && !loadedKeys.includes('remote/2026')) {
          setTimeout(() => {
            setTreeData((prev) => {
              const update = (nodes: TreeDataNode[]): TreeDataNode[] =>
                nodes.map((n) => {
                  if (n.key === 'remote/2026') return { ...n, children: quarterNodes };
                  if (n.children) return { ...n, children: update(n.children) };
                  return n;
                });
              return update(prev);
            });
            setLoadedKeys((prev) => [...prev, 'remote/2026']);
            resolve();
          }, 600);
        } else {
          resolve();
        }
      }),
    [loadedKeys],
  );

  const handleAttach = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  const attachments = [
    { key: '1', file: 'budget_2025.csv', status: 'Uploaded' },
    { key: '2', file: 'overview.pdf', status: 'Pending' },
  ];

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <Title level={4}><PaperClipOutlined /> Attachments</Title>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Space><Text>Project</Text><Tag>Alpha</Tag><Text>Region</Text><Tag>US-East</Tag></Space>
      </Card>

      <Table dataSource={attachments} size="small" pagination={false} style={{ marginBottom: 12 }}
        columns={[
          { title: 'File', dataIndex: 'file' },
          { title: 'Status', dataIndex: 'status' },
        ]}
      />

      <Button icon={<CloudOutlined />} onClick={() => setDrawerOpen(true)}>Attach remote file</Button>

      <Drawer
        title="Remote file tree"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleAttach}>Attach file</Button>
          </Space>
        }
      >
        <Tree
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={(keys) => { setExpandedKeys(keys); setCommitted(false); }}
          selectedKeys={selectedKeys}
          onSelect={(keys) => { setSelectedKeys(keys); setCommitted(false); }}
          loadData={onLoadData}
          loadedKeys={loadedKeys}
          selectable
          data-testid="tree-root"
        />
      </Drawer>
    </div>
  );
}
