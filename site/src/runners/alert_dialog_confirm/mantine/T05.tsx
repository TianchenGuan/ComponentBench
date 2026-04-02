'use client';

/**
 * alert_dialog_confirm-mantine-T05: Cancel deletion for the correct backup row (table operation)
 *
 * Table-cell layout with a "Backups" table in a centered container. Three backups are listed as rows:
 * - "Backup 2026-01-10"
 * - "Backup 2026-01-15"
 * - "Backup 2026-01-20"
 *
 * Each row has an icon-only delete button in the last column. Clicking it opens a Mantine confirm modal whose title includes the backup name (e.g., "Delete Backup 2026-01-15?"). Buttons are "Cancel" and "Delete".
 *
 * The task is to open the delete confirmation for the 2026-01-15 backup and then explicitly press "Cancel" (do not delete).
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Table, ActionIcon, Modal, Button, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

interface Backup {
  id: string;
  name: string;
  size: string;
}

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [currentBackup, setCurrentBackup] = useState<Backup | null>(null);
  const successCalledRef = useRef(false);

  const backups: Backup[] = [
    { id: '2026-01-10', name: 'Backup 2026-01-10', size: '2.4 GB' },
    { id: '2026-01-15', name: 'Backup 2026-01-15', size: '2.6 GB' },
    { id: '2026-01-20', name: 'Backup 2026-01-20', size: '2.5 GB' },
  ];

  const handleDelete = (backup: Backup) => {
    setCurrentBackup(backup);
    setOpened(true);
    const instanceId = `delete_backup_${backup.id.replace(/-/g, '_')}`;
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: instanceId,
    };
  };

  const handleConfirm = () => {
    setOpened(false);
    if (currentBackup) {
      const instanceId = `delete_backup_${currentBackup.id.replace(/-/g, '_')}`;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: instanceId,
      };
    }
    setCurrentBackup(null);
  };

  const handleCancel = () => {
    setOpened(false);
    if (currentBackup) {
      const instanceId = `delete_backup_${currentBackup.id.replace(/-/g, '_')}`;
      if (currentBackup.id === '2026-01-15' && !successCalledRef.current) {
        successCalledRef.current = true;
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: instanceId,
        };
        onSuccess();
      } else {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: instanceId,
        };
      }
    }
    setCurrentBackup(null);
  };

  const rows = backups.map((backup) => (
    <Table.Tr key={backup.id}>
      <Table.Td>{backup.name}</Table.Td>
      <Table.Td>{backup.size}</Table.Td>
      <Table.Td>
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={() => handleDelete(backup)}
          data-testid={`cb-delete-backup-${backup.id}`}
          data-cb-instance={backup.name}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
        <Text fw={500} size="lg" mb="md">Backups</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Size</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={opened}
        onClose={handleCancel}
        title={`Delete ${currentBackup?.name}?`}
        centered
        data-testid="modal-delete-backup"
      >
        <Text size="sm" mb="lg">
          This backup will be permanently deleted. This action cannot be undone.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirm} data-testid="cb-confirm">
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
