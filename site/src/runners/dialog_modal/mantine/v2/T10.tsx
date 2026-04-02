'use client';

/**
 * dialog_modal-mantine-v2-T10: Modal.Stack — child Update guide scroll + Return to settings; Project settings parent stays open
 */

import React, { useEffect, useRef } from 'react';
import { Button, Card, Modal, ScrollArea, Stack, Text } from '@mantine/core';
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

const GUIDE = Array.from({ length: 18 }, (_, i) => (
  <Text key={i} size="sm" mb="sm">
    Update guide section {i + 1}: rollout steps, verification, and rollback. Scroll to the bottom
    of this dialog for the return action.
  </Text>
));

export default function T10({ onSuccess }: TaskComponentProps) {
  const stack = useModalsStack(['projectSettings', 'updateGuide'] as const);
  const returnRef = useRef(false);
  const iconRef = useRef(false);
  const escapeRef = useRef(false);
  const prevChildOpen = useRef(false);
  const successRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const parent = stack.register('projectSettings');
  const child = stack.register('updateGuide');

  useWindowEvent(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && stack.state.updateGuide) {
        escapeRef.current = true;
      }
    },
    { capture: true }
  );

  useEffect(() => {
    const ps = stack.state.projectSettings;
    const ug = stack.state.updateGuide;

    if (prevChildOpen.current && !ug) {
      const reason: ModalState['close_reason'] = returnRef.current
        ? 'return_to_settings_button'
        : iconRef.current
          ? 'close_icon'
          : escapeRef.current
            ? 'escape_key'
            : 'close_button';
      returnRef.current = false;
      iconRef.current = false;
      escapeRef.current = false;

      patch({
        open: ps,
        close_reason: reason,
        modal_instance: 'Update guide',
        last_opened_instance: 'Update guide',
        related_instances: {
          'Project settings': { open: ps },
          'Update guide': { open: false },
        },
      });

      if (reason === 'return_to_settings_button' && ps && !successRef.current) {
        successRef.current = true;
        setTimeout(() => onSuccessRef.current(), 100);
      }
    } else {
      patch({
        open: ug || ps,
        close_reason: null,
        modal_instance: ug ? 'Update guide' : ps ? 'Project settings' : null,
        last_opened_instance: ug ? 'Update guide' : ps ? 'Project settings' : null,
        related_instances: {
          'Project settings': { open: ps },
          'Update guide': { open: ug },
        },
      });
    }

    prevChildOpen.current = ug;
  }, [stack.state]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={440}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Project
        </Text>
        <Button onClick={() => stack.open('projectSettings')} data-testid="cb-open-project-settings">
          Open project settings
        </Button>
      </Stack>

      <Modal.Stack>
        <Modal {...parent} title="Project settings" centered data-testid="modal-project-settings">
          <Text size="sm" mb="md">
            Repository defaults and review policies.
          </Text>
          <Button variant="light" onClick={() => stack.open('updateGuide')} data-testid="cb-open-update-guide">
            Open update guide
          </Button>
        </Modal>

        <Modal
          {...child}
          title="Update guide"
          centered
          withCloseButton
          closeOnClickOutside={false}
          closeOnEscape={false}
          closeButtonProps={{
            onMouseDown: () => {
              iconRef.current = true;
            },
          }}
          data-testid="modal-update-guide"
        >
          <ScrollArea h={240} type="auto" data-testid="cb-update-guide-scroll">
            <Stack gap={0}>{GUIDE}</Stack>
            <Button
              mt="md"
              onMouseDown={() => {
                returnRef.current = true;
              }}
              onClick={() => child.onClose()}
              data-testid="cb-return-to-settings"
            >
              Return to settings
            </Button>
          </ScrollArea>
        </Modal>
      </Modal.Stack>
    </Card>
  );
}
