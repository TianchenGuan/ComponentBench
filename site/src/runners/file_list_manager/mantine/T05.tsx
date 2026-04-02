'use client';

/**
 * file_list_manager-mantine-T05: Bulk-delete two screenshots from a form
 *
 * setup_description: The page is a "Report a bug" form section (form_section layout) with a few inputs (Title,
 * Severity, Description) as low clutter. Below is a "Screenshots" file list manager rendered with Mantine Table.
 * The table has checkboxes for selection and a toolbar with a "Delete selected" button (disabled until at least
 * one row is selected). Clicking "Delete selected" opens a centered Mantine Modal titled "Delete selected files?"
 * with buttons "Cancel" and "Delete". Only after clicking "Delete" are the selected files removed.
 *
 * Success: "error-1.png" and "error-2.png" are both removed from the Screenshots list after confirming deletion.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, TextInput, Textarea, Select, Button, Checkbox, Modal, Text, Group } from '@mantine/core';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'error-1.png', type: 'PNG', size: 89000 },
  { id: 'f2', name: 'error-2.png', type: 'PNG', size: 92000 },
  { id: 'f3', name: 'success-screen.png', type: 'PNG', size: 78000 },
  { id: 'f4', name: 'loading-state.png', type: 'PNG', size: 45000 },
  { id: 'f5', name: 'console-log.png', type: 'PNG', size: 112000 },
  { id: 'f6', name: 'network-tab.png', type: 'PNG', size: 134000 },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const error1Exists = files.some((f) => f.name === 'error-1.png');
    const error2Exists = files.some((f) => f.name === 'error-2.png');

    if (!error1Exists && !error2Exists) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleSelect = (fileId: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, fileId] : prev.filter((id) => id !== fileId)
    );
  };

  const handleConfirmDelete = () => {
    setFiles((prev) => prev.filter((f) => !selected.includes(f.id)));
    setSelected([]);
    setModalOpen(false);
  };

  const rows = files.map((file) => (
    <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
      <Table.Td>
        <Checkbox
          checked={selected.includes(file.id)}
          onChange={(e) => handleSelect(file.id, e.currentTarget.checked)}
          data-testid={`flm-select-${file.id}`}
        />
      </Table.Td>
      <Table.Td>{file.name}</Table.Td>
      <Table.Td>{file.type}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={600} data-testid="flm-root">
      <Text fw={500} size="lg" mb="md">Report a bug</Text>
      
      {/* Form fields (clutter) */}
      <TextInput label="Title" placeholder="Bug title" mb="sm" />
      <Select
        label="Severity"
        placeholder="Select severity"
        data={['Low', 'Medium', 'High', 'Critical']}
        mb="sm"
      />
      <Textarea label="Description" placeholder="Describe the bug" rows={2} mb="md" />

      {/* Screenshots section */}
      <Text fw={500} mb="sm">Screenshots</Text>
      <div data-testid="flm-Screenshots">
        <Group mb="sm">
          <Button
            color="red"
            disabled={selected.length === 0}
            onClick={() => setModalOpen(true)}
            data-testid="flm-delete-selected"
          >
            Delete selected
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }} />
              <Table.Th>File name</Table.Th>
              <Table.Th>Type</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete selected files?"
        data-testid="flm-delete-modal"
      >
        <Text mb="lg">Are you sure you want to delete {selected.length} file(s)?</Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={() => setModalOpen(false)} data-testid="flm-modal-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete} data-testid="flm-modal-delete">
            Delete
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
