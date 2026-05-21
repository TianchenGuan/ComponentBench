'use client';

/**
 * dialog_modal-mantine-v2-T09: Primary vs Backup token — Reissue now with loading (primary row only)
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Group, Modal, Stack, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import type { ModalState, TaskComponentProps } from '../../types';

function patch(p: Partial<ModalState>) {
  const prev = window.__cbModalState;
  window.__cbModalState = {
    open: p.open ?? prev?.open ?? false,
    close_reason: p.close_reason ?? prev?.close_reason ?? null,
    modal_instance: p.modal_instance ?? p.last_opened_instance ?? prev?.modal_instance ?? null,
    last_opened_instance: p.last_opened_instance ?? p.modal_instance ?? prev?.last_opened_instance ?? null,
    related_instances: p.related_instances ?? prev?.related_instances,
  };
}

type Row = 'primary' | 'backup' | null;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState<Row>(null);
  const [loading, setLoading] = useState(false);
  const successRef = useRef(false);

  const start = (row: Exclude<Row, null>) => {
    setOpen(row);
    patch({
      open: true,
      close_reason: null,
      modal_instance: 'Reissue token',
      last_opened_instance: 'Reissue token',
    });
  };

  const closeCancel = () => {
    setLoading(false);
    setOpen(null);
    patch({
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Reissue token',
      last_opened_instance: 'Reissue token',
    });
  };

  const confirm = () => {
    if (open !== 'primary') {
      setLoading(true);
      window.setTimeout(() => {
        setLoading(false);
        setOpen(null);
        patch({
          open: false,
          close_reason: 'cancel',
          modal_instance: 'Reissue token',
          last_opened_instance: 'Reissue token',
        });
      }, 500);
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setOpen(null);
      patch({
        open: false,
        close_reason: 'primary_confirm_button',
        modal_instance: 'Reissue token',
        last_opened_instance: 'Reissue token',
      });
      if (!successRef.current) {
        successRef.current = true;
        setTimeout(() => onSuccess(), 100);
      }
    }, 900);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={440}>
      <Text fw={600} mb="md">
        Access
      </Text>
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text size="sm" fw={500}>
              Primary token
            </Text>
            <Text size="xs" c="dimmed">
              Used for production API calls
            </Text>
          </div>
          <Button size="xs" variant="light" onClick={() => start('primary')} data-testid="cb-reissue-primary">
            Reissue…
          </Button>
        </Group>
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text size="sm" fw={500}>
              Backup token
            </Text>
            <Text size="xs" c="dimmed">
              Failover credential
            </Text>
          </div>
          <Button size="xs" variant="light" onClick={() => start('backup')} data-testid="cb-reissue-backup">
            Reissue…
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={open !== null}
        onClose={() => undefined}
        title="Reissue token"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        data-testid="modal-reissue-token"
      >
        <Text size="sm" mb="md">
          {open === 'primary'
            ? 'Reissue the primary token for this workspace.'
            : 'Reissue the backup token for this workspace.'}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeCancel} disabled={loading} data-testid="cb-cancel-reissue">
            Cancel
          </Button>
          <Button loading={loading} onClick={confirm} data-testid="cb-reissue-now">
            Reissue now
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
