'use client';

/**
 * dialog_modal-mantine-T08: Close a full-screen modal using a custom header action
 *
 * Layout: modal_flow centered, DARK theme. A full-screen Mantine Modal is open on page load.
 *
 * Modal configuration:
 * - Title: "Photo viewer"
 * - fullScreen=true
 * - withCloseButton=false (no × close button)
 * - closeOnEscape=false and closeOnClickOutside=false
 * - A custom header action button labeled "Done"
 *
 * Initial state: modal open in full-screen mode.
 * Success: The 'Photo viewer' modal is closed via Done button (close_reason='done_button').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Text, Modal, Group, Box, MantineProvider, Image, Center } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Modal starts open
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Photo viewer',
    };
  }, []);

  const handleDone = () => {
    setOpened(false);
    
    window.__cbModalState = {
      open: false,
      close_reason: 'done_button',
      modal_instance: 'Photo viewer',
    };
    
    // Success when closed via Done button
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box style={{ background: '#1a1b1e', minHeight: '100%', padding: 16 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
          <Text fw={500} size="lg" mb="md">Gallery</Text>
          <Text size="sm" c="dimmed">
            View photos in full-screen mode.
          </Text>
        </Card>

        <Modal
          opened={opened}
          onClose={() => {}} // No-op
          title={
            <Group justify="space-between" style={{ width: '100%' }}>
              <Text fw={500}>Photo viewer</Text>
              <Button 
                size="sm" 
                variant="light"
                onClick={handleDone}
                data-testid="cb-done"
              >
                Done
              </Button>
            </Group>
          }
          fullScreen
          withCloseButton={false}
          closeOnEscape={false}
          closeOnClickOutside={false}
          data-testid="modal-photo-viewer"
        >
          <Center style={{ height: 'calc(100vh - 120px)' }}>
            <Box 
              style={{ 
                width: 400, 
                height: 300, 
                background: '#2c2e33', 
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text c="dimmed" size="lg">Photo placeholder</Text>
            </Box>
          </Center>
        </Modal>
      </Box>
    </MantineProvider>
  );
}
