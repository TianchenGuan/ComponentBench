'use client';

/**
 * listbox_multi-mantine-T09: Search and select columns (two groups)
 *
 * Layout: settings_panel centered.
 * At the top of the panel is a TextInput labeled "Search columns" that filters the visible items in the column lists below.
 * There are two Checkbox.Group listboxes (instances=2):
 *   - "Available columns" (left) with a long list of 30 possible columns.
 *   - "Pinned columns" (right) with a short list of 5 columns.
 * Target is ONLY "Available columns".
 * Initial state: Pinned columns has "Name" and "Email" selected; Available columns has none selected.
 *
 * Success: The target listbox (Available columns) has exactly: Last seen, Plan, MRR.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Text, Checkbox, Stack, Grid, TextInput, ScrollArea } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const availableColumns = [
  'Name', 'Email', 'Last seen', 'Created at', 'Plan', 'MRR', 'ARR', 'Seats', 'Country', 'Status',
  'Role', 'Team', 'Department', 'Manager', 'Hire date', 'Salary', 'Performance', 'Goals',
  'Projects', 'Tasks', 'Completed', 'Overdue', 'Priority', 'Labels', 'Assignee', 'Due date',
  'Start date', 'Progress', 'Comments', 'Attachments',
];

const pinnedColumns = ['Name', 'Email', 'Created at', 'Status', 'Role'];

const targetSet = ['Last seen', 'Plan', 'MRR'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [search, setSearch] = useState('');
  const [availableSelected, setAvailableSelected] = useState<string[]>([]);
  const [pinnedSelected, setPinnedSelected] = useState<string[]>(['Name', 'Email']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(availableSelected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [availableSelected, onSuccess]);

  const filteredAvailable = useMemo(() => {
    if (!search.trim()) return availableColumns;
    const lower = search.toLowerCase();
    return availableColumns.filter((c) => c.toLowerCase().includes(lower));
  }, [search]);

  const filteredPinned = useMemo(() => {
    if (!search.trim()) return pinnedColumns;
    const lower = search.toLowerCase();
    return pinnedColumns.filter((c) => c.toLowerCase().includes(lower));
  }, [search]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="xs">
        Table columns
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Table columns: Available columns and Pinned columns.
      </Text>
      <TextInput
        data-testid="search-columns"
        placeholder="Search columns"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="md"
      />
      <Grid>
        <Grid.Col span={7}>
          <Text fw={500} mb="sm">
            Available columns
          </Text>
          <ScrollArea h={300} style={{ border: '1px solid #e9ecef', borderRadius: 4, padding: 8 }}>
            <Checkbox.Group
              data-testid="listbox-available-columns"
              value={availableSelected}
              onChange={setAvailableSelected}
            >
              <Stack gap="xs">
                {filteredAvailable.map((opt) => (
                  <Checkbox key={opt} value={opt} label={opt} />
                ))}
              </Stack>
            </Checkbox.Group>
          </ScrollArea>
          <Text size="xs" c="dimmed" mt="xs">
            Selected: {availableSelected.join(', ') || '–'}
          </Text>
        </Grid.Col>
        <Grid.Col span={5}>
          <Text fw={500} mb="sm">
            Pinned columns
          </Text>
          <ScrollArea h={300} style={{ border: '1px solid #e9ecef', borderRadius: 4, padding: 8 }}>
            <Checkbox.Group
              data-testid="listbox-pinned-columns"
              value={pinnedSelected}
              onChange={setPinnedSelected}
            >
              <Stack gap="xs">
                {filteredPinned.map((opt) => (
                  <Checkbox key={opt} value={opt} label={opt} />
                ))}
              </Stack>
            </Checkbox.Group>
          </ScrollArea>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
