'use client';

/**
 * alert_dialog_confirm-mantine-T06: Match the correct confirm modal to a preview thumbnail
 *
 * Isolated-card layout. Two action buttons are displayed:
 * - "Disconnect integration"
 * - "Remove webhook"
 *
 * Each opens a Mantine confirm modal with Cancel/Confirm buttons and a distinct title.
 *
 * A "Preview" thumbnail card shows a small screenshot-like image of the target modal (title + part of the body). The instruction is visual and does not specify which action name is the target.
 *
 * The agent must open the matching modal and confirm it by clicking "Confirm".
 *
 * Note: The preview target is "remove_webhook"
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Text, Group, Stack, Box, Modal } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [webhookOpen, setWebhookOpen] = useState(false);
  const successCalledRef = useRef(false);
  const previewTarget = 'remove_webhook';

  // Store preview target for checker
  if (typeof window !== 'undefined') {
    (window as any).__cbPreviewTargetId = previewTarget;
  }

  // Disconnect integration handlers
  const handleDisconnect = () => {
    setDisconnectOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'disconnect_integration',
    };
  };

  const handleDisconnectConfirm = () => {
    setDisconnectOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'disconnect_integration',
    };
  };

  const handleDisconnectCancel = () => {
    setDisconnectOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'disconnect_integration',
    };
  };

  // Remove webhook handlers
  const handleRemoveWebhook = () => {
    setWebhookOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'remove_webhook',
    };
  };

  const handleWebhookConfirm = () => {
    setWebhookOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'remove_webhook',
      };
      onSuccess();
    }
  };

  const handleWebhookCancel = () => {
    setWebhookOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'remove_webhook',
    };
  };

  return (
    <>
      <Group align="flex-start" gap="lg">
        {/* Action buttons */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
          <Text fw={500} size="lg" mb="md">Actions</Text>
          <Stack gap="sm">
            <Button
              color="red"
              variant="outline"
              onClick={handleDisconnect}
              data-testid="cb-open-disconnect"
            >
              Disconnect integration
            </Button>
            <Button
              color="red"
              variant="outline"
              onClick={handleRemoveWebhook}
              data-testid="cb-open-remove-webhook"
            >
              Remove webhook
            </Button>
          </Stack>
        </Card>

        {/* Preview card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 280 }} data-cb-preview-target="remove_webhook">
          <Text fw={500} size="lg" mb="md">Preview</Text>
          <Box
            p="md"
            style={{
              border: '1px solid #dee2e6',
              borderRadius: 8,
              background: '#f8f9fa',
            }}
          >
            <Text fw={600} mb="xs">Remove webhook?</Text>
            <Text size="sm" c="dimmed" mb="md">
              This webhook will stop receiving events.
            </Text>
            <Group gap="xs" justify="flex-end">
              <Box px="sm" py={4} style={{ border: '1px solid #dee2e6', borderRadius: 4, fontSize: 12 }}>
                Cancel
              </Box>
              <Box px="sm" py={4} style={{ background: '#fa5252', color: 'white', borderRadius: 4, fontSize: 12 }}>
                Confirm
              </Box>
            </Group>
          </Box>
          <Text size="xs" c="dimmed" mt="sm">
            Match this dialog to complete the task
          </Text>
        </Card>
      </Group>

      {/* Disconnect integration modal */}
      <Modal
        opened={disconnectOpen}
        onClose={handleDisconnectCancel}
        title="Disconnect integration?"
        centered
        data-testid="modal-disconnect"
      >
        <Text size="sm" mb="lg">
          Data will stop syncing from this integration.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleDisconnectCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleDisconnectConfirm} data-testid="cb-confirm">
            Confirm
          </Button>
        </Group>
      </Modal>

      {/* Remove webhook modal */}
      <Modal
        opened={webhookOpen}
        onClose={handleWebhookCancel}
        title="Remove webhook?"
        centered
        data-testid="modal-remove-webhook"
      >
        <Text size="sm" mb="lg">
          This webhook will stop receiving events.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleWebhookCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleWebhookConfirm} data-testid="cb-confirm">
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  );
}
