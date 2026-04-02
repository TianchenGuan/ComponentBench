'use client';

/**
 * file_list_manager-antd-T08: Reorder files by dragging in compact mode
 *
 * setup_description: A single Attachments manager is shown in an isolated card, but rendered in compact spacing
 * with small scale: rows are short, text is smaller, and the drag handle is a small grip icon at the far left
 * of each row. The list contains 8 files in this initial order: agenda.pdf, budget.xlsx, final-checklist.pdf,
 * hotel-confirmation.pdf, map.png, minutes.docx, packing-list.txt, team-photo.jpg. Reordering is done by
 * dragging the grip handle.
 *
 * Success: "final-checklist.pdf" is the first item in the Attachments list. All other files remain present
 * and keep their relative order after the move.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'agenda.pdf', type: 'PDF', size: 45000 },
  { id: 'f2', name: 'budget.xlsx', type: 'XLSX', size: 128000 },
  { id: 'f3', name: 'final-checklist.pdf', type: 'PDF', size: 89000 },
  { id: 'f4', name: 'hotel-confirmation.pdf', type: 'PDF', size: 156000 },
  { id: 'f5', name: 'map.png', type: 'PNG', size: 234000 },
  { id: 'f6', name: 'minutes.docx', type: 'DOCX', size: 67000 },
  { id: 'f7', name: 'packing-list.txt', type: 'TXT', size: 2300 },
  { id: 'f8', name: 'team-photo.jpg', type: 'JPG', size: 512000 },
];

const expectedOrder = [
  'final-checklist.pdf',
  'agenda.pdf',
  'budget.xlsx',
  'hotel-confirmation.pdf',
  'map.png',
  'minutes.docx',
  'packing-list.txt',
  'team-photo.jpg',
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const currentOrder = files.map((f) => f.name);
    const isCorrect = expectedOrder.every((name, i) => currentOrder[i] === name);

    if (isCorrect) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...files];
    const [draggedItem] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedItem);
    setFiles(newFiles);
    setDraggedIndex(index);
  }, [draggedIndex, files]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const columns = [
    {
      title: '',
      key: 'drag',
      width: 30,
      render: (_: unknown, __: FileItem, index: number) => (
        <div
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{ cursor: 'grab', padding: '2px 4px' }}
          aria-label="Reorder"
          data-testid={`flm-drag-handle-${index}`}
        >
          <HolderOutlined style={{ fontSize: 10, color: '#999' }} />
        </div>
      ),
    },
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span style={{ fontSize: 12 }}>{name}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 60,
      render: (type: string) => <span style={{ fontSize: 11 }}>{type}</span>,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 70,
      render: (size: number) => <span style={{ fontSize: 11 }}>{formatFileSize(size)}</span>,
    },
  ];

  return (
    <Card
      title="Attachments"
      style={{ width: 450 }}
      bodyStyle={{ padding: 12 }}
      data-testid="flm-root"
    >
      <div data-testid="flm-Attachments">
        <Table
          dataSource={files}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
          rowClassName={() => 'compact-row'}
        />
      </div>
      <style jsx global>{`
        .compact-row td {
          padding: 4px 8px !important;
          font-size: 12px;
        }
      `}</style>
    </Card>
  );
}
