'use client';

/**
 * dialog_modal-mantine-v2-T04: Maintenance notice — scroll, choose Return to dashboard
 */

import React, { useRef, useState } from 'react';
import { Badge, Button, Card, Group, Modal, ScrollArea, Stack, Text } from '@mantine/core';
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

const BODY = Array.from({ length: 20 }, (_, i) => (
  <Text key={i} size="sm" mb="sm">
    Maintenance window {i + 1}: services may restart; queues drain gradually. Read through every
    section before choosing an action at the bottom.
  </Text>
));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successRef = useRef(false);

  const open = () => {
    setOpened(true);
    patch({
      open: true,
      close_reason: null,
      modal_instance: 'Maintenance notice',
      last_opened_instance: 'Maintenance notice',
    });
  };

  const closeWrong = (reason: ModalState['close_reason']) => {
    setOpened(false);
    patch({
      open: false,
      close_reason: reason,
      modal_instance: 'Maintenance notice',
      last_opened_instance: 'Maintenance notice',
    });
  };

  const closeOk = () => {
    setOpened(false);
    patch({
      open: false,
      close_reason: 'return_to_dashboard_button',
      modal_instance: 'Maintenance notice',
      last_opened_instance: 'Maintenance notice',
    });
    if (!successRef.current) {
      successRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Stack gap="sm" maw={480}>
      <Group gap={6} wrap="wrap">
        <Badge variant="light">Ops</Badge>
        <Badge variant="outline">SRE</Badge>
        <Text size="xs" c="dimmed">
          Status board
        </Text>
      </Group>
      <Card withBorder padding="md">
        <Text size="sm" fw={500} mb="xs">
          Upcoming changes
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          Review the maintenance notice before rollout.
        </Text>
        <Button size="sm" onClick={open} data-testid="cb-review-maintenance">
          Review Maintenance notice
        </Button>
      </Card>

      <Modal
        opened={opened}
        onClose={() => closeWrong('close_button')}
        title="Maintenance notice"
        centered
        withCloseButton
        closeOnClickOutside={false}
        closeOnEscape={false}
        data-testid="modal-maintenance"
      >
        <ScrollArea h={260} type="auto" data-testid="cb-maintenance-scroll">
          <Stack gap={0}>{BODY}</Stack>
          <Group justify="flex-end" gap="xs" mt="md" wrap="wrap">
            <Button variant="default" onClick={() => closeWrong('cancel')} data-testid="cb-dismiss">
              Dismiss
            </Button>
            <Button variant="light" onClick={() => closeWrong('cancel')} data-testid="cb-contact-ops">
              Contact ops
            </Button>
            <Button onClick={closeOk} data-testid="cb-return-dashboard">
              Return to dashboard
            </Button>
          </Group>
        </ScrollArea>
      </Modal>
    </Stack>
  );
}
