'use client';

/**
 * clipboard_copy-mantine-T10: Confirm copying backup codes
 *
 * Layout: modal_flow, centered.
 * The page shows a "Two-factor authentication" section with a preformatted list of backup codes (4 lines).
 * A button labeled "Copy codes" is shown next to the section header.
 *
 * Confirmation flow:
 * - Clicking "Copy codes" opens a Mantine Modal titled "Copy backup codes?" with warning text about sensitivity.
 * - The modal has two buttons in the footer: "Cancel" and primary "Copy".
 * - Only clicking "Copy" triggers clipboard write of the entire multi-line backup code block and closes the modal.
 * - After success, a small notification appears: "Copied".
 *
 * Target clipboard text (exact, including newlines):
 * BK-1200
 * BK-1201
 * BK-1202
 * BK-1203
 *
 * Initial state: modal closed; nothing copied.
 *
 * Success: User confirms the modal by clicking "Copy", clipboard text equals the full backup code block exactly (4 lines).
 */

import React, { useState } from 'react';
import { Card, Text, Button, Modal, Group, Notification, Stack, Code } from '@mantine/core';
import { IconCopy, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard, trackConfirmAction } from '../types';

const BACKUP_CODES = `BK-1200
BK-1201
BK-1202
BK-1203`;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleCopyClick = () => {
    if (completed) return;
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleConfirmCopy = async () => {
    trackConfirmAction('Copy');
    const success = await copyToClipboard(BACKUP_CODES, 'Backup codes');
    if (success) {
      setModalOpen(false);
      setShowNotification(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, position: 'relative' }} data-testid="2fa-card">
        <Text fw={500} size="lg" mb="md">Two-factor authentication</Text>
        
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Text fw={500}>Backup codes</Text>
            <Button
              variant="subtle"
              leftSection={<IconCopy size={16} />}
              onClick={handleCopyClick}
              data-testid="copy-codes-button"
            >
              Copy codes
            </Button>
          </Group>

          <Code block data-testid="backup-codes-block">
            {BACKUP_CODES}
          </Code>
        </Stack>

        {/* Success notification */}
        {showNotification && (
          <Notification
            icon={<IconCheck size={16} />}
            color="teal"
            title="Copied"
            onClose={() => setShowNotification(false)}
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
            Backup codes copied to clipboard
          </Notification>
        )}
      </Card>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Copy backup codes?"
        data-testid="confirm-modal"
      >
        <Stack gap="md">
          <Group gap="xs">
            <IconAlertTriangle size={20} color="orange" />
            <Text size="sm" c="dimmed">
              These backup codes are sensitive. Make sure you store them securely and do not share them with anyone.
            </Text>
          </Group>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={handleCancel} data-testid="cancel-button">
              Cancel
            </Button>
            <Button onClick={handleConfirmCopy} data-testid="confirm-copy-button">
              Copy
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
