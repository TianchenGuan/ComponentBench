'use client';

/**
 * dialog_modal-mantine-v2-T03: Changelog — scroll body, "Back to app"
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Group, Modal, ScrollArea, Stack, Text } from '@mantine/core';
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

const PARAS = Array.from({ length: 24 }, (_, i) => (
  <Text key={i} size="sm" mb="sm">
    Section {i + 1}: interface updates, stability fixes, and accessibility tweaks shipped in this
    release. Scroll to the end of the changelog to continue.
  </Text>
));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successRef = useRef(false);

  const open = () => {
    setOpened(true);
    patch({
      open: true,
      close_reason: null,
      modal_instance: 'Changelog',
      last_opened_instance: 'Changelog',
    });
  };

  const closeHeader = () => {
    setOpened(false);
    patch({
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Changelog',
      last_opened_instance: 'Changelog',
    });
  };

  const closeBack = () => {
    setOpened(false);
    patch({
      open: false,
      close_reason: 'back_to_app_button',
      modal_instance: 'Changelog',
      last_opened_instance: 'Changelog',
    });
    if (!successRef.current) {
      successRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400}>
      <Stack gap="md">
        <Text fw={600}>About this workspace</Text>
        <Text size="sm" c="dimmed">
          Product updates and rollout notes.
        </Text>
        <Button onClick={open} data-testid="cb-open-changelog">
          Open Changelog
        </Button>
      </Stack>

      <Modal
        opened={opened}
        onClose={closeHeader}
        title="Changelog"
        centered
        withCloseButton
        closeOnClickOutside={false}
        closeOnEscape={false}
        data-testid="modal-changelog"
      >
        <ScrollArea h={280} type="auto" data-testid="cb-changelog-scroll">
          <Stack gap={0}>{PARAS}</Stack>
          <Group justify="flex-end" mt="md">
            <Button onClick={closeBack} data-testid="cb-back-to-app">
              Back to app
            </Button>
          </Group>
        </ScrollArea>
      </Modal>
    </Card>
  );
}
