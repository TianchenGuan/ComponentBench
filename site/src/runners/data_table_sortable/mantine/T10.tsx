'use client';

/**
 * data_table_sortable-mantine-T30: Header menu - sort Score descending (open-and-select, compact)
 *
 * A compact, embedded table-cell style layout with a Mantine composite sortable table using per-column header menus.
 * - Columns: Player, Score, Streak.
 * - Each header has a small menu icon (ActionIcon) that opens a Popover with sort options.
 * - Initial state: unsorted.
 *
 * Distractors: other column menus exist.
 * Success: Score sorted descending via column menu.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Group, ActionIcon, Popover, Button, Stack, Box } from '@mantine/core';
import { IconDots, IconSortAscending, IconSortDescending, IconX } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface LeaderboardData {
  id: string;
  player: string;
  score: number;
  streak: number;
}

const leaderboardData: LeaderboardData[] = [
  { id: '1', player: 'Alice', score: 2450, streak: 5 },
  { id: '2', player: 'Bob', score: 2280, streak: 3 },
  { id: '3', player: 'Carol', score: 2650, streak: 8 },
  { id: '4', player: 'David', score: 2100, streak: 2 },
  { id: '5', player: 'Emma', score: 2820, streak: 12 },
  { id: '6', player: 'Frank', score: 1950, streak: 1 },
  { id: '7', player: 'Grace', score: 2380, streak: 6 },
  { id: '8', player: 'Henry', score: 2550, streak: 9 },
];

type SortDirection = 'asc' | 'desc' | null;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleSort = (column: string, direction: SortDirection) => {
    if (direction === null) {
      setSortBy(null);
      setSortDirection(null);
    } else {
      setSortBy(column);
      setSortDirection(direction);
    }
    setOpenMenu(null);
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy || !sortDirection) return leaderboardData;
    return [...leaderboardData].sort((a, b) => {
      const aVal = a[sortBy as keyof LeaderboardData];
      const bVal = b[sortBy as keyof LeaderboardData];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [sortBy, sortDirection]);

  // Check success condition
  useEffect(() => {
    if (sortBy === 'score' && sortDirection === 'desc') {
      onSuccess();
    }
  }, [sortBy, sortDirection, onSuccess]);

  const sortModel: SortModel = sortBy && sortDirection
    ? [{ column_key: sortBy, direction: sortDirection, priority: 1 }]
    : [];

  const renderHeaderWithMenu = (label: string, column: string) => {
    const isSorted = sortBy === column;
    return (
      <Group justify="space-between" wrap="nowrap" gap={4}>
        <Text fw={500} size="xs">
          {label}
          {isSorted && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
        </Text>
        <Popover
          opened={openMenu === column}
          onClose={() => setOpenMenu(null)}
          position="bottom-end"
          withArrow
        >
          <Popover.Target>
            <ActionIcon
              variant="subtle"
              size="xs"
              onClick={() => setOpenMenu(openMenu === column ? null : column)}
              data-testid={`header-menu-${column}`}
            >
              <IconDots size={12} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap={4}>
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconSortAscending size={14} />}
                onClick={() => handleSort(column, 'asc')}
                style={{ justifyContent: 'flex-start' }}
              >
                Sort ascending
              </Button>
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconSortDescending size={14} />}
                onClick={() => handleSort(column, 'desc')}
                style={{ justifyContent: 'flex-start' }}
              >
                Sort descending
              </Button>
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconX size={14} />}
                onClick={() => handleSort(column, null)}
                style={{ justifyContent: 'flex-start' }}
                disabled={sortBy !== column}
              >
                Clear sort
              </Button>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>
    );
  };

  return (
    <Box
      style={{
        width: 350,
        border: '2px solid #dee2e6',
        borderRadius: 8,
        padding: 2,
        backgroundColor: '#fff',
      }}
    >
      <Card padding="sm" radius={0} style={{ border: 'none' }}>
        <Text fw={500} size="sm" mb="sm">Leaderboard</Text>
        <Table
          highlightOnHover
          data-testid="table-leaderboard"
          data-sort-model={JSON.stringify(sortModel)}
          style={{ fontSize: 12 }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ padding: '6px 8px' }}>
                {renderHeaderWithMenu('Player', 'player')}
              </Table.Th>
              <Table.Th style={{ padding: '6px 8px' }}>
                {renderHeaderWithMenu('Score', 'score')}
              </Table.Th>
              <Table.Th style={{ padding: '6px 8px' }}>
                {renderHeaderWithMenu('Streak', 'streak')}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td style={{ padding: '4px 8px', fontSize: 11 }}>{row.player}</Table.Td>
                <Table.Td style={{ padding: '4px 8px', fontSize: 11 }}>{row.score.toLocaleString()}</Table.Td>
                <Table.Td style={{ padding: '4px 8px', fontSize: 11 }}>{row.streak}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}
