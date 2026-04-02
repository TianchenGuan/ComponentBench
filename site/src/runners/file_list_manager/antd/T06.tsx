'use client';

/**
 * file_list_manager-antd-T06: Filter and select a warranty document
 *
 * setup_description: A single Attachments manager is positioned near the top-right of the viewport (top_right
 * placement) within an isolated card. The manager contains a search field labeled "Search files" above the table.
 * Typing filters the visible rows by substring match on filename. The file list contains 14 items (some with
 * similar names like "warranty.pdf", "warranty-card.pdf", and "warranty-card-old.pdf"). Row selection is via
 * a checkbox column; selection persists even when the list is filtered. Initially, nothing is selected.
 *
 * Success: "warranty-card.pdf" is selected in the Attachments manager. No other files are selected.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'warranty.pdf', type: 'PDF', size: 128000 },
  { id: 'f3', name: 'warranty-card.pdf', type: 'PDF', size: 89000 },
  { id: 'f4', name: 'warranty-card-old.pdf', type: 'PDF', size: 156000 },
  { id: 'f5', name: 'invoice-jan.pdf', type: 'PDF', size: 4500 },
  { id: 'f6', name: 'invoice-feb.pdf', type: 'PDF', size: 198000 },
  { id: 'f7', name: 'receipt-001.png', type: 'PNG', size: 67000 },
  { id: 'f8', name: 'receipt-002.png', type: 'PNG', size: 72000 },
  { id: 'f9', name: 'manual.pdf', type: 'PDF', size: 512000 },
  { id: 'f10', name: 'guide.pdf', type: 'PDF', size: 234000 },
  { id: 'f11', name: 'terms.pdf', type: 'PDF', size: 145000 },
  { id: 'f12', name: 'policy.pdf', type: 'PDF', size: 98000 },
  { id: 'f13', name: 'report.docx', type: 'DOCX', size: 187000 },
  { id: 'f14', name: 'notes.txt', type: 'TXT', size: 3200 },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    if (
      selectedRowKeys.length === 1 &&
      selectedRowKeys[0] === 'f3' // warranty-card.pdf has id 'f3'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedRowKeys, completed, onSuccess]);

  const filteredFiles = useMemo(() => {
    if (!searchValue.trim()) return initialFiles;
    return initialFiles.filter((f) =>
      f.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

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
    <Card title="Attachments" style={{ width: 500 }} data-testid="flm-root">
      <div data-testid="flm-Attachments">
        <Input
          placeholder="Search files"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginBottom: 12 }}
          data-testid="flm-search"
        />
        <Table
          dataSource={filteredFiles}
          columns={columns}
          rowKey="id"
          rowSelection={rowSelection}
          size="small"
          pagination={false}
          scroll={{ y: 300 }}
        />
      </div>
    </Card>
  );
}
