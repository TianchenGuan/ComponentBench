'use client';

/**
 * dialog_modal-mantine-v2-T12: Modal.Stack — full-screen Focus preview child; Done reviewing; Asset review parent stays open
 */

import React, { useEffect, useRef } from 'react';
import { Button, Card, Group, Modal, Stack, Text } from '@mantine/core';
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

export default function T12({ onSuccess }: TaskComponentProps) {
  const stack = useModalsStack(['assetReview', 'focusPreview'] as const);
  const doneRef = useRef(false);
  const escapeRef = useRef(false);
  const prevChildOpen = useRef(false);
  const successRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const parent = stack.register('assetReview');
  const child = stack.register('focusPreview');

  useWindowEvent(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && stack.state.focusPreview) {
        escapeRef.current = true;
      }
    },
    { capture: true }
  );

  useEffect(() => {
    const ar = stack.state.assetReview;
    const fp = stack.state.focusPreview;

    if (prevChildOpen.current && !fp) {
      const reason: ModalState['close_reason'] = doneRef.current
        ? 'done_button'
        : escapeRef.current
          ? 'escape_key'
          : 'close_button';
      doneRef.current = false;
      escapeRef.current = false;

      patch({
        open: ar,
        close_reason: reason,
        modal_instance: 'Focus preview',
        last_opened_instance: 'Focus preview',
        related_instances: {
          'Asset review': { open: ar },
          'Focus preview': { open: false },
        },
      });

      if (reason === 'done_button' && ar && !successRef.current) {
        successRef.current = true;
        setTimeout(() => onSuccessRef.current(), 100);
      }
    } else {
      patch({
        open: fp || ar,
        close_reason: null,
        modal_instance: fp ? 'Focus preview' : ar ? 'Asset review' : null,
        last_opened_instance: fp ? 'Focus preview' : ar ? 'Asset review' : null,
        related_instances: {
          'Asset review': { open: ar },
          'Focus preview': { open: fp },
        },
      });
    }

    prevChildOpen.current = fp;
  }, [stack.state]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={440}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Media library
        </Text>
        <Button onClick={() => stack.open('assetReview')} data-testid="cb-start-asset-review">
          Start asset review
        </Button>
      </Stack>

      <Modal.Stack>
        <Modal {...parent} title="Asset review" centered data-testid="modal-asset-review">
          <Text size="sm" mb="md">
            Inspect assets before publishing.
          </Text>
          <Button variant="light" onClick={() => stack.open('focusPreview')} data-testid="cb-open-focus-preview">
            Open focus preview
          </Button>
        </Modal>

        <Modal
          {...child}
          fullScreen
          closeOnClickOutside={false}
          closeOnEscape={false}
          title={
            <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
              <Text fw={600}>Focus preview</Text>
              <Button
                size="xs"
                onMouseDown={() => {
                  doneRef.current = true;
                }}
                onClick={() => child.onClose()}
                data-testid="cb-done-reviewing"
              >
                Done reviewing
              </Button>
            </Group>
          }
          data-testid="modal-focus-preview"
        >
          <Text size="sm">Near full-viewport preview. Finish with the header action.</Text>
        </Modal>
      </Modal.Stack>
    </Card>
  );
}
