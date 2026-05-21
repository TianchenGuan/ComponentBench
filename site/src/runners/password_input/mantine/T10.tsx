'use client';

/**
 * password_input-mantine-T10: Edit the Secondary password in a small dense table (no visibility toggle)
 * 
 * A table-cell layout shows a compact table titled "API credentials" with three rows: Primary,
 * Secondary, and Legacy. Each row contains a Mantine PasswordInput rendered in a small size
 * inside the table cell.
 * In each PasswordInput, a rightSection is used to render a small "Save" action button inside
 * the input. Because rightSection is present, the standard visibility toggle icon is not shown.
 * Only the Secondary row is the target. Clicking Save in the Secondary row commits that row
 * and displays a small "Saved" indicator in that row.
 * 
 * Success: In the Secondary row, the password value equals exactly "Sec-2026*Key" after commit
 * AND the Save action for the Secondary row has been activated.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, PasswordInput, Text, Button, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface CredentialRow {
  id: string;
  name: string;
  password: string;
  saved: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<CredentialRow[]>([
    { id: 'primary', name: 'Primary', password: '', saved: false },
    { id: 'secondary', name: 'Secondary', password: '', saved: false },
    { id: 'legacy', name: 'Legacy', password: '', saved: false },
  ]);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    const secondaryRow = rows.find(r => r.id === 'secondary');
    if (secondaryRow && secondaryRow.password === 'Sec-2026*Key' && secondaryRow.saved && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const handlePasswordChange = (id: string, value: string) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, password: value } : row
    ));
  };

  const handleSave = (id: string) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, saved: true } : row
    ));
  };

  const tableRows = rows.map((row) => (
    <Table.Tr key={row.id} data-row={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>
        <PasswordInput
          value={row.password}
          onChange={(e) => handlePasswordChange(row.id, e.target.value)}
          size="xs"
          visibilityToggleIcon={() => null}
          style={{ width: 180 }}
          rightSection={
            <Button
              size="compact-xs"
              variant="light"
              onClick={() => handleSave(row.id)}
              data-testid={`save-${row.id}`}
            >
              Save
            </Button>
          }
          rightSectionWidth={60}
          data-testid={`password-input-${row.id}`}
        />
      </Table.Td>
      <Table.Td>
        {row.saved && <Badge color="green" size="sm">Saved</Badge>}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box style={{ width: 400 }}>
      <Text fw={600} size="md" mb="sm">API credentials</Text>
      <Table withTableBorder withColumnBorders data-testid="api-credentials-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Credential</Table.Th>
            <Table.Th>Password</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{tableRows}</Table.Tbody>
      </Table>
    </Box>
  );
}
