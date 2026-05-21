'use client';

/**
 * dialog_modal-mantine-T04: Open the correct modal when two triggers are present
 *
 * Layout: isolated_card centered with COMPACT spacing.
 * The card is titled "Developer settings" and contains two adjacent buttons:
 * - "Webhooks" (Primary)
 * - "API keys" (Secondary)
 *
 * Each button opens its own Mantine Modal.
 * Initial state: both modals closed.
 * Success: The modal titled 'API keys' is open/visible.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Text, Modal, Group, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [webhooksOpen, setWebhooksOpen] = useState(false);
  const [apiKeysOpen, setApiKeysOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenWebhooks = () => {
    setWebhooksOpen(true);
    setApiKeysOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Webhooks',
    };
  };

  const handleOpenApiKeys = () => {
    setApiKeysOpen(true);
    setWebhooksOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'API keys',
    };
    
    // Success when API keys modal opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCloseWebhooks = () => {
    setWebhooksOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Webhooks',
    };
  };

  const handleCloseApiKeys = () => {
    setApiKeysOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: 'API keys',
    };
  };

  return (
    <>
      <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 380 }}>
        <Text fw={500} size="md" mb="xs">Developer settings</Text>
        
        <Group gap="xs" mb="sm">
          <Button 
            variant="filled" 
            size="xs"
            onClick={handleOpenWebhooks}
            data-testid="cb-open-webhooks"
          >
            Webhooks
          </Button>
          <Button 
            variant="outline" 
            size="xs"
            onClick={handleOpenApiKeys}
            data-testid="cb-open-api-keys"
          >
            API keys
          </Button>
        </Group>
        
        <Text size="xs" c="dimmed">
          Configure webhooks to receive real-time notifications, or manage your 
          API keys for programmatic access.
        </Text>
      </Card>

      <Modal
        opened={webhooksOpen}
        onClose={handleCloseWebhooks}
        title="Webhooks"
        centered
        data-testid="modal-webhooks"
      >
        <Text size="sm">
          Configure webhook endpoints to receive event notifications.
        </Text>
      </Modal>

      <Modal
        opened={apiKeysOpen}
        onClose={handleCloseApiKeys}
        title="API keys"
        centered
        data-testid="modal-api-keys"
      >
        <Text size="sm">
          Manage your API keys for secure programmatic access to the platform.
        </Text>
      </Modal>
    </>
  );
}
