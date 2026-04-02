'use client';

/**
 * alert_dialog_confirm-mantine-T04: Confirm the correct action among two confirm modals (settings panel)
 *
 * Settings panel layout with a main content column and a small sidebar (sidebar links are distractors).
 *
 * In the main column, a "Danger Zone" section contains TWO buttons (two instances):
 * - "Reset API token"
 * - "Delete workspace"
 *
 * Each button opens a Mantine confirm modal with:
 * - A title reflecting the action ("Reset API token?" vs "Delete workspace?")
 * - Body warning text
 * - Buttons: "Cancel" and "Confirm" (Confirm is styled red for delete workspace; neutral for reset)
 *
 * The task targets the "Delete workspace" instance specifically.
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Text, Group, Stack, Divider, Box, Modal } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const successCalledRef = useRef(false);

  // Reset API token handlers
  const handleResetToken = () => {
    setResetModalOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'reset_api_token',
    };
  };

  const handleResetConfirm = () => {
    setResetModalOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'reset_api_token',
    };
  };

  const handleResetCancel = () => {
    setResetModalOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'reset_api_token',
    };
  };

  // Delete workspace handlers
  const handleDeleteWorkspace = () => {
    setDeleteModalOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_workspace',
    };
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'delete_workspace',
      };
      onSuccess();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'delete_workspace',
    };
  };

  return (
    <>
      <Group align="flex-start" gap="lg">
        {/* Sidebar (non-interactive) */}
        <Box w={150} p="md" style={{ background: '#f8f9fa', borderRadius: 8 }}>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">General</Text>
            <Text size="sm" c="dimmed">Notifications</Text>
            <Text size="sm" fw={500} style={{ background: '#e7f5ff', padding: '4px 8px', borderRadius: 4 }}>Security</Text>
          </Stack>
        </Box>

        {/* Main panel */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1, minWidth: 400 }}>
          <Text fw={500} size="lg" mb="md">Security</Text>
          <Text size="sm" c="dimmed" mb="lg">
            Manage your security settings and workspace access.
          </Text>

          <Divider my="md" />

          <Text fw={500} c="red" mb="md">Danger Zone</Text>
          <Stack gap="md">
            <Group justify="space-between" p="md" style={{ border: '1px solid #ffc9c9', borderRadius: 8 }}>
              <div>
                <Text fw={500}>Reset API token</Text>
                <Text size="sm" c="dimmed">Invalidate the current API token</Text>
              </div>
              <Button color="red" variant="outline" onClick={handleResetToken} data-testid="cb-open-reset-token">
                Reset API token
              </Button>
            </Group>

            <Group justify="space-between" p="md" style={{ border: '1px solid #ffc9c9', borderRadius: 8 }}>
              <div>
                <Text fw={500}>Delete workspace</Text>
                <Text size="sm" c="dimmed">Permanently delete this workspace</Text>
              </div>
              <Button color="red" variant="outline" onClick={handleDeleteWorkspace} data-testid="cb-open-delete-workspace">
                Delete workspace
              </Button>
            </Group>
          </Stack>
        </Card>
      </Group>

      {/* Reset API token modal */}
      <Modal
        opened={resetModalOpen}
        onClose={handleResetCancel}
        title="Reset API token?"
        centered
        data-testid="modal-reset-token"
      >
        <Text size="sm" mb="lg">
          The current token will be invalidated. You will need to update your integrations.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleResetCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} data-testid="cb-confirm">
            Confirm
          </Button>
        </Group>
      </Modal>

      {/* Delete workspace modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete workspace?"
        centered
        data-testid="modal-delete-workspace"
      >
        <Text size="sm" mb="lg">
          All data will be permanently deleted. This action cannot be undone.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleDeleteCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm} data-testid="cb-confirm">
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  );
}
