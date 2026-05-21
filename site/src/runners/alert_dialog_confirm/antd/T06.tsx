'use client';

/**
 * alert_dialog_confirm-antd-T06: Delete the correct table row (Popconfirm in table)
 *
 * Table-cell layout: the page is a simple "Projects" table shown in a centered container (no scrolling needed). The table has three rows: "Alpha", "Beta", and "Gamma".
 *
 * Each row has an "Actions" column with two buttons:
 * - "Edit" (does nothing for this benchmark)
 * - "Delete" (trash icon + text)
 *
 * Clicking a row's "Delete" opens an Ant Design Popconfirm bubble anchored to that row's delete button. The Popconfirm title includes the project name, e.g., "Delete Gamma?" and the description reads "This cannot be undone."
 *
 * The Popconfirm has compact buttons "Cancel" and "OK". Only one Popconfirm can be open at a time.
 */

import React, { useRef } from 'react';
import { Card, Table, Button, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

interface Project {
  key: string;
  name: string;
}

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleConfirm = (projectName: string) => {
    const instanceId = `delete_project_${projectName.toLowerCase()}`;
    
    if (projectName === 'Gamma' && !successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: instanceId,
      };
      message.info('Action recorded');
      onSuccess();
    } else {
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: instanceId,
      };
      message.info('Action recorded');
    }
  };

  const handleCancel = (projectName: string) => {
    const instanceId = `delete_project_${projectName.toLowerCase()}`;
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: instanceId,
    };
  };

  const projects: Project[] = [
    { key: '1', name: 'Alpha' },
    { key: '2', name: 'Beta' },
    { key: '3', name: 'Gamma' },
  ];

  const columns = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>
            Edit
          </Button>
          <Popconfirm
            title={`Delete ${record.name}?`}
            description="This cannot be undone."
            onConfirm={() => handleConfirm(record.name)}
            onCancel={() => handleCancel(record.name)}
            okText="OK"
            cancelText="Cancel"
            okButtonProps={{ 'data-testid': 'cb-confirm' } as any}
            cancelButtonProps={{ 'data-testid': 'cb-cancel' } as any}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              data-testid={`cb-delete-${record.name.toLowerCase()}`}
              data-cb-instance={record.name}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Projects" style={{ width: 500 }}>
      <Table
        dataSource={projects}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
