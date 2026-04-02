'use client';

/**
 * dialog_modal-mantine-T07: Manage stacked modals and close only the top one
 *
 * Layout: isolated_card centered. The page loads with one Mantine Modal already open:
 * - Outer modal title: "Settings"
 * - Outer content includes a primary button labeled "Open details"
 *
 * Clicking "Open details" opens a second Mantine Modal stacked on top:
 * - Inner modal title: "Details"
 * - Inner modal has withCloseButton=true (header ×)
 *
 * Initial state: only "Settings" is open.
 * Success: The inner 'Details' modal is closed while 'Settings' remains open.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Text, Modal, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Settings',
      related_instances: {
        'Settings': { open: true },
        'Details': { open: false },
      },
    };
  }, []);

  const handleOpenDetails = () => {
    setDetailsOpen(true);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Details',
      related_instances: {
        'Settings': { open: true },
        'Details': { open: true },
      },
    };
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Details',
      related_instances: {
        'Settings': { open: true },
        'Details': { open: false },
      },
    };
    
    // Success when Details is closed while Settings remains open
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
    setDetailsOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Settings',
      related_instances: {
        'Settings': { open: false },
        'Details': { open: false },
      },
    };
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Application</Text>
        <Text size="sm" c="dimmed">
          Configure your application settings.
        </Text>
      </Card>

      <Modal
        opened={settingsOpen}
        onClose={handleCloseSettings}
        title="Settings"
        centered
        closeOnClickOutside={false}
        data-testid="modal-settings"
      >
        <Stack gap="md">
          <Text size="sm">
            General application settings. For more detailed configuration options, 
            click the button below.
          </Text>
          <Button onClick={handleOpenDetails} data-testid="cb-open-details">
            Open details
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={detailsOpen}
        onClose={handleCloseDetails}
        title="Details"
        centered
        withCloseButton={true}
        data-testid="modal-details"
      >
        <Text size="sm">
          Detailed configuration settings. These are advanced options for 
          fine-tuning your application behavior.
        </Text>
      </Modal>
    </>
  );
}
