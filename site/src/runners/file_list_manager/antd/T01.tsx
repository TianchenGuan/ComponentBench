'use client';

/**
 * file_list_manager-antd-T01: Remove an outdated draft attachment
 *
 * setup_description: The page shows a single centered card titled "Project attachments" (isolated_card layout).
 * Inside the card is an Ant Design-styled file list manager rendered like an Upload file list in a compact
 * table: columns include File name, Type, Size, and Actions. The list is pre-populated with 5 files:
 * "contract-signed.pdf", "draft-proposal.docx", "receipt.png", "invoice-feb.pdf", and "notes.txt".
 * Each row has an Actions cell with icon buttons (tooltip on hover): Rename, Download (disabled), and
 * Remove (trash). Remove deletes immediately (no confirmation) and a small toast "Removed" appears.
 *
 * Success: "draft-proposal.docx" is not present anywhere in the Attachments list. All other files remain present.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'draft-proposal.docx', type: 'DOCX', size: 128000 },
  { id: 'f3', name: 'receipt.png', type: 'PNG', size: 89000 },
  { id: 'f4', name: 'invoice-feb.pdf', type: 'PDF', size: 156000 },
  { id: 'f5', name: 'notes.txt', type: 'TXT', size: 4500 },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const draftExists = files.some((f) => f.name === 'draft-proposal.docx');
    const othersExist =
      files.some((f) => f.name === 'contract-signed.pdf') &&
      files.some((f) => f.name === 'receipt.png') &&
      files.some((f) => f.name === 'invoice-feb.pdf') &&
      files.some((f) => f.name === 'notes.txt');

    if (!draftExists && othersExist) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleRemove = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    message.success('Removed');
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
      width: 120,
      render: (_: unknown, record: FileItem) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="Rename">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              data-testid="flm-action-rename"
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              disabled
            />
          </Tooltip>
          <Tooltip title="Remove">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              data-testid="flm-action-remove"
              onClick={() => handleRemove(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card title="Project attachments" style={{ width: 600 }} data-testid="flm-root">
      <div data-testid="flm-Attachments">
        <Button disabled style={{ marginBottom: 16 }}>
          Add files
        </Button>
        <Table
          dataSource={files}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
        />
      </div>
    </Card>
  );
}
