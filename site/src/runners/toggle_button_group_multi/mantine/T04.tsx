'use client';

/**
 * toggle_button_group_multi-mantine-T24: Edit labels in modal and save
 *
 * Layout: modal_flow centered in the viewport.
 *
 * The main page shows a card titled "Task details" with a button labeled "Edit labels".
 * - Clicking "Edit labels" opens a Mantine Modal titled "Edit labels".
 *
 * Inside the modal:
 * - A section labeled "Labels" contains a Chip.Group with multiple selection enabled.
 * - Chips: Urgent, Follow-up, Personal, Work, Later.
 * - Initial state: Work selected only.
 *
 * Additional modal content (clutter=low):
 * - A small text input labeled "Label note" (not required for success).
 *
 * Modal footer buttons:
 * - "Cancel" and "Save".
 * - The selection is considered committed only after clicking Save.
 *
 * Success: Selected options equal exactly: Urgent, Work, Later (require_confirm: true, confirm_control: Save)
 */

import React, { useState } from 'react';
import { Card, Text, Button, Modal, Chip, Group, TextInput, Flex } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const LABELS = ['Urgent', 'Follow-up', 'Personal', 'Work', 'Later'];
const TARGET_SET = new Set(['Urgent', 'Work', 'Later']);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Work']);
  const [labelNote, setLabelNote] = useState('');

  const handleSave = () => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      setModalOpen(false);
      onSuccess();
    } else {
      setModalOpen(false);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="sm">Task details</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage labels for this task.
        </Text>
        <Button onClick={() => setModalOpen(true)} data-testid="edit-labels-button">
          Edit labels
        </Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit labels"
        data-testid="edit-labels-modal"
      >
        <Text size="sm" fw={500} mb="xs">Labels</Text>
        <Text size="xs" c="dimmed" mb="sm">
          Select Urgent, Work, and Later.
        </Text>

        <Chip.Group multiple value={selected} onChange={setSelected} data-testid="labels-group">
          <Group gap="sm" mb="md">
            {LABELS.map(label => (
              <Chip key={label} value={label} data-testid={`label-${label.toLowerCase().replace('-', '')}`}>
                {label}
              </Chip>
            ))}
          </Group>
        </Chip.Group>

        <TextInput
          label="Label note"
          placeholder="Add a note..."
          value={labelNote}
          onChange={(e) => setLabelNote(e.target.value)}
          mb="lg"
        />

        <Flex justify="flex-end" gap="sm">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="save-button">
            Save
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
