'use client';

/**
 * alert_dialog_confirm-mantine-T08: Confirm a destructive action from inside a drawer flow (non-center placement)
 *
 * Drawer-flow layout with the main trigger anchored near the bottom-right of the viewport.
 *
 * The main page shows one button "Advanced". Clicking it opens a Mantine Drawer from the right edge.
 *
 * Inside the drawer, several non-critical controls (toggles/selects) appear first. At the bottom of the drawer there is a danger button "Reset all preferences".
 *
 * Clicking "Reset all preferences" opens a Mantine confirm modal above the drawer:
 * - Title: "Reset all preferences?"
 * - Body: brief warning text
 * - Buttons: "Cancel" and "Confirm"
 *
 * The task requires clicking "Confirm".
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Text, Drawer, Switch, Select, Stack, Divider, Modal, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleResetPreferences = () => {
    setModalOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'reset_all_preferences',
    };
  };

  const handleConfirm = () => {
    setModalOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'reset_all_preferences',
      };
      onSuccess();
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'reset_all_preferences',
    };
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 250 }}>
        <Button
          variant="outline"
          onClick={() => setDrawerOpen(true)}
          data-testid="cb-open-advanced"
        >
          Advanced
        </Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Advanced"
        position="right"
        size="sm"
        data-testid="drawer-advanced"
      >
        <Stack gap="md">
          <Switch label="Auto-save" defaultChecked />
          <Switch label="Animations" defaultChecked />
          <Select
            label="Language"
            data={['English', 'Spanish', 'French']}
            defaultValue="English"
          />
          <Select
            label="Time zone"
            data={['UTC', 'EST', 'PST']}
            defaultValue="UTC"
          />
        </Stack>

        <Divider my="md" />

        <Text fw={500} c="red" mb="sm">Danger Zone</Text>
        <Button
          color="red"
          variant="outline"
          onClick={handleResetPreferences}
          data-testid="cb-open-reset-preferences"
        >
          Reset all preferences
        </Button>
      </Drawer>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Reset all preferences?"
        centered
        data-testid="modal-reset-preferences"
      >
        <Text size="sm" mb="lg">
          All your preferences will be restored to their default values. This cannot be undone.
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
