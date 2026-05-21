'use client';

/**
 * tree_view-antd-v2-T02: DirectoryTree move dialog — match reference path and confirm
 *
 * Dark modal_flow. Background shows file list. "Move file" opens a modal with a DirectoryTree
 * (left) and a destination preview card (right) showing "Documents / Company / Contracts".
 * Tree: Documents → {Company → {Contracts [target], Finance}, Personal}, Archive → {2025}
 * Initial: all collapsed, nothing selected.
 * Success: selected = documents/company/contracts,
 *          expanded = exactly {documents, documents/company}, "Move here" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Button, Modal, Typography, Space, Table, Tag } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const treeData: TreeDataNode[] = [
  {
    title: 'Documents',
    key: 'documents',
    icon: <FolderOutlined />,
    children: [
      {
        title: 'Company',
        key: 'documents/company',
        icon: <FolderOutlined />,
        children: [
          { title: 'Contracts', key: 'documents/company/contracts', icon: <FolderOutlined />, isLeaf: true },
          { title: 'Finance', key: 'documents/company/finance', icon: <FolderOutlined />, isLeaf: true },
        ],
      },
      { title: 'Personal', key: 'documents/personal', icon: <FolderOutlined />, isLeaf: true },
    ],
  },
  {
    title: 'Archive',
    key: 'archive',
    icon: <FolderOutlined />,
    children: [
      { title: '2025', key: 'archive/2025', icon: <FolderOutlined />, isLeaf: true },
    ],
  },
];

const REQUIRED_EXPANDED = ['documents', 'documents/company'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      selectedKeys.length === 1 &&
      selectedKeys[0] === 'documents/company/contracts' &&
      setsEqual(expandedKeys as string[], REQUIRED_EXPANDED)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedKeys, expandedKeys, onSuccess]);

  const handleMove = () => {
    setCommitted(true);
    setModalOpen(false);
  };

  const fakeFiles = [
    { key: '1', name: 'report.pdf', size: '2.1 MB', modified: '2026-03-10' },
    { key: '2', name: 'notes.txt', size: '14 KB', modified: '2026-03-18' },
  ];

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <Title level={4}><FileOutlined /> Files</Title>
      <Space style={{ marginBottom: 12 }}>
        <Button>Upload</Button>
        <Button type="primary" onClick={() => setModalOpen(true)}>Move file</Button>
      </Space>
      <Table dataSource={fakeFiles} size="small" pagination={false}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Size', dataIndex: 'size' },
          { title: 'Modified', dataIndex: 'modified' },
        ]}
      />

      <Modal
        title="Move file"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={560}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleMove}>Move here</Button>
          </Space>
        }
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Tree.DirectoryTree
              treeData={treeData}
              expandedKeys={expandedKeys}
              onExpand={(keys) => { setExpandedKeys(keys); setCommitted(false); }}
              selectedKeys={selectedKeys}
              onSelect={(keys) => { setSelectedKeys(keys); setCommitted(false); }}
              data-testid="tree-root"
            />
          </div>
          <Card size="small" style={{ width: 200 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>Destination preview</Text>
            <div style={{ marginTop: 8 }}>
              <Tag>Documents</Tag> / <Tag>Company</Tag> / <Tag color="blue">Contracts</Tag>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
}
