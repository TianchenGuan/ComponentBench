'use client';

/**
 * table_static-antd-T09: Open a modal and select a workspace
 *
 * The page uses a modal_flow: a primary button labeled "Switch workspace" opens an Ant Design Modal. Inside
 * the modal is a read-only Workspaces table (Ant Design Table) with columns: Name, Region, and Created. Rows are single-select;
 * clicking a row highlights it. The modal has Cancel/Close controls, but selection is immediate (no Apply step required
 * for this task). Theme is dark for the entire page and modal, but spacing and scale are default. Initial state: modal is
 * closed; no row is selected when the modal opens.
 */

import React, { useState } from 'react';
import { Table, Card, Button, Modal } from 'antd';
import type { TaskComponentProps } from '../types';

interface WorkspaceData {
  key: string;
  name: string;
  region: string;
  created: string;
}

const workspacesData: WorkspaceData[] = [
  { key: 'Analytics Sandbox', name: 'Analytics Sandbox', region: 'US East', created: 'Nov 15, 2024' },
  { key: 'Analytics Production', name: 'Analytics Production', region: 'US East', created: 'Oct 1, 2024' },
  { key: 'Marketing Dev', name: 'Marketing Dev', region: 'EU West', created: 'Dec 1, 2024' },
  { key: 'Engineering Test', name: 'Engineering Test', region: 'US West', created: 'Sep 20, 2024' },
  { key: 'Sales Demo', name: 'Sales Demo', region: 'AP South', created: 'Aug 5, 2024' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Region', dataIndex: 'region', key: 'region' },
  { title: 'Created', dataIndex: 'created', key: 'created' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedRowKey(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRowClick = (record: WorkspaceData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'Analytics Sandbox') {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Current workspace</div>
        <div style={{ color: '#888' }}>Engineering Test</div>
      </div>
      
      <Button type="primary" onClick={handleOpenModal}>
        Switch workspace
      </Button>

      <Modal
        title="Select Workspace"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
        ]}
        width={500}
      >
        <div style={{ marginBottom: 12 }}>Workspaces</div>
        <Table
          dataSource={workspacesData}
          columns={columns}
          pagination={false}
          size="middle"
          rowKey="key"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            'aria-selected': selectedRowKey === record.key,
            'data-row-key': record.key,
            style: {
              cursor: 'pointer',
              background: selectedRowKey === record.key ? '#177ddc' : undefined,
              color: selectedRowKey === record.key ? '#fff' : undefined,
            },
          })}
        />
      </Modal>
    </Card>
  );
}
