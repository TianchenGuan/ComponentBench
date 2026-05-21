'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T07
 * Modal + ScrollArea: Billing Address 344px ±6, then Save layout (require_confirm).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card, Group, Modal, ScrollArea, Stack, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const rows = [
  {
    id: '1',
    customer: 'Northwind',
    email: 'ops@nw.test',
    phone: '555-0101',
    shipping_address: 'Chicago, IL',
    billing_address: 'Chicago, IL',
    notes: 'VIP',
  },
  {
    id: '2',
    customer: 'Contoso',
    email: 'hello@co.test',
    phone: '555-0102',
    shipping_address: 'Austin, TX',
    billing_address: 'Austin, TX',
    notes: 'Net30',
  },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [draftBilling, setDraftBilling] = useState(268);
  const [committedBilling, setCommittedBilling] = useState(268);
  const [saveCount, setSaveCount] = useState(0);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const columns: Column[] = [
    { key: 'customer', label: 'Customer', width: 110 },
    { key: 'email', label: 'Email', width: 130 },
    { key: 'phone', label: 'Phone', width: 100 },
    { key: 'shipping_address', label: 'Shipping Address', width: 140 },
    { key: 'billing_address', label: 'Billing Address', width: draftBilling },
    { key: 'notes', label: 'Notes', width: 100 },
  ];

  const billingW = columns.find(c => c.key === 'billing_address')?.width ?? draftBilling;

  useEffect(() => {
    if (!successFired.current && saveCount > 0 && isWithinTolerance(committedBilling, 344, 6)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saveCount, committedBilling, onSuccess]);

  const handleMouseDown = useCallback(
    (key: string, e: React.MouseEvent) => {
      if (!modalOpen || key !== 'billing_address') return;
      e.preventDefault();
      setResizing({ key: 'billing_address', startX: e.clientX, startWidth: draftBilling });
      setTooltipWidth(draftBilling);
    },
    [modalOpen, draftBilling]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(80, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setDraftBilling(newWidth);
    };

    const handleMouseUp = () => {
      setResizing(null);
      setTooltipWidth(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  const openModal = () => {
    setDraftBilling(committedBilling);
    setModalOpen(true);
  };

  const handleCancel = () => {
    setDraftBilling(committedBilling);
    setModalOpen(false);
  };

  const handleSave = () => {
    setCommittedBilling(draftBilling);
    setSaveCount(c => c + 1);
    setModalOpen(false);
  };

  const tableMinWidth = 110 + 130 + 100 + 140 + draftBilling + 100;

  return (
    <Stack gap="md" maw={640} data-testid="rc-mantine-v2-t07">
      <Card withBorder padding="sm" radius="md">
        <Text fw={600} size="sm" mb="xs">
          Customers
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          Live grid · committed column layout is separate from the column editor.
        </Text>
        <Table striped highlightOnHover withTableBorder mb="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Region</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map(r => (
              <Table.Tr key={r.id}>
                <Table.Td>{r.customer}</Table.Td>
                <Table.Td>{r.email}</Table.Td>
                <Table.Td>—</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Button size="xs" onClick={openModal}>
          Edit customer columns
        </Button>
      </Card>

      <Modal opened={modalOpen} onClose={handleCancel} title="Edit customer columns" size="lg" padding="md">
        <Text size="xs" c="dimmed" mb="sm" data-testid="rc-width-billing-address">
          Billing Address width: {billingW}px
        </Text>
        <ScrollArea type="always" scrollbars="x" offsetScrollbars mah={280}>
          <Table striped highlightOnHover withTableBorder style={{ minWidth: tableMinWidth }}>
            <Table.Thead>
              <Table.Tr>
                {columns.map(col => (
                  <Table.Th
                    key={col.key}
                    style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '6px 8px' }}
                  >
                    {col.label}
                    {col.key === 'billing_address' ? (
                      <Tooltip
                        label={`${Math.round(tooltipWidth ?? col.width)}px`}
                        opened={resizing?.key === 'billing_address'}
                        position="top"
                      >
                        <div
                          data-testid="rc-handle-billing_address"
                          onMouseDown={e => handleMouseDown('billing_address', e)}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 12,
                            cursor: 'col-resize',
                            background:
                              resizing?.key === 'billing_address' ? 'rgba(34, 139, 230, 0.25)' : 'rgba(0,0,0,0.04)',
                            borderLeft: '1px solid var(--mantine-color-gray-4)',
                          }}
                        />
                      </Tooltip>
                    ) : null}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map(row => (
                <Table.Tr key={row.id}>
                  {columns.map(col => (
                    <Table.Td key={col.key} style={{ width: col.width, padding: '6px 8px' }}>
                      {row[col.key as keyof typeof row]}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        <Group justify="flex-end" mt="md" gap="sm">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save layout</Button>
        </Group>
      </Modal>
    </Stack>
  );
}
