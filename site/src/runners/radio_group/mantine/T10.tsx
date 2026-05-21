'use client';

/**
 * radio_group-mantine-T10: Data sharing: select No and confirm
 *
 * An isolated card titled "Data sharing" is centered and shows the current setting as text: "Share usage data: Yes".
 * A button labeled "Change data sharing" opens a Mantine Modal.
 * Inside the modal is one Mantine Radio.Group labeled "Share usage data?" with two options: Yes and No.
 * Initial state: Yes.
 * The modal footer contains "Cancel" and "Save". After clicking "Save", a secondary confirmation dialog appears (overlay on top of the modal) with message "Confirm data sharing change?" and two buttons: "Cancel" and "Confirm".
 * The underlying card updates to "Share usage data: No" only after clicking "Confirm".
 *
 * Success: Persisted data sharing value equals "no" (label "No").
 *          An explicit confirmation action is required: click "Confirm" on the confirmation dialog after Save.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Radio, Stack, Button, Modal, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [persistedValue, setPersistedValue] = useState<string>('yes');
  const [tempValue, setTempValue] = useState<string>('yes');
  const hasSucceeded = useRef(false);

  const handleOpenModal = () => {
    setTempValue(persistedValue);
    setModalOpen(true);
  };

  const handleSave = () => {
    // Open confirmation dialog
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setPersistedValue(tempValue);
    setConfirmOpen(false);
    setModalOpen(false);
    if (tempValue === 'no' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setTempValue(persistedValue);
    setModalOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
        <Text fw={600} size="lg" mb="xs">Data sharing</Text>
        <Text size="sm" c="dimmed" mb="md">
          Share usage data: {persistedValue === 'yes' ? 'Yes' : 'No'}
        </Text>
        <Button onClick={handleOpenModal}>Change data sharing</Button>
      </Card>

      {/* Main modal */}
      <Modal 
        opened={modalOpen} 
        onClose={handleCancel} 
        title="Data sharing settings"
        centered
      >
        <Radio.Group
          data-canonical-type="radio_group"
          data-selected-value={tempValue}
          value={tempValue}
          onChange={setTempValue}
          label="Share usage data?"
        >
          <Stack gap="xs" mt="xs">
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </Stack>
        </Radio.Group>

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Modal>

      {/* Confirmation dialog */}
      <Modal 
        opened={confirmOpen} 
        onClose={handleCancelConfirm} 
        title="Confirm data sharing change?"
        centered
        size="sm"
      >
        <Text size="sm" mb="lg">
          Are you sure you want to change your data sharing preferences?
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={handleCancelConfirm}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Group>
      </Modal>
    </>
  );
}
