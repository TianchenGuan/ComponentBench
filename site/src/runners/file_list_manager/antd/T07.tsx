'use client';

/**
 * file_list_manager-antd-T07: Move a file into the correct folder (two managers on page)
 *
 * setup_description: The page contains two file list managers (instances=2) stacked in one centered card:
 * "Client uploads" (top) and "Internal notes" (bottom). They look similar. Each manager is an AntD table with
 * columns: File name, Folder, and Actions. The Folder column is editable via a dropdown selector in each row
 * (options: Unsorted, ID Photos, Contracts, Receipts). In "Client uploads", the file "passport.jpg" currently
 * has Folder = Unsorted. "Internal notes" contains a different file also named "passport.jpg" as a distractor.
 *
 * Success: In the "Client uploads" manager, "passport.jpg" has Folder set to "ID Photos".
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Typography, Divider } from 'antd';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const { Title } = Typography;

interface FileWithFolder extends FileItem {
  folder: string;
}

const clientFiles: FileWithFolder[] = [
  { id: 'c1', name: 'passport.jpg', type: 'JPG', size: 245000, folder: 'Unsorted' },
  { id: 'c2', name: 'license.jpg', type: 'JPG', size: 198000, folder: 'ID Photos' },
  { id: 'c3', name: 'contract.pdf', type: 'PDF', size: 312000, folder: 'Contracts' },
  { id: 'c4', name: 'invoice.pdf', type: 'PDF', size: 156000, folder: 'Receipts' },
];

const internalFiles: FileWithFolder[] = [
  { id: 'i1', name: 'passport.jpg', type: 'JPG', size: 189000, folder: 'Unsorted' },
  { id: 'i2', name: 'notes.txt', type: 'TXT', size: 4500, folder: 'Unsorted' },
  { id: 'i3', name: 'memo.docx', type: 'DOCX', size: 67000, folder: 'Contracts' },
];

const folderOptions = ['Unsorted', 'ID Photos', 'Contracts', 'Receipts'];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [clientData, setClientData] = useState<FileWithFolder[]>(clientFiles);
  const [internalData, setInternalData] = useState<FileWithFolder[]>(internalFiles);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const passportFile = clientData.find((f) => f.id === 'c1');
    if (passportFile && passportFile.folder === 'ID Photos') {
      setCompleted(true);
      onSuccess();
    }
  }, [clientData, completed, onSuccess]);

  const handleClientFolderChange = (fileId: string, folder: string) => {
    setClientData((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, folder } : f))
    );
  };

  const handleInternalFolderChange = (fileId: string, folder: string) => {
    setInternalData((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, folder } : f))
    );
  };

  const getColumns = (onFolderChange: (fileId: string, folder: string) => void) => [
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Folder',
      key: 'folder',
      width: 150,
      render: (_: unknown, record: FileWithFolder) => (
        <Select
          value={record.folder}
          onChange={(value) => onFolderChange(record.id, value)}
          style={{ width: 120 }}
          size="small"
          data-testid={`flm-folder-${record.id}`}
        >
          {folderOptions.map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      ),
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
    <Card style={{ width: 600 }} data-testid="flm-root">
      {/* Client uploads manager */}
      <Title level={5} data-testid="flm-Client-uploads-header">Client uploads</Title>
      <div data-testid="flm-Client uploads">
        <Table
          dataSource={clientData}
          columns={getColumns(handleClientFolderChange)}
          rowKey="id"
          size="small"
          pagination={false}
        />
      </div>

      <Divider />

      {/* Internal notes manager */}
      <Title level={5} data-testid="flm-Internal-notes-header">Internal notes</Title>
      <div data-testid="flm-Internal notes">
        <Table
          dataSource={internalData}
          columns={getColumns(handleInternalFolderChange)}
          rowKey="id"
          size="small"
          pagination={false}
        />
      </div>
    </Card>
  );
}
