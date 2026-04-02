'use client';

/**
 * date_picker_single-mantine-v2-T09: INV-204 invoice date DD/MM/YYYY + row Apply
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Table, Button, Group, Badge } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { TaskComponentProps } from '../../types';

dayjs.extend(customParseFormat);

const novStart = new Date(2026, 10, 1);
const novEnd = new Date(2026, 10, 30, 23, 59, 59, 999);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [draft203, setDraft203] = useState<Date | null>(dayjs('2026-11-05').toDate());
  const [draft204, setDraft204] = useState<Date | null>(null);
  const [applied203, setApplied203] = useState('2026-11-05');
  const [applied204, setApplied204] = useState<string | null>(null);

  useEffect(() => {
    if (applied204 === '2026-11-23' && applied203 === '2026-11-05') {
      onSuccess();
    }
  }, [applied203, applied204, onSuccess]);

  const parseDmY = (input: string): Date | null => {
    const p = dayjs(input.trim(), 'DD/MM/YYYY', true);
    return p.isValid() ? p.toDate() : null;
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder maw={560}>
      <Group mb="md" gap="xs" wrap="wrap">
        <Badge>AR</Badge>
        <Badge variant="light">November 2026</Badge>
      </Group>
      <Text fw={600} mb="sm">
        Invoices
      </Text>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Invoice</Table.Th>
            <Table.Th>Invoice date</Table.Th>
            <Table.Th w={100} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr data-testid="row-inv-203">
            <Table.Td>INV-203</Table.Td>
            <Table.Td>
              <DateInput
                value={draft203}
                onChange={setDraft203}
                valueFormat="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                dateParser={parseDmY}
                minDate={novStart}
                maxDate={novEnd}
                size="xs"
                data-testid="invoice-date-203"
              />
            </Table.Td>
            <Table.Td>
              <Button
                size="compact-xs"
                onClick={() => {
                  if (draft203) setApplied203(dayjs(draft203).format('YYYY-MM-DD'));
                }}
                data-testid="apply-inv-203"
              >
                Apply
              </Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr data-testid="row-inv-204">
            <Table.Td>INV-204</Table.Td>
            <Table.Td>
              <DateInput
                value={draft204}
                onChange={setDraft204}
                valueFormat="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                dateParser={parseDmY}
                minDate={novStart}
                maxDate={novEnd}
                size="xs"
                data-testid="invoice-date-204"
              />
            </Table.Td>
            <Table.Td>
              <Button
                size="compact-xs"
                onClick={() =>
                  setApplied204(draft204 ? dayjs(draft204).format('YYYY-MM-DD') : null)
                }
                data-testid="apply-inv-204"
              >
                Apply
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Text size="xs" c="dimmed" mt="sm">
        Enter dates as DD/MM/YYYY (November 2026 only).
      </Text>
    </Card>
  );
}
