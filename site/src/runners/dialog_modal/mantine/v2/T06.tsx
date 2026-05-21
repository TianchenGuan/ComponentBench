'use client';

/**
 * dialog_modal-mantine-v2-T06: Modal.Stack — Escape closes child Discard draft only; Filters parent stays open
 */

import React, { useEffect, useRef } from 'react';
import { Button, Card, Modal, Stack, Text } from '@mantine/core';
import { useModalsStack } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';
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

export default function T06({ onSuccess }: TaskComponentProps) {
  const stack = useModalsStack(['filters', 'discardDraft'] as const);
  const escapeRef = useRef(false);
  const prevChildOpen = useRef(false);
  const successRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const filters = stack.register('filters');
  const child = stack.register('discardDraft');

  useWindowEvent(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && stack.state.discardDraft) {
        escapeRef.current = true;
      }
    },
    { capture: true }
  );

  useEffect(() => {
    const fl = stack.state.filters;
    const ch = stack.state.discardDraft;

    if (prevChildOpen.current && !ch) {
      const reason: ModalState['close_reason'] = escapeRef.current ? 'escape_key' : 'close_button';
      escapeRef.current = false;

      patch({
        open: fl,
        close_reason: reason,
        modal_instance: 'Discard draft',
        last_opened_instance: 'Discard draft',
        related_instances: {
          Filters: { open: fl },
          'Discard draft': { open: false },
        },
      });

      if (fl && !successRef.current) {
        successRef.current = true;
        setTimeout(() => onSuccessRef.current(), 100);
      }
    } else {
      patch({
        open: ch || fl,
        close_reason: null,
        modal_instance: ch ? 'Discard draft' : fl ? 'Filters' : null,
        last_opened_instance: ch ? 'Discard draft' : fl ? 'Filters' : null,
        related_instances: {
          Filters: { open: fl },
          'Discard draft': { open: ch },
        },
      });
    }

    prevChildOpen.current = ch;
  }, [stack.state]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={420}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          List filters
        </Text>
        <Button onClick={() => stack.open('filters')} data-testid="cb-open-filters">
          Open filters
        </Button>
      </Stack>

      <Modal.Stack>
        <Modal {...filters} title="Filters" centered data-testid="modal-filters">
          <Text size="sm" mb="md">
            Narrow results with saved filter presets.
          </Text>
          <Button onClick={() => stack.open('discardDraft')} data-testid="cb-discard-draft">
            Discard draft…
          </Button>
        </Modal>

        <Modal
          {...child}
          title="Discard draft"
          centered
          closeOnClickOutside={false}
          closeOnEscape
          data-testid="modal-discard-draft"
        >
          <Text size="sm">Press Escape to cancel and return to filters.</Text>
        </Modal>
      </Modal.Stack>
    </Card>
  );
}
