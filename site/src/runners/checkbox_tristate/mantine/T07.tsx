'use client';

/**
 * checkbox_tristate-mantine-T07: Modal: turn off Delete protection and Save
 *
 * Layout: modal_flow.
 * The base page shows a "Danger zone" card with a button labeled "Edit delete protection".
 * Clicking it opens a Mantine Modal titled "Delete protection".
 *
 * Inside the modal is one Mantine tri-state checkbox labeled "Delete protection"
 * with helper text ("Prevent accidental deletion; can be On, Off, or Partial").
 * Initial state: Checked.
 *
 * Modal footer buttons: "Cancel" (closes without saving), "Save" (commits the change).
 * The saved setting only updates after clicking Save.
 * 
 * Success: checkbox is Unchecked AND Save is clicked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Button, Modal, Group, Stack } from '@mantine/core';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedState, setSavedState] = useState<TristateValue>('checked');
  const [tempState, setTempState] = useState<TristateValue>('checked');

  const handleOpenModal = () => {
    setTempState(savedState);
    setModalOpen(true);
  };

  const handleClick = () => {
    setTempState(cycleTristateValue(tempState));
  };

  const handleSave = () => {
    setSavedState(tempState);
    setModalOpen(false);
    if (tempState === 'unchecked') {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setTempState(savedState);
    setModalOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} mb="xs" c="red.7">Danger zone</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage settings that can affect data safety.
        </Text>
        <Button
          variant="outline"
          color="red"
          onClick={handleOpenModal}
          data-testid="edit-delete-protection-btn"
        >
          Edit delete protection
        </Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Delete protection"
        centered
      >
        <Stack gap="md">
          <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={tempState === 'checked'}
              indeterminate={tempState === 'indeterminate'}
              label="Delete protection"
              data-testid="delete-protection-checkbox"
              readOnly
            />
          </div>
          <Text size="xs" c="dimmed" ml={28}>
            Prevent accidental deletion; can be On, Off, or Partial.
          </Text>
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} data-testid="save-delete-protection">Save</Button>
        </Group>
      </Modal>
    </>
  );
}
