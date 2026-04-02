'use client';

/**
 * file_list_manager-antd-T03: Rename a receipt image for clarity
 *
 * setup_description: The Attachments manager is a table with 6 files. Each row has a Rename (pencil) icon.
 * Clicking Rename switches that row into edit mode: the File name cell becomes a text input prefilled with the
 * current name, and two buttons appear: "Save" and "Cancel". Only one row can be in edit mode at a time.
 * A small helper text under the input says "Name must be unique" (but the target name is unique).
 *
 * Success: The file previously named "receipt.png" now has the displayed name "lunch-receipt.png" in the
 * Attachments list. The rename is committed (no active edit mode remains).
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tooltip, Input, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
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

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const renamedFile = files.find((f) => f.id === 'f3');
    if (renamedFile && renamedFile.name === 'lunch-receipt.png' && editingId === null) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, editingId, completed, onSuccess]);

  const startEditing = (file: FileItem) => {
    setEditingId(file.id);
    setEditValue(file.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEditing = () => {
    if (editingId && editValue.trim()) {
      setFiles((prev) =>
        prev.map((f) => (f.id === editingId ? { ...f, name: editValue.trim() } : f))
      );
      setEditingId(null);
      setEditValue('');
    }
  };

  const columns = [
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: FileItem) => {
        if (editingId === record.id) {
          return (
            <div>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                size="small"
                style={{ width: 200 }}
                data-testid="flm-rename-input"
              />
              <Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 2 }}>
                Name must be unique
              </Text>
              <div style={{ marginTop: 4 }}>
                <Button size="small" type="primary" onClick={saveEditing} style={{ marginRight: 4 }}>
                  Save
                </Button>
                <Button size="small" onClick={cancelEditing}>
                  Cancel
                </Button>
              </div>
            </div>
          );
        }
        return name;
      },
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
      render: (_: unknown, record: FileItem) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="Rename">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              data-testid="flm-action-rename"
              onClick={() => startEditing(record)}
              disabled={editingId !== null}
            />
          </Tooltip>
          <Tooltip title="Remove">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </div>
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
