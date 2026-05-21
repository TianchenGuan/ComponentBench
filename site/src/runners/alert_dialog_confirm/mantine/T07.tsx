'use client';

/**
 * alert_dialog_confirm-mantine-T07: Confirm the correct icon-only danger action (dark + compact + small)
 *
 * The page uses a dark theme, compact spacing, and small scale tier.
 *
 * Three small "Danger actions" tiles are shown in a row (three instances). Each tile has:
 * - A short label (e.g., "Delete logs", "Delete cache", "Disable sync")
 * - An icon-only action button (trash/ban icons; same size and styling)
 *
 * Clicking an icon button opens a Mantine confirm modal. All modals share the same button labels "Cancel" and "Confirm", but the title differs per tile.
 *
 * The task requires deleting logs specifically, which corresponds to the tile labeled "Delete logs". Confirm must be clicked in the modal.
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Group, ActionIcon, SimpleGrid, Modal, Button } from '@mantine/core';
import { IconTrash, IconBan, IconDatabase } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [currentAction, setCurrentAction] = useState<{ id: string; label: string } | null>(null);
  const successCalledRef = useRef(false);

  const actions = [
    { id: 'delete_logs', label: 'Delete logs', icon: IconTrash },
    { id: 'delete_cache', label: 'Delete cache', icon: IconDatabase },
    { id: 'disable_sync', label: 'Disable sync', icon: IconBan },
  ];

  const handleAction = (action: { id: string; label: string }) => {
    setCurrentAction(action);
    setOpened(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: action.id,
    };
  };

  const handleConfirm = () => {
    setOpened(false);
    if (currentAction?.id === 'delete_logs' && !successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: currentAction.id,
      };
      onSuccess();
    } else if (currentAction) {
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: currentAction.id,
      };
    }
    setCurrentAction(null);
  };

  const handleCancel = () => {
    setOpened(false);
    if (currentAction) {
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'cancel',
        dialog_instance: currentAction.id,
      };
    }
    setCurrentAction(null);
  };

  return (
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={500} c="red" mb="sm" size="sm">Danger actions</Text>
        <SimpleGrid cols={3} spacing="xs">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.id} padding="xs" radius="sm" withBorder>
                <Group justify="center" gap="xs">
                  <Text size="xs">{action.label}</Text>
                </Group>
                <Group justify="center" mt="xs">
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    size="sm"
                    onClick={() => handleAction(action)}
                    data-testid={`cb-open-${action.id.replace('_', '-')}`}
                    data-cb-instance={action.id}
                  >
                    <Icon size={14} />
                  </ActionIcon>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>
      </Card>

      <Modal
        opened={opened}
        onClose={handleCancel}
        title={`${currentAction?.label}?`}
        centered
        data-testid="modal-danger-action"
      >
        <Text size="sm" mb="lg">
          This action cannot be undone. Are you sure you want to proceed?
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
