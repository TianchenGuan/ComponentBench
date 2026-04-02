'use client';

/**
 * file_list_manager-antd-T05: Bulk-remove two draft files in a form
 *
 * setup_description: The page is a "Submit report" form section (form_section layout) with several standard
 * inputs above (Title, Department, Notes) as low clutter. Below, an "Attachments" file list manager (AntD table)
 * contains 9 files with checkboxes and a toolbar. The toolbar includes "Remove selected" (disabled until ≥1 file
 * is selected) and "Select all". When "Remove selected" is clicked, a confirmation popover appears anchored to
 * the button with two actions: "Cancel" and "Confirm remove". Only after confirming are the files deleted.
 *
 * Success: Both "draft-v1.docx" and "draft-v2.docx" are absent from the Attachments list after confirmed bulk removal.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Popconfirm, Typography } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const { Text } = Typography;
const { TextArea } = Input;

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'draft-v1.docx', type: 'DOCX', size: 128000 },
  { id: 'f3', name: 'draft-v2.docx', type: 'DOCX', size: 135000 },
  { id: 'f4', name: 'receipt.png', type: 'PNG', size: 89000 },
  { id: 'f5', name: 'invoice-feb.pdf', type: 'PDF', size: 156000 },
  { id: 'f6', name: 'notes.txt', type: 'TXT', size: 4500 },
  { id: 'f7', name: 'summary.pdf', type: 'PDF', size: 198000 },
  { id: 'f8', name: 'report-final.pdf', type: 'PDF', size: 312000 },
  { id: 'f9', name: 'appendix.docx', type: 'DOCX', size: 87000 },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const draft1Exists = files.some((f) => f.name === 'draft-v1.docx');
    const draft2Exists = files.some((f) => f.name === 'draft-v2.docx');

    if (!draft1Exists && !draft2Exists) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleConfirmRemove = () => {
    setFiles((prev) => prev.filter((f) => !selectedRowKeys.includes(f.id)));
    setSelectedRowKeys([]);
  };

  const handleSelectAll = () => {
    setSelectedRowKeys(files.map((f) => f.id));
  };

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
  ];

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Form section header */}
      <Card title="Submit report" style={{ marginBottom: 0 }} data-testid="flm-root">
        <div style={{ marginBottom: 16 }}>
          <Text strong>Title</Text>
          <Input placeholder="Report title" style={{ marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Department</Text>
          <Input placeholder="Department" style={{ marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Notes</Text>
          <TextArea placeholder="Additional notes" rows={2} style={{ marginTop: 4 }} />
        </div>

        {/* Attachments section */}
        <div data-testid="flm-Attachments">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Popconfirm
              title="Remove selected files?"
              okText="Confirm remove"
              cancelText="Cancel"
              onConfirm={handleConfirmRemove}
              disabled={selectedRowKeys.length === 0}
              data-testid="flm-remove-popover"
            >
              <Button
                danger
                disabled={selectedRowKeys.length === 0}
                data-testid="flm-remove-selected"
              >
                Remove selected
              </Button>
            </Popconfirm>
            <Button onClick={handleSelectAll}>Select all</Button>
          </div>
          <Table
            dataSource={files}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            size="small"
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
