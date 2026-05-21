'use client';

/**
 * dialog_modal-mantine-v2-T05: Modal.Stack — backdrop-dismiss child only, parent Settings stays open
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

export default function T05({ onSuccess }: TaskComponentProps) {
  const stack = useModalsStack(['settings', 'deleteAutomation'] as const);
  const backdropRef = useRef(false);
  const escapeRef = useRef(false);
  const prevChildOpen = useRef(false);
  const successRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const settings = stack.register('settings');
  const child = stack.register('deleteAutomation');

  useWindowEvent(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && stack.state.deleteAutomation) {
        escapeRef.current = true;
      }
    },
    { capture: true }
  );

  useEffect(() => {
    const st = stack.state.settings;
    const del = stack.state.deleteAutomation;

    if (prevChildOpen.current && !del) {
      const reason: ModalState['close_reason'] = backdropRef.current
        ? 'backdrop_click'
        : escapeRef.current
          ? 'escape_key'
          : 'close_button';
      backdropRef.current = false;
      escapeRef.current = false;

      patch({
        open: st,
        close_reason: reason,
        modal_instance: 'Delete automation',
        last_opened_instance: 'Delete automation',
        related_instances: {
          Settings: { open: st },
          'Delete automation': { open: false },
        },
      });

      if (reason === 'backdrop_click' && st && !successRef.current) {
        successRef.current = true;
        setTimeout(() => onSuccessRef.current(), 100);
      }
    } else {
      patch({
        open: del || st,
        close_reason: null,
        modal_instance: del ? 'Delete automation' : st ? 'Settings' : null,
        last_opened_instance: del ? 'Delete automation' : st ? 'Settings' : null,
        related_instances: {
          Settings: { open: st },
          'Delete automation': { open: del },
        },
      });
    }

    prevChildOpen.current = del;
  }, [stack.state]);

  const overlayProps = {
    onPointerDownCapture: () => {
      if (stack.state.deleteAutomation) {
        backdropRef.current = true;
      }
    },
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={420}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Workspace automation
        </Text>
        <Button onClick={() => stack.open('settings')} data-testid="cb-open-settings">
          Open settings
        </Button>
      </Stack>

      <Modal.Stack>
        <Modal {...settings} title="Settings" centered data-testid="modal-settings">
          <Text size="sm" mb="md">
            Manage automation rules and schedules.
          </Text>
          <Button
            color="red"
            variant="light"
            onClick={() => stack.open('deleteAutomation')}
            data-testid="cb-delete-automation"
          >
            Delete automation…
          </Button>
        </Modal>

        <Modal
          {...child}
          title="Delete automation"
          centered
          closeOnClickOutside
          closeOnEscape={false}
          overlayProps={overlayProps}
          data-testid="modal-delete-automation"
        >
          <Text size="sm">This removes the selected automation. Dismiss using the backdrop outside this dialog.</Text>
        </Modal>
      </Modal.Stack>
    </Card>
  );
}
