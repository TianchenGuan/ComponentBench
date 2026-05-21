'use client';

/**
 * dialog_modal-mantine-T09: Scroll within a modal to reach the bottom action
 *
 * Layout: isolated_card centered. A Mantine Modal is open on page load.
 *
 * Modal configuration:
 * - Title: "Changelog"
 * - Content: long scrollable changelog text (~3 screens)
 * - withCloseButton=true, but using the close button is not the intended path.
 * - At the bottom of the scrollable content there is a button labeled "Back to app".
 *
 * Initial state: modal open and scrolled to the top.
 * Success: The 'Changelog' modal is closed via 'Back to app' button (close_reason='back_to_app_button').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Text, Modal, Stack, Title, Divider, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Modal starts open
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Changelog',
    };
  }, []);

  const handleBackToApp = () => {
    setOpened(false);
    
    window.__cbModalState = {
      open: false,
      close_reason: 'back_to_app_button',
      modal_instance: 'Changelog',
    };
    
    // Success when closed via Back to app button
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCloseButton = () => {
    setOpened(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Changelog',
    };
  };

  const changelogEntries = [
    { version: '4.0.0', date: 'February 2025', changes: ['Complete UI redesign with modern aesthetics', 'New component library integration', 'Dark mode improvements', 'Performance optimizations'] },
    { version: '3.8.0', date: 'January 2025', changes: ['Added export functionality', 'Improved search filters', 'Bug fixes for mobile devices'] },
    { version: '3.7.0', date: 'December 2024', changes: ['New dashboard widgets', 'Real-time collaboration features', 'Enhanced security protocols'] },
    { version: '3.6.0', date: 'November 2024', changes: ['Improved accessibility', 'Keyboard navigation enhancements', 'Screen reader support'] },
    { version: '3.5.0', date: 'October 2024', changes: ['Multi-language support', 'Localization for 12 languages', 'RTL layout support'] },
    { version: '3.4.0', date: 'September 2024', changes: ['API v2 release', 'Webhook improvements', 'Rate limiting updates'] },
    { version: '3.3.0', date: 'August 2024', changes: ['Mobile app parity', 'Push notifications', 'Offline mode support'] },
    { version: '3.2.0', date: 'July 2024', changes: ['Team permissions overhaul', 'Role-based access control', 'Audit logging'] },
    { version: '3.1.0', date: 'June 2024', changes: ['Performance improvements', 'Reduced bundle size', 'Faster initial load times'] },
    { version: '3.0.0', date: 'May 2024', changes: ['Major platform upgrade', 'New infrastructure', 'Breaking API changes'] },
  ];

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Updates</Text>
        <Text size="sm" c="dimmed">
          View the changelog for recent updates.
        </Text>
      </Card>

      <Modal
        opened={opened}
        onClose={handleCloseButton}
        title="Changelog"
        centered
        size="lg"
        data-testid="modal-changelog"
      >
        <Box style={{ maxHeight: 400, overflowY: 'auto' }}>
          <Stack gap="lg">
            {changelogEntries.map((entry) => (
              <Box key={entry.version}>
                <Title order={5}>Version {entry.version}</Title>
                <Text size="xs" c="dimmed" mb="xs">{entry.date}</Text>
                <Stack gap={4}>
                  {entry.changes.map((change, i) => (
                    <Text key={i} size="sm">• {change}</Text>
                  ))}
                </Stack>
              </Box>
            ))}
            
            <Divider my="md" />
            
            <Box style={{ textAlign: 'center', paddingTop: 8 }}>
              <Button onClick={handleBackToApp} data-testid="cb-back-to-app">
                Back to app
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
