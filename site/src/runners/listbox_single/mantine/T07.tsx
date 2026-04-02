'use client';

/**
 * listbox_single-mantine-T07: Pick a label in modal: Legal
 *
 * Scene: light theme, comfortable spacing, modal_flow layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A centered card titled "Document labels" includes a button labeled "Pick a label". Clicking it opens a
 * Mantine Modal. Inside the modal is a scroll-free NavLink-based listbox labeled "Labels" with four options:
 * "Finance", "Legal", "Marketing", "Sales". Initial selection is "Finance". The selection is not committed until
 * the user clicks the modal primary button "Done"; "Cancel" closes without saving. On success, the modal closes
 * and the selected label is shown as a chip on the base page.
 *
 * Success: Selected option value equals: legal (after clicking Done)
 * require_confirm: true, confirm_control: Done
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, Button, Modal, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const labelOptions = [
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [staged, setStaged] = useState<string>('finance');
  const [committed, setCommitted] = useState<string>('finance');

  const handleOpenModal = () => {
    setStaged(committed);
    setModalOpen(true);
  };

  const handleSelect = (value: string) => {
    setStaged(value);
  };

  const handleDone = () => {
    setCommitted(staged);
    setModalOpen(false);
    if (staged === 'legal') {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const committedLabel = labelOptions.find(l => l.value === committed)?.label || '';

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
        <Text fw={600} size="lg" mb="md">Document labels</Text>
        <Text size="sm" c="dimmed" mb="md">
          Assign a label to categorize this document.
        </Text>
        <Button onClick={handleOpenModal}>Pick a label</Button>
        {committed && (
          <Badge mt="md" size="lg">{committedLabel}</Badge>
        )}
      </Card>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Pick a label"
      >
        <Text fw={500} mb="sm">Labels</Text>
        <Stack
          gap="xs"
          data-cb-listbox-root
          data-cb-selected-value={staged}
          data-cb-committed-value={committed}
          role="listbox"
        >
          {labelOptions.map(opt => (
            <NavLink
              key={opt.value}
              label={opt.label}
              active={staged === opt.value}
              onClick={() => handleSelect(opt.value)}
              data-cb-option-value={opt.value}
              role="option"
              aria-selected={staged === opt.value}
            />
          ))}
        </Stack>

        <Group justify="flex-end" mt="lg">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleDone}>Done</Button>
        </Group>
      </Modal>
    </>
  );
}
