'use client';

/**
 * time_picker-mantine-v2-T40: SLA cutoff in a compact bottom-corner row with sibling preservation
 *
 * Two-row SLA table: Standard 17:30, Enterprise 18:00; row Save commits that row only.
 *
 * Success: Enterprise 18:40 after its Save; Standard stays 17:30.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Text, Badge, Group, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../../types';

function normHm(s: string) {
  if (!s) return '';
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return s.trim();
  return `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}`;
}

export default function T40({ onSuccess }: TaskComponentProps) {
  const [draftStd, setDraftStd] = useState('17:30');
  const [draftEnt, setDraftEnt] = useState('18:00');
  const [comStd, setComStd] = useState('17:30');
  const [comEnt, setComEnt] = useState('18:00');
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (normHm(comEnt) === '18:40' && normHm(comStd) === '17:30') {
      fired.current = true;
      onSuccess();
    }
  }, [comStd, comEnt, onSuccess]);

  return (
    <Stack gap="xs" maw={480}>
      <Text fw={600} size="sm">
        SLA cutoffs
      </Text>
      <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs" fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Tier</Table.Th>
            <Table.Th>Cutoff time</Table.Th>
            <Table.Th style={{ width: 88 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Group gap={6}>
                <Text size="xs">Standard</Text>
                <Badge size="xs" variant="light">
                  Base
                </Badge>
              </Group>
            </Table.Td>
            <Table.Td>
              <TimeInput
                value={draftStd}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftStd(e.currentTarget.value)}
                size="xs"
                data-testid="cutoff-standard"
              />
            </Table.Td>
            <Table.Td>
              <Button
                size="compact-xs"
                variant="light"
                onClick={() => setComStd(draftStd)}
                data-testid="save-standard-row"
              >
                Save
              </Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Group gap={6}>
                <Text size="xs">Enterprise</Text>
                <Badge size="xs" color="violet">
                  Plus
                </Badge>
              </Group>
            </Table.Td>
            <Table.Td>
              <TimeInput
                value={draftEnt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftEnt(e.currentTarget.value)}
                size="xs"
                data-testid="cutoff-enterprise"
              />
            </Table.Td>
            <Table.Td>
              <Button
                size="compact-xs"
                onClick={() => setComEnt(draftEnt)}
                data-testid="save-enterprise-row"
              >
                Save
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Text size="xs" c="dimmed">
        Set Enterprise to 18:40 and Save that row only.
      </Text>
    </Stack>
  );
}
