'use client';

/**
 * alert_dialog_confirm-mantine-T10: Click a nonstandard confirm label in an already-open modal
 *
 * Isolated-card layout. On page load, a Mantine confirm modal is already open (no trigger click required).
 *
 * The modal title is "Remove integration?" and the body explains that the integration will stop syncing.
 *
 * The footer has two buttons with customized labels (via labels property):
 * - Cancel button: "Keep it"
 * - Confirm button: "Yes, remove" (styled as danger via confirmProps)
 *
 * There is also a small × close icon in the top-right of the modal header. The task requires clicking the confirm button with the exact label "Yes, remove".
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, Text, Modal, Button, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'remove_integration',
    };
  }, []);

  const handleConfirm = () => {
    setOpened(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'remove_integration',
      };
      onSuccess();
    }
  };

  const handleCancel = () => {
    setOpened(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'remove_integration',
    };
  };

  const handleClose = () => {
    setOpened(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'dismiss',
      dialog_instance: 'remove_integration',
    };
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Integrations</Text>
        <Text size="sm" c="dimmed">
          A confirmation dialog is currently open.
        </Text>
      </Card>

      <Modal
        opened={opened}
        onClose={handleClose}
        title="Remove integration?"
        centered
        data-testid="modal-remove-integration"
      >
        <Text size="sm" mb="lg">
          This integration will stop syncing data. You can reconnect it later from the integrations page.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleCancel} data-testid="cb-cancel">
            Keep it
          </Button>
          <Button color="red" onClick={handleConfirm} data-testid="cb-confirm">
            Yes, remove
          </Button>
        </Group>
      </Modal>
    </>
  );
}
