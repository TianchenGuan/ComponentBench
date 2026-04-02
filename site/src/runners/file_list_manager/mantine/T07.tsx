'use client';

/**
 * file_list_manager-mantine-T07: Precisely reorder markdown files in compact small mode
 *
 * setup_description: The Attachments manager is an isolated centered card rendered with compact spacing and
 * small scale (tight rows, smaller text). A small drag handle (grip) appears at the left of each row; dragging
 * reorders rows immediately. Initial order is: README.md, design.png, build.zip, release-notes.md, changelog.md,
 * license.txt. The goal is to place "release-notes.md" directly after "README.md" (as the second row).
 *
 * Success: The Attachments list order is: README.md, release-notes.md, design.png, build.zip, changelog.md, license.txt.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Text } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'README.md', type: 'MD', size: 12000 },
  { id: 'f2', name: 'design.png', type: 'PNG', size: 234000 },
  { id: 'f3', name: 'build.zip', type: 'ZIP', size: 567000 },
  { id: 'f4', name: 'release-notes.md', type: 'MD', size: 8900 },
  { id: 'f5', name: 'changelog.md', type: 'MD', size: 15600 },
  { id: 'f6', name: 'license.txt', type: 'TXT', size: 2300 },
];

const expectedOrder = [
  'README.md',
  'release-notes.md',
  'design.png',
  'build.zip',
  'changelog.md',
  'license.txt',
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
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

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newFiles = [...files];
      const [draggedItem] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(index, 0, draggedItem);
      setFiles(newFiles);
      setDraggedIndex(index);
    },
    [draggedIndex, files]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const rows = files.map((file, index) => (
    <Table.Tr
      key={file.id}
      data-testid={`flm-row-${file.id}`}
      style={{
        backgroundColor: draggedIndex === index ? 'rgba(0,0,0,0.05)' : 'transparent',
      }}
    >
      <Table.Td style={{ width: 30, padding: '2px 4px' }}>
        <div
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{ cursor: 'grab' }}
          aria-label="Reorder"
          data-testid={`flm-drag-handle-${index}`}
        >
          <IconGripVertical size={12} color="#999" />
        </div>
      </Table.Td>
      <Table.Td style={{ padding: '2px 8px', fontSize: 11 }}>{file.name}</Table.Td>
      <Table.Td style={{ padding: '2px 8px', fontSize: 11 }}>{file.type}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder w={350} data-testid="flm-root">
      <Text fw={500} size="sm" mb="xs">Attachments</Text>
      <div data-testid="flm-Attachments">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 30, padding: '2px 4px' }} />
              <Table.Th style={{ padding: '2px 8px', fontSize: 11 }}>File name</Table.Th>
              <Table.Th style={{ padding: '2px 8px', fontSize: 11 }}>Type</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </Card>
  );
}
