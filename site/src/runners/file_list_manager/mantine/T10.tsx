'use client';

/**
 * file_list_manager-mantine-T10: Rename a duplicate file using a required date format
 *
 * setup_description: A single centered Attachments manager is displayed as a Mantine Table. The list contains
 * two similar files: "report.pdf" and "report (1).pdf" (the one to rename), plus several other PDFs. Clicking
 * the Rename ActionIcon opens an inline rename editor with a TextInput and Save/Cancel buttons. The rename field
 * enforces a format for reports: it must match "report-YYYY-MM-DD.pdf". A small "Naming format" badge is shown
 * above the table and an error message appears under the input if the format is wrong; the Save button is
 * disabled until the input is valid.
 *
 * Success: "report (1).pdf" is renamed to exactly "report-2026-02-02.pdf" in the Attachments list.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, ActionIcon, Text, TextInput, Button, Group, Badge } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'report.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'report (1).pdf', type: 'PDF', size: 256000 },
  { id: 'f3', name: 'summary.pdf', type: 'PDF', size: 198000 },
  { id: 'f4', name: 'invoice.pdf', type: 'PDF', size: 156000 },
  { id: 'f5', name: 'contract.pdf', type: 'PDF', size: 312000 },
];

// Pattern: report-YYYY-MM-DD.pdf
const VALID_PATTERN = /^report-\d{4}-\d{2}-\d{2}\.pdf$/;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const renamedFile = files.find((f) => f.id === 'f2');
    if (renamedFile && renamedFile.name === 'report-2026-02-02.pdf' && editingId === null) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, editingId, completed, onSuccess]);

  const isValidName = useMemo(() => {
    return VALID_PATTERN.test(editValue);
  }, [editValue]);

  const startEditing = (file: FileItem) => {
    setEditingId(file.id);
    setEditValue(file.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEditing = () => {
    if (editingId && editValue.trim() && isValidName) {
      setFiles((prev) =>
        prev.map((f) => (f.id === editingId ? { ...f, name: editValue.trim() } : f))
      );
      setEditingId(null);
      setEditValue('');
    }
  };

  const rows = files.map((file) => (
    <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
      <Table.Td>
        {editingId === file.id ? (
          <div>
            <TextInput
              value={editValue}
              onChange={(e) => setEditValue(e.currentTarget.value)}
              size="xs"
              error={editValue && !isValidName ? 'Must match format: report-YYYY-MM-DD.pdf' : undefined}
              data-testid="flm-rename-input"
            />
            <Group gap="xs" mt="xs">
              <Button size="xs" onClick={saveEditing} disabled={!isValidName}>
                Save
              </Button>
              <Button size="xs" variant="subtle" onClick={cancelEditing}>
                Cancel
              </Button>
            </Group>
          </div>
        ) : (
          file.name
        )}
      </Table.Td>
      <Table.Td>{file.type}</Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          onClick={() => startEditing(file)}
          disabled={editingId !== null}
          data-testid="flm-action-rename"
          aria-label={`Rename ${file.name}`}
        >
          <IconPencil size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={500} data-testid="flm-root">
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">Attachments</Text>
        <Badge color="blue" variant="light">Naming format: report-YYYY-MM-DD.pdf</Badge>
      </Group>
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
