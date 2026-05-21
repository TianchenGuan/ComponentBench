'use client';

/**
 * dialog_modal-mantine-v2-T07: Modal.Stack — child Details closed via header × only; Layout settings parent stays open
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

export default function T07({ onSuccess }: TaskComponentProps) {
  const stack = useModalsStack(['layoutSettings', 'details'] as const);
  const iconRef = useRef(false);
  const escapeRef = useRef(false);
  const prevChildOpen = useRef(false);
  const successRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const parent = stack.register('layoutSettings');
  const child = stack.register('details');

  useWindowEvent(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && stack.state.details) {
        escapeRef.current = true;
      }
    },
    { capture: true }
  );

  useEffect(() => {
    const pa = stack.state.layoutSettings;
    const ch = stack.state.details;

    if (prevChildOpen.current && !ch) {
      const reason: ModalState['close_reason'] = iconRef.current
        ? 'close_icon'
        : escapeRef.current
          ? 'escape_key'
          : 'close_button';
      iconRef.current = false;
      escapeRef.current = false;

      patch({
        open: pa,
        close_reason: reason,
        modal_instance: 'Details',
        last_opened_instance: 'Details',
        related_instances: {
          'Layout settings': { open: pa },
          Details: { open: false },
        },
      });

      if (reason === 'close_icon' && pa && !successRef.current) {
        successRef.current = true;
        setTimeout(() => onSuccessRef.current(), 100);
      }
    } else {
      patch({
        open: ch || pa,
        close_reason: null,
        modal_instance: ch ? 'Details' : pa ? 'Layout settings' : null,
        last_opened_instance: ch ? 'Details' : pa ? 'Layout settings' : null,
        related_instances: {
          'Layout settings': { open: pa },
          Details: { open: ch },
        },
      });
    }

    prevChildOpen.current = ch;
  }, [stack.state]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={420}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Canvas
        </Text>
        <Button onClick={() => stack.open('layoutSettings')} data-testid="cb-open-layout-settings">
          Open layout settings
        </Button>
      </Stack>

      <Modal.Stack>
        <Modal {...parent} title="Layout settings" centered data-testid="modal-layout-settings">
          <Text size="sm" mb="md">
            Grid density and column widths.
          </Text>
          <Button variant="light" onClick={() => stack.open('details')} data-testid="cb-open-details">
            Open details
          </Button>
        </Modal>

        <Modal
          {...child}
          title="Details"
          centered
          withCloseButton
          closeOnClickOutside={false}
          closeOnEscape={false}
          closeButtonProps={{
            onMouseDown: () => {
              iconRef.current = true;
            },
          }}
          data-testid="modal-details"
        >
          <Text size="sm">Extra layout metadata. Close using the header × control.</Text>
        </Modal>
      </Modal.Stack>
    </Card>
  );
}
