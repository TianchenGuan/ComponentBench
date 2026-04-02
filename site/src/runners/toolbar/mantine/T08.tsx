'use client';

/**
 * toolbar-mantine-T08: Small header toolbar: scroll to Export CSV and click
 *
 * The page uses a dashboard layout with an AppShell.Header at the top. 
 * Inside the header is a compact, small-scale Mantine Group toolbar labeled "Analytics".
 * The toolbar contains many small ActionIcon buttons (about 12) with tooltips. 
 * The toolbar row is horizontally scrollable within the header.
 * The "Export CSV" action is located near the far right and is not visible initially.
 */

import React, { useState } from 'react';
import { Paper, Group, ActionIcon, Text, Title, Tooltip, Box } from '@mantine/core';
import {
  IconRefresh,
  IconFileSpreadsheet,
  IconFilter,
  IconSortAscending,
  IconPrinter,
  IconSettings,
  IconSearch,
  IconShare,
  IconMail,
  IconDownload,
  IconBookmark,
  IconFileTypeCsv,
} from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const ACTIONS: ToolbarAction[] = [
  { id: 'refresh', label: 'Refresh', icon: <IconRefresh size={16} /> },
  { id: 'export_excel', label: 'Export Excel', icon: <IconFileSpreadsheet size={16} /> },
  { id: 'filter', label: 'Filter', icon: <IconFilter size={16} /> },
  { id: 'sort', label: 'Sort', icon: <IconSortAscending size={16} /> },
  { id: 'print', label: 'Print', icon: <IconPrinter size={16} /> },
  { id: 'settings', label: 'Settings', icon: <IconSettings size={16} /> },
  { id: 'search', label: 'Search', icon: <IconSearch size={16} /> },
  { id: 'share', label: 'Share', icon: <IconShare size={16} /> },
  { id: 'email', label: 'Email', icon: <IconMail size={16} /> },
  { id: 'download', label: 'Download', icon: <IconDownload size={16} /> },
  { id: 'bookmark', label: 'Bookmark', icon: <IconBookmark size={16} /> },
  { id: 'export_csv', label: 'Export CSV', icon: <IconFileTypeCsv size={16} /> },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');

  const handleAction = (action: ToolbarAction) => {
    setLastAction(action.label);
    if (action.id === 'export_csv') {
      onSuccess();
    }
  };

  return (
    <Box style={{ width: '100%', maxWidth: 600 }}>
      {/* Analytics header */}
      <Paper shadow="sm" p="md" radius="md" mb="md">
        <Group gap="sm" mb="sm">
          <Title order={5} style={{ whiteSpace: 'nowrap' }}>
            Analytics
          </Title>
          <Box
            style={{
              display: 'flex',
              gap: 4,
              overflowX: 'auto',
              flex: 1,
              paddingBottom: 4,
            }}
            data-testid="mantine-toolbar-analytics"
          >
            {ACTIONS.map((action) => (
              <Tooltip key={action.id} label={action.label}>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => handleAction(action)}
                  aria-label={action.label}
                  data-testid={`mantine-toolbar-analytics-${action.id}`}
                >
                  {action.icon}
                </ActionIcon>
              </Tooltip>
            ))}
          </Box>
        </Group>

        <Text size="sm" c="dimmed">
          Last action: {lastAction}
        </Text>
      </Paper>

      {/* Clutter: dashboard widgets */}
      <Group grow>
        <Paper shadow="xs" p="md" radius="md">
          <Text size="xs" c="dimmed">
            Revenue
          </Text>
          <Box style={{ height: 60, background: '#f5f5f5', borderRadius: 4, marginTop: 8 }} />
        </Paper>
        <Paper shadow="xs" p="md" radius="md">
          <Text size="xs" c="dimmed">
            Users
          </Text>
          <Box style={{ height: 60, background: '#f5f5f5', borderRadius: 4, marginTop: 8 }} />
        </Paper>
      </Group>
    </Box>
  );
}
