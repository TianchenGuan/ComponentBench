'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Table, ActionIcon, Group, TextInput, Pagination, Notification, Tooltip } from '@mantine/core';
import { IconDownload, IconEye, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  const rows = [
    { id: '2024', name: 'Contract 2024' },
    { id: '2025', name: 'Contract 2025' },
    { id: '2026', name: 'Contract 2026' },
    { id: '2027', name: 'Contract 2027' },
  ];

  useEffect(() => {
    rows.forEach(row => {
      blobUrlRef.current[row.id] = createMockBlobUrl(`contract-${row.id}.pdf`, `Contract ${row.id} PDF`);
    });
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (id: string) => {
    if (id === '2026' && !completed) {
      setShowNotification(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={500} size="lg" mb="md">Contracts</Text>
      <Group mb="md">
        <TextInput placeholder="Search..." leftSection={<IconSearch size={14} />} size="xs" style={{ flex: 1 }} />
        <Pagination total={3} size="xs" />
      </Group>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Contract</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map(row => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Tooltip label="View"><ActionIcon variant="light" size="sm"><IconEye size={14} /></ActionIcon></Tooltip>
                  <Tooltip label="Download">
                    <ActionIcon variant="light" size="sm" onClick={(e) => { e.preventDefault(); handleDownload(row.id); }} data-testid={`download-contract-${row.id}`}>
                      <IconDownload size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: contract-2026.pdf
        </Notification>
      )}
    </Card>
  );
}
