'use client';

/**
 * dialog_modal-mantine-v2-T11: Open Billing address row, Escape-close only
 */

import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Group, Modal, Stack, Text } from '@mantine/core';
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

type Which = 'shipping' | 'billing' | 'office' | null;

const TITLE: Record<Exclude<Which, null>, string> = {
  shipping: 'Shipping address',
  billing: 'Billing address',
  office: 'Office address',
};

export default function T11({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState<Which>(null);
  const escapeRef = useRef(false);
  const prevOpen = useRef<Which | null>(null);
  const successRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useWindowEvent(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && open === 'billing') {
        escapeRef.current = true;
      }
    },
    { capture: true }
  );

  useEffect(() => {
    if (prevOpen.current === 'billing' && open === null) {
      const reason: ModalState['close_reason'] = escapeRef.current ? 'escape_key' : 'close_button';
      escapeRef.current = false;
      patch({
        open: false,
        close_reason: reason,
        modal_instance: 'Billing address',
        last_opened_instance: 'Billing address',
      });
      if (!successRef.current) {
        successRef.current = true;
        setTimeout(() => onSuccessRef.current(), 100);
      }
    } else if (open) {
      patch({
        open: true,
        close_reason: null,
        modal_instance: TITLE[open],
        last_opened_instance: TITLE[open],
      });
    } else if (!open && prevOpen.current && prevOpen.current !== 'billing') {
      patch({
        open: false,
        close_reason: 'cancel',
        modal_instance: TITLE[prevOpen.current],
        last_opened_instance: TITLE[prevOpen.current],
      });
    }
    prevOpen.current = open;
  }, [open]);

  const handleClose = (w: Which) => {
    setOpen((cur) => (cur === w ? null : cur));
  };

  return (
    <Stack gap="sm" maw={520}>
      <Group gap={6} wrap="wrap">
        <Badge variant="light">Accounts</Badge>
        <Badge variant="outline">Billing</Badge>
        <Text size="xs" c="dimmed">
          Customer workspace
        </Text>
      </Group>
      <Card withBorder padding="md">
        <Text fw={600} mb="sm">
          Addresses
        </Text>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm">Shipping address</Text>
            <Button size="xs" variant="light" onClick={() => setOpen('shipping')} data-testid="cb-edit-shipping">
              Edit
            </Button>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Billing address</Text>
            <Button size="xs" variant="light" onClick={() => setOpen('billing')} data-testid="cb-edit-billing">
              Edit
            </Button>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Office address</Text>
            <Button size="xs" variant="light" onClick={() => setOpen('office')} data-testid="cb-edit-office">
              Edit
            </Button>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={open === 'shipping'}
        onClose={() => handleClose('shipping')}
        title="Shipping address"
        centered
        closeOnClickOutside={false}
        closeOnEscape
        data-testid="modal-shipping"
      >
        <Text size="sm">Update where physical goods ship.</Text>
      </Modal>
      <Modal
        opened={open === 'billing'}
        onClose={() => handleClose('billing')}
        title="Billing address"
        centered
        closeOnClickOutside={false}
        closeOnEscape
        data-testid="modal-billing"
      >
        <Text size="sm">Used for invoices and tax documents.</Text>
      </Modal>
      <Modal
        opened={open === 'office'}
        onClose={() => handleClose('office')}
        title="Office address"
        centered
        closeOnClickOutside={false}
        closeOnEscape
        data-testid="modal-office"
      >
        <Text size="sm">Registered office location.</Text>
      </Modal>
    </Stack>
  );
}
