'use client';

/**
 * alert_dialog_confirm-mantine-T01: Confirm deleting a note (Mantine confirm modal)
 *
 * Baseline isolated-card layout centered in the viewport. A card titled "Notes" shows one note "Q1 plan" and a danger button labeled "Delete note".
 *
 * Clicking "Delete note" opens a Mantine confirm modal:
 * - Title: "Delete note?"
 * - Children/body: short warning text
 * - Buttons: "Cancel" and "Confirm" (confirm button is styled red)
 *
 * The modal closes on confirm/cancel.
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Text, Group, Modal, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  const handleDeleteClick = () => {
    setOpened(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_note_q1_plan',
    };
  };

  const handleConfirm = () => {
    setOpened(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'delete_note_q1_plan',
      };
      onSuccess();
    }
  };

  const handleCancel = () => {
    setOpened(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'delete_note_q1_plan',
    };
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Notes</Text>
        <Group justify="space-between" align="center">
          <Text>Q1 plan</Text>
          <Button
            color="red"
            variant="outline"
            onClick={handleDeleteClick}
            data-testid="cb-open-delete-note"
          >
            Delete note
          </Button>
        </Group>
      </Card>

      <Modal
        opened={opened}
        onClose={handleCancel}
        title="Delete note?"
        centered
        data-testid="modal-delete-note"
      >
        <Text size="sm" mb="lg">
          This will permanently delete the note. This action cannot be undone.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirm} data-testid="cb-confirm">
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  );
}
