'use client';

/**
 * file_list_manager-antd-T02: Select the signed contract file
 *
 * setup_description: A centered "Project attachments" card contains one file list manager. The manager is a table
 * with a leading checkbox column for row selection and 6 preloaded files. No rows are selected initially.
 * Selecting a row checks its checkbox and highlights the row. A header counter reads "Selected: 0" and
 * updates live. Other row action icons (Rename/Remove) exist but are not needed.
 *
 * Success: Exactly one row is selected. The selected row corresponds to the file "contract-signed.pdf".
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tooltip, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const { Text } = Typography;

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'draft-proposal.docx', type: 'DOCX', size: 128000 },
  { id: 'f3', name: 'receipt.png', type: 'PNG', size: 89000 },
  { id: 'f4', name: 'invoice-feb.pdf', type: 'PDF', size: 156000 },
  { id: 'f5', name: 'notes.txt', type: 'TXT', size: 4500 },
  { id: 'f6', name: 'summary.pdf', type: 'PDF', size: 198000 },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    if (
      selectedRowKeys.length === 1 &&
      selectedRowKeys[0] === 'f1' // contract-signed.pdf has id 'f1'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedRowKeys, completed, onSuccess]);

  const rowSelection: TableRowSelection<FileItem> = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  const columns = [
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="Rename">
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Remove">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Project attachments"
      extra={<Text type="secondary">Selected: {selectedRowKeys.length}</Text>}
      style={{ width: 600 }}
      data-testid="flm-root"
    >
      <div data-testid="flm-Attachments">
        <Table
          dataSource={initialFiles}
          columns={columns}
          rowKey="id"
          rowSelection={rowSelection}
          size="small"
          pagination={false}
        />
      </div>
    </Card>
  );
}
