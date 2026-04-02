'use client';

/**
 * dialog_modal-mantine-v2-T08: Nested page scroll + modal — scroll dialog body, Acknowledge
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Modal, ScrollArea, Stack, Text } from '@mantine/core';
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

const FILL = Array.from({ length: 8 }, (_, i) => (
  <Card key={i} withBorder padding="sm" mb="xs">
    <Text size="sm">Background card {i + 1} — unrelated workspace metrics.</Text>
  </Card>
));

const POLICY = Array.from({ length: 22 }, (_, i) => (
  <Text key={i} size="sm" mb="sm">
    Policy clause {i + 1}: obligations, retention, and acceptable use. Keep scrolling inside this
    dialog until the acknowledgement control appears.
  </Text>
));

export default function T08({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successRef = useRef(false);

  const open = () => {
    setOpened(true);
    patch({
      open: true,
      close_reason: null,
      modal_instance: 'Review policy',
      last_opened_instance: 'Review policy',
    });
  };

  const closeHeader = () => {
    setOpened(false);
    patch({
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Review policy',
      last_opened_instance: 'Review policy',
    });
  };

  const acknowledge = () => {
    setOpened(false);
    patch({
      open: false,
      close_reason: 'acknowledge_button',
      modal_instance: 'Review policy',
      last_opened_instance: 'Review policy',
    });
    if (!successRef.current) {
      successRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <ScrollArea h={420} type="scroll" data-testid="cb-page-scroll">
      <Stack gap="xs" p="xs" maw={460}>
        {FILL}
        <Card withBorder padding="md">
          <Text fw={500} mb="xs">
            Compliance
          </Text>
          <Button onClick={open} data-testid="cb-open-review-policy">
            Open Review policy
          </Button>
        </Card>
        {FILL}
      </Stack>

      <Modal
        opened={opened}
        onClose={closeHeader}
        title="Review policy"
        centered={false}
        yOffset="6vh"
        withCloseButton
        closeOnClickOutside={false}
        closeOnEscape={false}
        data-testid="modal-review-policy"
      >
        <ScrollArea h={260} type="auto" data-testid="cb-policy-scroll">
          <Stack gap={0}>{POLICY}</Stack>
          <Button mt="md" onClick={acknowledge} data-testid="cb-acknowledge">
            Acknowledge
          </Button>
        </ScrollArea>
      </Modal>
    </ScrollArea>
  );
}
