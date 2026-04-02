'use client';

/**
 * collapsible_disclosure-mantine-T04: Modal: open Edit profile then expand Notifications
 * 
 * A profile page uses a modal overlay flow.
 * 
 * - Layout: modal_flow.
 * - Trigger: button labeled "Edit profile" opens a Mantine Modal.
 * - Inside the modal: a Mantine Accordion (single-open) with items:
 *   - "Personal info" (expanded by default)
 *   - "Notifications"
 *   - "Privacy"
 * - The modal footer includes "Cancel" and "Save" buttons, but success is determined only by the accordion state inside the open modal.
 * 
 * Success: Modal is open AND "Notifications" is expanded
 */

import React, { useState, useEffect, useRef } from 'react';
import { Accordion, Card, Text, Button, Modal, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState<string | null>('personal_info');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (modalOpen && value === 'notifications' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [modalOpen, value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Profile</Text>
      <Text mb="md">
        View and edit your profile settings by clicking the button below.
      </Text>
      
      <Button onClick={() => setModalOpen(true)} data-testid="open-modal-button">
        Edit profile
      </Button>

      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)}
        title="Edit profile"
        data-testid="edit-profile-modal"
      >
        <Accordion value={value} onChange={setValue} data-testid="modal-accordion">
          <Accordion.Item value="personal_info">
            <Accordion.Control>Personal info</Accordion.Control>
            <Accordion.Panel>
              Update your name, email, and profile picture.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="notifications">
            <Accordion.Control>Notifications</Accordion.Control>
            <Accordion.Panel>
              Manage your notification preferences and email settings.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="privacy">
            <Accordion.Control>Privacy</Accordion.Control>
            <Accordion.Panel>
              Control your privacy settings and data sharing preferences.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setModalOpen(false)}>
            Save
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
