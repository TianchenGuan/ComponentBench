'use client';

/**
 * file_list_manager-mantine-T02: Remove an outdated logo file
 *
 * setup_description: The Attachments manager is a Mantine Table inside an isolated centered card. Rows show
 * file name and type icons. The Actions column contains ActionIcon buttons for Rename and Remove. Remove deletes
 * the row immediately (no confirmation) and shows a small notification "Removed". The list includes
 * "old_logo.svg" among 7 items.
 *
 * Success: "old_logo.svg" is absent from the Attachments list. All other files remain present.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, ActionIcon, Text, Tooltip } from '@mantine/core';
import { IconTrash, IconPencil } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'new_logo.svg', type: 'SVG', size: 45000 },
  { id: 'f3', name: 'old_logo.svg', type: 'SVG', size: 38000 },
  { id: 'f4', name: 'report.docx', type: 'DOCX', size: 128000 },
  { id: 'f5', name: 'invoice.pdf', type: 'PDF', size: 156000 },
  { id: 'f6', name: 'notes.txt', type: 'TXT', size: 4500 },
  { id: 'f7', name: 'summary.pdf', type: 'PDF', size: 198000 },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const oldLogoExists = files.some((f) => f.name === 'old_logo.svg');
    if (!oldLogoExists && files.length === 6) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleRemove = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    notifications.show({
      message: 'Removed',
      color: 'green',
      autoClose: 2000,
    });
  };

  const rows = files.map((file) => (
    <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
      <Table.Td>{file.name}</Table.Td>
      <Table.Td>{file.type}</Table.Td>
      <Table.Td>
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip label="Rename">
            <ActionIcon variant="subtle" data-testid="flm-action-rename">
              <IconPencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Remove">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleRemove(file.id)}
              data-testid="flm-action-remove"
              aria-label={`Remove ${file.name}`}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={500} data-testid="flm-root">
      <Text fw={500} size="lg" mb="md">Attachments</Text>
      <div data-testid="flm-Attachments">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>File name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </Card>
  );
}
