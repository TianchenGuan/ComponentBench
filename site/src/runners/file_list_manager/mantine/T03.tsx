'use client';

/**
 * file_list_manager-mantine-T03: Rename an audio clip
 *
 * setup_description: A single file list manager is displayed as a Mantine Table in the center of the page.
 * Each row has a Rename ActionIcon. Clicking it turns the filename cell into a TextInput with the current name
 * prefilled, and shows two small buttons: "Save" and "Cancel". "meeting.m4a" is present and not currently
 * being edited. The new name "meeting-clip.m4a" is unique and accepted without warnings.
 *
 * Success: The file originally named "meeting.m4a" is now named "meeting-clip.m4a" in the Attachments list.
 * The rename is committed (edit mode closed).
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, ActionIcon, Text, TextInput, Button, Group } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'meeting.m4a', type: 'M4A', size: 2456000 },
  { id: 'f2', name: 'podcast.mp3', type: 'MP3', size: 5670000 },
  { id: 'f3', name: 'interview.m4a', type: 'M4A', size: 3890000 },
  { id: 'f4', name: 'notes.txt', type: 'TXT', size: 4500 },
  { id: 'f5', name: 'summary.pdf', type: 'PDF', size: 198000 },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const renamedFile = files.find((f) => f.id === 'f1');
    if (renamedFile && renamedFile.name === 'meeting-clip.m4a' && editingId === null) {
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

  const rows = files.map((file) => (
    <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
      <Table.Td>
        {editingId === file.id ? (
          <div>
            <TextInput
              value={editValue}
              onChange={(e) => setEditValue(e.currentTarget.value)}
              size="xs"
              data-testid="flm-rename-input"
            />
            <Group gap="xs" mt="xs">
              <Button size="xs" onClick={saveEditing}>Save</Button>
              <Button size="xs" variant="subtle" onClick={cancelEditing}>Cancel</Button>
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
