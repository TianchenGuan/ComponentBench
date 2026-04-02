'use client';

/**
 * password_input-mantine-T06: Change password in a modal (Mantine Modal)
 * 
 * A security page displays a button labeled "Change password". Clicking it opens a Mantine
 * Modal titled "Change password".
 * Inside the modal is one Mantine PasswordInput labeled "New password" (initially empty) and
 * two buttons: "Cancel" and "Save". Clicking Save closes the modal and shows a brief
 * notification "Password updated".
 * No other inputs affect the update.
 * 
 * Success: In the modal, the PasswordInput labeled "New password" equals exactly "Quartz@88"
 * AND the modal "Save" button has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, PasswordInput, Text, Group, Notification } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    if (saved && password === 'Quartz@88' && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [saved, password, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setShowNotification(true);
    setOpened(false);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div style={{ padding: 24, position: 'relative' }}>
      <Text fw={600} size="lg" mb="md">Security</Text>
      <Button 
        onClick={() => setOpened(true)}
        data-testid="open-change-password"
      >
        Change password
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Change password"
        data-testid="mantine-change-password-modal"
      >
        <PasswordInput
          label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="lg"
          data-testid="modal-new-password-input"
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setOpened(false)} data-testid="mantine-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="mantine-save">
            Save
          </Button>
        </Group>
      </Modal>

      {showNotification && (
        <Notification 
          color="green" 
          title="Success"
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
          onClose={() => setShowNotification(false)}
        >
          Password updated
        </Notification>
      )}
    </div>
  );
}
