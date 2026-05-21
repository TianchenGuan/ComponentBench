'use client';

/**
 * dialog_modal-mantine-v2-T01: Gateway row backdrop-only dismissal
 */

import React, { useRef, useState } from 'react';
import { Button, Group, Modal, Stack, Table, Text, Badge } from '@mantine/core';
import '@mantine/core/styles.css';
import type { ModalState, TaskComponentProps } from '../../types';

type RowKey = 'gateway' | 'billing' | 'search' | null;

const INSTANCE: Record<Exclude<RowKey, null>, string> = {
  gateway: 'Gateway preview',
  billing: 'Billing preview',
  search: 'Search preview',
};

function setModalState(partial: Partial<ModalState>) {
  const prev = window.__cbModalState;
  window.__cbModalState = {
    open: partial.open ?? prev?.open ?? false,
    close_reason: partial.close_reason ?? prev?.close_reason ?? null,
    modal_instance: partial.modal_instance ?? partial.last_opened_instance ?? prev?.modal_instance ?? null,
    last_opened_instance: partial.last_opened_instance ?? partial.modal_instance ?? prev?.last_opened_instance ?? null,
    related_instances: partial.related_instances ?? prev?.related_instances,
  };
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState<RowKey>(null);
  const closeIntentRef = useRef<'backdrop' | null>(null);
  const successRef = useRef(false);

  const openRow = (key: Exclude<RowKey, null>) => {
    setOpen(key);
    setModalState({
      open: true,
      close_reason: null,
      modal_instance: INSTANCE[key],
      last_opened_instance: INSTANCE[key],
    });
  };

  const handleClose = () => {
    const inst = open ? INSTANCE[open] : null;
    const reason =
      closeIntentRef.current === 'backdrop' ? 'backdrop_click' : ('close_button' as const);
    closeIntentRef.current = null;
    setOpen(null);

    setModalState({
      open: false,
      close_reason: reason,
      modal_instance: inst,
      last_opened_instance: inst,
    });

    if (
      reason === 'backdrop_click' &&
      inst === 'Gateway preview' &&
      !successRef.current
    ) {
      successRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const overlayProps = {
    onPointerDownCapture: () => {
      if (open) closeIntentRef.current = 'backdrop';
    },
  };

  return (
    <Stack gap="xs" style={{ maxWidth: 520 }}>
      <Group gap={6} wrap="wrap">
        <Badge size="xs" variant="light">
          Live
        </Badge>
        <Badge size="xs" variant="outline">
          Staging
        </Badge>
        <Badge size="xs" variant="dot">
          EU
        </Badge>
        <Badge size="xs" variant="dot">
          US
        </Badge>
        <Text size="xs" c="dimmed">
          Filters: all regions
        </Text>
      </Group>
      <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs" fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Service</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ width: 120 }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Gateway</Table.Td>
            <Table.Td>OK</Table.Td>
            <Table.Td>
              <Button
                size="compact-xs"
                variant="light"
                onClick={() => openRow('gateway')}
                data-testid="cb-preview-gateway"
              >
                Preview dialog
              </Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Billing</Table.Td>
            <Table.Td>Degraded</Table.Td>
            <Table.Td>
              <Button
                size="compact-xs"
                variant="light"
                onClick={() => openRow('billing')}
                data-testid="cb-preview-billing"
              >
                Preview dialog
              </Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Search</Table.Td>
            <Table.Td>OK</Table.Td>
            <Table.Td>
              <Button
                size="compact-xs"
                variant="light"
                onClick={() => openRow('search')}
                data-testid="cb-preview-search"
              >
                Preview dialog
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Modal
        opened={open === 'gateway'}
        onClose={handleClose}
        title="Gateway preview"
        size="sm"
        centered
        closeOnClickOutside
        closeOnEscape={false}
        overlayProps={overlayProps}
        data-testid="modal-gateway-preview"
      >
        <Text size="sm">Gateway traffic is healthy. Edge nodes responding within SLO.</Text>
      </Modal>

      <Modal
        opened={open === 'billing'}
        onClose={handleClose}
        title="Billing preview"
        size="sm"
        centered
        closeOnClickOutside
        closeOnEscape={false}
        overlayProps={overlayProps}
        data-testid="modal-billing-preview"
      >
        <Text size="sm">Billing pipeline latency elevated. Retries enabled.</Text>
      </Modal>

      <Modal
        opened={open === 'search'}
        onClose={handleClose}
        title="Search preview"
        size="sm"
        centered
        closeOnClickOutside
        closeOnEscape={false}
        overlayProps={overlayProps}
        data-testid="modal-search-preview"
      >
        <Text size="sm">Search index rebuilt. Freshness within 2 minutes.</Text>
      </Modal>
    </Stack>
  );
}
