'use client';

/**
 * data_table_filterable-mantine-v2-T15: Events table – July range in nested scroll panel
 *
 * A nested_scroll layout: the outer panel scrolls and inside sits a Mantine DataTable "Events"
 * with many columns. The Date header has a custom filter popover with two date inputs and an
 * "Apply filters" button. Target: Date between 2024-07-01 and 2024-07-31 inclusive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Button, Popover, Stack, Group, Badge, TextInput } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../../types';

interface EventRow {
  id: string;
  name: string;
  organizer: string;
  location: string;
  attendees: number;
  date: string;
}

const eventsData: EventRow[] = [
  { id: '1', name: 'Spring Kickoff', organizer: 'HR', location: 'NYC', attendees: 120, date: '2024-04-10' },
  { id: '2', name: 'Q2 Review', organizer: 'Finance', location: 'SF', attendees: 45, date: '2024-06-28' },
  { id: '3', name: 'Summer Social', organizer: 'Culture', location: 'Austin', attendees: 200, date: '2024-07-04' },
  { id: '4', name: 'Hackathon', organizer: 'Engineering', location: 'Remote', attendees: 80, date: '2024-07-15' },
  { id: '5', name: 'Product Launch', organizer: 'Marketing', location: 'NYC', attendees: 300, date: '2024-07-22' },
  { id: '6', name: 'Board Meeting', organizer: 'Executive', location: 'Chicago', attendees: 12, date: '2024-07-31' },
  { id: '7', name: 'Fall Planning', organizer: 'Operations', location: 'Denver', attendees: 60, date: '2024-08-14' },
  { id: '8', name: 'Q3 Kickoff', organizer: 'Sales', location: 'Boston', attendees: 90, date: '2024-09-02' },
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [appliedRange, setAppliedRange] = useState<[string, string] | null>(null);
  const [pendingStart, setPendingStart] = useState('');
  const [pendingEnd, setPendingEnd] = useState('');
  const [popOpen, setPopOpen] = useState(false);
  const successFiredRef = useRef(false);

  const filteredData = eventsData.filter(e => {
    if (!appliedRange) return true;
    return e.date >= appliedRange[0] && e.date <= appliedRange[1];
  });

  useEffect(() => {
    if (successFiredRef.current) return;
    if (appliedRange && appliedRange[0] === '2024-07-01' && appliedRange[1] === '2024-07-31') {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedRange, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'events',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedRange
      ? [{ column: 'Date', operator: 'date_between_inclusive' as const, value: { start: appliedRange[0], end: appliedRange[1] } }]
      : [],
  };

  return (
    <div style={{ width: 780, height: 500, overflow: 'auto', padding: 16 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ marginBottom: 400 }}>
        <Text fw={600} size="md" mb="sm">Events</Text>
        <Table
          highlightOnHover
          data-testid="table-events"
          data-filter-model={JSON.stringify(filterModel)}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Organizer</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Attendees</Table.Th>
              <Table.Th>
                <Group gap={4}>
                  Date
                  <Popover opened={popOpen} onChange={setPopOpen} position="bottom" withArrow closeOnClickOutside={false}>
                    <Popover.Target>
                      <Badge
                        size="xs"
                        variant={appliedRange ? 'filled' : 'outline'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setPendingStart(appliedRange?.[0] || '');
                          setPendingEnd(appliedRange?.[1] || '');
                          setPopOpen(o => !o);
                        }}
                      >
                        ▼
                      </Badge>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Stack gap="xs" style={{ width: 220 }}>
                        <TextInput
                          size="xs"
                          label="Start date"
                          placeholder="YYYY-MM-DD"
                          value={pendingStart}
                          onChange={e => setPendingStart(e.currentTarget.value)}
                          data-testid="date-start"
                        />
                        <TextInput
                          size="xs"
                          label="End date"
                          placeholder="YYYY-MM-DD"
                          value={pendingEnd}
                          onChange={e => setPendingEnd(e.currentTarget.value)}
                          data-testid="date-end"
                        />
                        <Group gap="xs">
                          <Button
                            size="xs"
                            variant="subtle"
                            onClick={() => {
                              setPendingStart('');
                              setPendingEnd('');
                              setAppliedRange(null);
                              setPopOpen(false);
                            }}
                          >
                            Reset
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => {
                              if (pendingStart && pendingEnd) {
                                setAppliedRange([pendingStart.trim(), pendingEnd.trim()]);
                              }
                              setPopOpen(false);
                            }}
                          >
                            Apply filters
                          </Button>
                        </Group>
                      </Stack>
                    </Popover.Dropdown>
                  </Popover>
                </Group>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.map(r => (
              <Table.Tr key={r.id}>
                <Table.Td>{r.name}</Table.Td>
                <Table.Td>{r.organizer}</Table.Td>
                <Table.Td>{r.location}</Table.Td>
                <Table.Td>{r.attendees}</Table.Td>
                <Table.Td>{r.date}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
