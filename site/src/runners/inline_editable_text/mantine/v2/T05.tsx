'use client';

/**
 * inline_editable_text-mantine-v2-T05: Owner tag in compact table strip
 *
 * A compact high-contrast Mantine Table near the bottom-left shows two rows:
 * "Gateway" and "Billing", with columns "Service", "Owner tag", and "State".
 * The Owner tag cells use Text-to-TextInput inline-edit with small ActionIcons.
 * Row-level Save buttons commit only the row they belong to.
 * Initial Owner tag values: Gateway="ops-main", Billing="finops".
 *
 * Success: Gateway/Owner tag committed value === "SRE / EU-1", display mode,
 *          Billing/Owner tag remains "finops".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, Text, TextInput, ActionIcon, Group, Table, Badge,
  MantineProvider,
} from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface CellProps {
  value: string;
  onCommit: (v: string) => void;
  testId: string;
}

function EditableCell({ value, onCommit, testId }: CellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => { setDraft(value); setEditing(true); };
  const save = () => { onCommit(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <Box data-testid={testId} data-mode={editing ? 'editing' : 'display'} data-value={value}>
      {editing ? (
        <Group gap={4} wrap="nowrap">
          <TextInput
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            size="xs"
            style={{ flex: 1, minWidth: 100 }}
            data-testid={`${testId}-input`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
          />
          <ActionIcon variant="filled" color="blue" size="xs" onClick={save} aria-label="Save" data-testid={`${testId}-save`}>
            <IconCheck size={12} />
          </ActionIcon>
          <ActionIcon variant="default" size="xs" onClick={cancel} aria-label="Cancel" data-testid={`${testId}-cancel`}>
            <IconX size={12} />
          </ActionIcon>
        </Group>
      ) : (
        <Group gap={4} style={{ cursor: 'pointer' }} onClick={startEdit} data-testid={`${testId}-display`}>
          <Text size="xs">{value}</Text>
          <ActionIcon variant="subtle" size="xs"><IconPencil size={10} /></ActionIcon>
        </Group>
      )}
    </Box>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [gatewayTag, setGatewayTag] = useState('ops-main');
  const [billingTag, setBillingTag] = useState('finops');
  const successFired = useRef(false);

  useEffect(() => {
    if (
      gatewayTag === 'SRE / EU-1' &&
      billingTag === 'finops' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [gatewayTag, billingTag, onSuccess]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box p="md" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', minHeight: 400 }}>
        <Card shadow="sm" padding="sm" radius="md" withBorder w={480} bg="dark.7">
          <Group gap="xs" mb="sm">
            <Text fw={600} size="sm">Incident tags</Text>
            <Badge size="xs" variant="light" color="red">live</Badge>
          </Group>

          <Table striped highlightOnHover withTableBorder withColumnBorders fz="xs" data-testid="incident-tags-table">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 100 }}>Service</Table.Th>
                <Table.Th>Owner tag</Table.Th>
                <Table.Th style={{ width: 80 }}>State</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td><Text size="xs" fw={500}>Gateway</Text></Table.Td>
                <Table.Td>
                  <EditableCell value={gatewayTag} onCommit={setGatewayTag} testId="editable-gateway-owner-tag" />
                </Table.Td>
                <Table.Td><Badge size="xs" color="green">active</Badge></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text size="xs" fw={500}>Billing</Text></Table.Td>
                <Table.Td>
                  <EditableCell value={billingTag} onCommit={setBillingTag} testId="editable-billing-owner-tag" />
                </Table.Td>
                <Table.Td><Badge size="xs" color="yellow">degraded</Badge></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Card>
      </Box>
    </MantineProvider>
  );
}
