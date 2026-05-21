'use client';

/**
 * virtual_list-mantine-T04: Filter a large user list and select one
 *
 * Layout: form_section titled "Invite a user".
 * Target component: an inline user picker consisting of:
 *   - a Mantine TextInput labeled "Search users"
 *   - a virtualized list below inside ScrollArea (h≈300px) with ~5,000 users
 * Initial state: unfiltered list at top; no selection.
 *
 * Success: Select user 'usr-1203' (Hana Park)
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Paper, Text, TextInput, Box, Button, Select, Group } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../types';

interface UserItem {
  key: string;
  id: string;
  name: string;
  email: string;
}

// Generate 5000 users
const generateUsers = (): UserItem[] => {
  const firstNames = ['Hana', 'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker'];
  const lastNames = ['Park', 'Kim', 'Chen', 'Patel', 'Smith', 'Johnson', 'Garcia', 'Martinez', 'Brown', 'Wilson'];
  
  return Array.from({ length: 5000 }, (_, i) => {
    const num = i + 1;
    let name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    if (num === 1203) name = 'Hana Park';
    return {
      key: `usr-${String(num).padStart(4, '0')}`,
      id: `USR-${String(num).padStart(4, '0')}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    };
  });
};

const users = generateUsers();

export default function T04({ onSuccess }: TaskComponentProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return users;
    const lower = searchText.toLowerCase();
    return users.filter(u => 
      u.id.toLowerCase().includes(lower) || 
      u.name.toLowerCase().includes(lower)
    );
  }, [searchText]);

  const virtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 5,
  });

  // Check success condition
  useEffect(() => {
    if (selectedKey === 'usr-1203') {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  const selectedUser = users.find(u => u.key === selectedKey);

  return (
    <Paper shadow="sm" p="lg" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Invite a user</Text>
      
      {/* Clutter: unrelated form field */}
      <Select
        label="Role"
        placeholder="Select role"
        data={['Viewer', 'Editor', 'Admin']}
        mb="md"
      />

      <Text fw={500} size="sm" mb="xs">User picker</Text>
      <TextInput
        placeholder="Search users"
        leftSection={<IconSearch size={16} />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        mb="xs"
      />

      <Box
        ref={parentRef}
        data-testid="vl-primary"
        style={{
          height: 300,
          overflow: 'auto',
          border: '1px solid #e9ecef',
          borderRadius: 4,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
            const item = filteredUsers[virtualRow.index];
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                data-selected={selectedKey === item.key}
                aria-selected={selectedKey === item.key}
                onClick={() => setSelectedKey(item.key)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: selectedKey === item.key ? '#e7f5ff' : 'transparent',
                }}
              >
                <Text size="sm" fw={500}>{item.id} — {item.name}</Text>
                <Text size="xs" c="dimmed">{item.email}</Text>
              </div>
            );
          })}
        </div>
      </Box>

      <Button disabled={!selectedKey}>
        Invite
      </Button>
      {selectedUser && (
        <Text size="xs" c="dimmed" mt="xs">
          Selected: {selectedUser.id} — {selectedUser.name}
        </Text>
      )}
    </Paper>
  );
}
