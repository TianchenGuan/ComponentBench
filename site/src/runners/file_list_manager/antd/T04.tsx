'use client';

/**
 * file_list_manager-antd-T04: Mark an invoice to keep
 *
 * setup_description: A single file list manager shows a "Keep" column with an on/off toggle per file. The list
 * includes 6 files and is not scrollable. "invoice-feb.pdf" currently has Keep = Off. Toggling Keep updates
 * immediately and shows a subtle check icon in the row for 1 second. Other files have mixed Keep states.
 *
 * Success: For "invoice-feb.pdf", the Keep flag is ON in the Attachments manager. No other file's Keep flag is changed.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Switch, message } from 'antd';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'PDF', size: 245000, keep: true },
  { id: 'f2', name: 'draft-proposal.docx', type: 'DOCX', size: 128000, keep: false },
  { id: 'f3', name: 'receipt.png', type: 'PNG', size: 89000, keep: true },
  { id: 'f4', name: 'invoice-feb.pdf', type: 'PDF', size: 156000, keep: false },
  { id: 'f5', name: 'notes.txt', type: 'TXT', size: 4500, keep: false },
  { id: 'f6', name: 'summary.pdf', type: 'PDF', size: 198000, keep: true },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const invoiceFile = files.find((f) => f.id === 'f4');
    if (invoiceFile && invoiceFile.keep === true) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleToggleKeep = (fileId: string, checked: boolean) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, keep: checked } : f))
    );
    if (checked) {
      message.success({ content: '✓', duration: 1 });
    }
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
      title: 'Keep',
      key: 'keep',
      width: 80,
      render: (_: unknown, record: FileItem) => (
        <Switch
          checked={record.keep}
          onChange={(checked) => handleToggleKeep(record.id, checked)}
          aria-checked={record.keep}
          data-testid={`flm-keep-${record.id}`}
        />
      ),
    },
  ];

  return (
    <Card title="Project attachments" style={{ width: 600 }} data-testid="flm-root">
      <div data-testid="flm-Attachments">
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
