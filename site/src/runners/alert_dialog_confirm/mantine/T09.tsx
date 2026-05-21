'use client';

/**
 * alert_dialog_confirm-mantine-T09: Cancel the correct confirm modal in a cluttered dashboard
 *
 * Dashboard layout anchored toward the top-right of the viewport. The page contains several cards (activity feed, usage chart, recent logins) as clutter.
 *
 * In a "Danger Zone" card, there are TWO similar buttons (two instances):
 * - "Delete account"
 * - "Delete workspace"
 *
 * Each opens a Mantine confirm modal with title reflecting the action and buttons "Cancel" and "Delete".
 *
 * The task is to open the "Delete account" confirmation modal and then click "Cancel" (explicit cancel), ensuring the account is NOT deleted.
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Text, Group, SimpleGrid, Box, Modal } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const successCalledRef = useRef(false);

  // Delete account handlers
  const handleDeleteAccount = () => {
    setAccountModalOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_account',
    };
  };

  const handleAccountConfirm = () => {
    setAccountModalOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'delete_account',
    };
  };

  const handleAccountCancel = () => {
    setAccountModalOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'cancel',
        dialog_instance: 'delete_account',
      };
      onSuccess();
    }
  };

  // Delete workspace handlers
  const handleDeleteWorkspace = () => {
    setWorkspaceModalOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_workspace',
    };
  };

  const handleWorkspaceConfirm = () => {
    setWorkspaceModalOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'delete_workspace',
    };
  };

  const handleWorkspaceCancel = () => {
    setWorkspaceModalOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'delete_workspace',
    };
  };

  return (
    <>
      <Box>
        {/* Clutter cards */}
        <SimpleGrid cols={3} spacing="md" mb="md">
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} size="sm" mb="xs">Activity</Text>
            <Text size="xs" c="dimmed">12 events today</Text>
          </Card>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} size="sm" mb="xs">Usage</Text>
            <Text size="xs" c="dimmed">2.4 GB / 5 GB</Text>
          </Card>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} size="sm" mb="xs">Recent logins</Text>
            <Text size="xs" c="dimmed">3 devices</Text>
          </Card>
        </SimpleGrid>

        {/* More clutter */}
        <SimpleGrid cols={2} spacing="md" mb="md">
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} size="sm" mb="xs">Team members</Text>
            <Text size="xs" c="dimmed">5 active users</Text>
          </Card>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} size="sm" mb="xs">Integrations</Text>
            <Text size="xs" c="dimmed">3 connected</Text>
          </Card>
        </SimpleGrid>

        {/* Danger Zone card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={500} c="red" mb="md">Danger Zone</Text>
          <Group gap="md">
            <Button
              color="red"
              variant="outline"
              onClick={handleDeleteAccount}
              data-testid="cb-open-delete-account"
            >
              Delete account
            </Button>
            <Button
              color="red"
              variant="outline"
              onClick={handleDeleteWorkspace}
              data-testid="cb-open-delete-workspace"
            >
              Delete workspace
            </Button>
          </Group>
        </Card>
      </Box>

      {/* Delete account modal */}
      <Modal
        opened={accountModalOpen}
        onClose={handleAccountCancel}
        title="Delete account?"
        centered
        data-testid="modal-delete-account"
      >
        <Text size="sm" mb="lg">
          Your account and all associated data will be permanently deleted. This cannot be undone.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleAccountCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleAccountConfirm} data-testid="cb-confirm">
            Delete
          </Button>
        </Group>
      </Modal>

      {/* Delete workspace modal */}
      <Modal
        opened={workspaceModalOpen}
        onClose={handleWorkspaceCancel}
        title="Delete workspace?"
        centered
        data-testid="modal-delete-workspace"
      >
        <Text size="sm" mb="lg">
          All workspace data will be permanently deleted. This cannot be undone.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleWorkspaceCancel}>
            Cancel
          </Button>
          <Button color="red" onClick={handleWorkspaceConfirm}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
