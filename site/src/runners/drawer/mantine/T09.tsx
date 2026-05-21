'use client';

/**
 * drawer-mantine-T09: Discard changes when closing a Mantine editor drawer (confirm modal)
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * Initial state:
 * - A Mantine Drawer titled "Note editor" is OPEN on page load.
 * - Inside the drawer is a text area that already contains unsaved edits; an inline status text reads "Unsaved changes".
 *
 * Close behavior:
 * - Clicking the header close (X) button opens a confirmation modal (Mantine Modal) with:
 *   - Title: "Discard changes?"
 *   - Buttons: "Keep editing" and "Discard"
 * - Clicking "Discard" closes the modal and then closes the drawer.
 *
 * Distractors:
 * - The drawer also shows a disabled "Save" button to simulate an editor UI without requiring saving.
 *
 * Feedback:
 * - The modal appears above the drawer; after discarding, both modal and drawer are gone.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Drawer, Stack, Modal, Textarea, Badge, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpened, setDrawerOpened] = useState(true); // Start open
  const [modalOpened, setModalOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!drawerOpened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [drawerOpened, onSuccess]);

  const handleCloseAttempt = () => {
    setModalOpened(true);
  };

  const handleDiscard = () => {
    setModalOpened(false);
    setDrawerOpened(false);
  };

  const handleKeepEditing = () => {
    setModalOpened(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Notes
      </Text>
      <Text size="sm" c="dimmed">
        The Note editor drawer has unsaved changes.
      </Text>

      <Drawer
        opened={drawerOpened}
        onClose={handleCloseAttempt}
        title={
          <Group gap="xs">
            <Text fw={500}>Note editor</Text>
            <Badge color="yellow" size="sm">Unsaved changes</Badge>
          </Group>
        }
        position="right"
        data-testid="drawer-note-editor"
      >
        <Stack gap="md">
          <Textarea
            label="Note content"
            defaultValue="This is my note with some important information that I've been editing..."
            rows={6}
          />
          <Group>
            <Button onClick={handleCloseAttempt} variant="outline">
              Cancel
            </Button>
            <Button disabled>Save</Button>
          </Group>
        </Stack>
      </Drawer>

      <Modal
        opened={modalOpened}
        onClose={handleKeepEditing}
        title="Discard changes?"
        centered
      >
        <Text size="sm" mb="lg">
          You have unsaved changes. Are you sure you want to discard them?
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={handleKeepEditing} data-testid="keep">
            Keep editing
          </Button>
          <Button color="red" onClick={handleDiscard} data-testid="discard">
            Discard
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
