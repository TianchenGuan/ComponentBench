'use client';

/**
 * alert_dialog_confirm-mantine-T02: Cancel removing a collaborator (Mantine confirm modal)
 *
 * Baseline isolated-card layout. A card titled "Members" lists one member "Alex" with a button "Remove member".
 *
 * Clicking "Remove member" opens a Mantine confirm modal:
 * - Title: "Remove Alex?"
 * - Body: short explanation
 * - Buttons: "Cancel" and "Remove"
 *
 * Task requires pressing "Cancel" explicitly (not generic dismiss).
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Text, Group, Avatar, Modal } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  const handleRemoveClick = () => {
    setOpened(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'remove_member_alex',
    };
  };

  const handleConfirm = () => {
    setOpened(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'remove_member_alex',
    };
  };

  const handleCancel = () => {
    setOpened(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'cancel',
        dialog_instance: 'remove_member_alex',
      };
      onSuccess();
    }
  };

  const handleClose = () => {
    setOpened(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'dismiss',
      dialog_instance: 'remove_member_alex',
    };
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Members</Text>
        <Group justify="space-between" align="center">
          <Group>
            <Avatar color="blue" radius="xl">A</Avatar>
            <Text>Alex</Text>
          </Group>
          <Button
            color="red"
            variant="outline"
            onClick={handleRemoveClick}
            data-testid="cb-open-remove-member"
          >
            Remove member
          </Button>
        </Group>
      </Card>

      <Modal
        opened={opened}
        onClose={handleClose}
        title="Remove Alex?"
        centered
        data-testid="modal-remove-member"
      >
        <Text size="sm" mb="lg">
          Alex will lose access to this workspace. You can invite them again later.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirm} data-testid="cb-confirm">
            Remove
          </Button>
        </Group>
      </Modal>
    </>
  );
}
