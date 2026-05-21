'use client';

/**
 * listbox_multi-mantine-v2-T16: APAC reminder channels row checklist
 *
 * Table with two expanded row-detail panels (EMEA, APAC). Each has a "Channels" checklist
 * and a row-local "Save row" button. APAC is TARGET.
 * APAC initial: SMS. EMEA initial: Email (must remain unchanged).
 * Target APAC: Email, Pager, Slack. Confirm via "Save row" for APAC.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, Checkbox, Stack, Button, Table, Group, Badge, Collapse, ActionIcon,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const channelOptions = ['Email', 'Pager', 'Slack', 'SMS', 'Phone tree'];

const targetSet = ['Email', 'Pager', 'Slack'];
const emeaInitial = ['Email'];

interface RowDetailProps {
  region: string;
  selected: string[];
  onChange: (vals: string[]) => void;
  onSave: () => void;
  defaultOpen: boolean;
}

function RowDetail({ region, selected, onChange, onSave, defaultOpen }: RowDetailProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Table.Tr>
        <Table.Td>
          <ActionIcon variant="subtle" size="sm" onClick={() => setOpen(!open)}>
            {open ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          </ActionIcon>
        </Table.Td>
        <Table.Td>{region}</Table.Td>
        <Table.Td><Badge size="sm" color="green">Active</Badge></Table.Td>
      </Table.Tr>
      {open && (
        <Table.Tr>
          <Table.Td colSpan={3} style={{ paddingLeft: 32 }}>
            <Text fw={500} size="sm" mb={6}>Channels</Text>
            <Checkbox.Group value={selected} onChange={onChange}>
              <Stack gap="xs">
                {channelOptions.map(opt => <Checkbox key={opt} value={opt} label={opt} />)}
              </Stack>
            </Checkbox.Group>
            <Group mt="sm">
              <Button
                size="xs"
                data-testid={`save-row-${region.toLowerCase()}`}
                onClick={onSave}
              >
                Save row
              </Button>
            </Group>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
}

export default function T16({ onSuccess }: TaskComponentProps) {
  const [apacChannels, setApacChannels] = useState<string[]>(['SMS']);
  const [emeaChannels, setEmeaChannels] = useState<string[]>(['Email']);
  const [apacSaved, setApacSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (apacSaved && setsEqual(apacChannels, targetSet) && setsEqual(emeaChannels, emeaInitial)) {
      successFired.current = true;
      onSuccess();
    }
  }, [apacSaved, apacChannels, emeaChannels, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 560 }}>
        <Text fw={600} size="lg" mb={4}>Regional reminders</Text>
        <Text size="sm" c="dimmed" mb="md">Configure reminder channels per region</Text>
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }} />
              <Table.Th>Region</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <RowDetail
              region="EMEA"
              selected={emeaChannels}
              onChange={(vals) => setEmeaChannels(vals)}
              onSave={() => {}}
              defaultOpen
            />
            <RowDetail
              region="APAC"
              selected={apacChannels}
              onChange={(vals) => { setApacChannels(vals); setApacSaved(false); }}
              onSave={() => setApacSaved(true)}
              defaultOpen
            />
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
