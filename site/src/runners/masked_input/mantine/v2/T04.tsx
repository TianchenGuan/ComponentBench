'use client';

/**
 * masked_input-mantine-v2-T04: Backup van plate in compact fleet table
 *
 * A high-contrast compact table titled "Fleet record" with two rows: "Primary van"
 * and "Backup van". Columns: Vehicle, Vehicle plate (masked AAA-####), Status.
 * Primary starts as QPX-0421; Backup starts as QPX-0401. Each row has a Save button.
 *
 * Success: Backup van's committed plate equals "QPX-0471" AND Save was clicked for
 * that row AND Primary van remains "QPX-0421".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Text, Button, Badge, Box, MantineProvider } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface FleetRow {
  vehicle: string;
  plate: string;
  draft: string;
  saved: boolean;
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [rows, setRows] = useState<FleetRow[]>([
    { vehicle: 'Primary van', plate: 'QPX-0421', draft: 'QPX-0421', saved: true },
    { vehicle: 'Backup van', plate: 'QPX-0401', draft: 'QPX-0401', saved: false },
  ]);

  useEffect(() => {
    if (successFired.current) return;
    const primary = rows[0];
    const backup = rows[1];
    if (backup.saved && backup.plate === 'QPX-0471' && primary.plate === 'QPX-0421') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const handleDraft = (idx: number, val: string) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, draft: val } : r)));
  };

  const handleSave = (idx: number) => {
    setRows(prev =>
      prev.map((r, i) => (i === idx ? { ...r, plate: r.draft, saved: true } : r)),
    );
  };

  return (
    <MantineProvider defaultColorScheme="light">
      <Box
        p="md"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          width: 520,
          background: '#000',
          color: '#fff',
          borderRadius: 8,
          border: '1px solid #444',
        }}
      >
        <Text fw={700} size="lg" mb="sm" c="white">Fleet record</Text>
        <Table
          withTableBorder
          withColumnBorders
          highlightOnHover
          styles={{
            table: { background: '#111', color: '#fff' },
            th: { color: '#ccc', fontSize: 12, padding: '6px 8px' },
            td: { padding: '4px 8px' },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Vehicle</Table.Th>
              <Table.Th>Vehicle plate</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row, idx) => (
              <Table.Tr key={row.vehicle}>
                <Table.Td>
                  <Text size="xs" c="white">{row.vehicle}</Text>
                </Table.Td>
                <Table.Td>
                  <IMaskInput
                    mask="AAA-0000"
                    definitions={{ A: /[A-Z]/, '0': /[0-9]/ }}
                    placeholder="AAA-####"
                    value={row.draft}
                    onAccept={(val: string) => handleDraft(idx, val)}
                    data-testid={`plate-${row.vehicle.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{
                      width: 100,
                      padding: '2px 6px',
                      fontSize: 12,
                      border: '1px solid #555',
                      borderRadius: 3,
                      background: '#222',
                      color: '#fff',
                      outline: 'none',
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <Badge size="xs" color={row.saved ? 'green' : 'gray'} variant="light">
                    {row.saved ? 'Saved' : 'Draft'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Button size="compact-xs" variant="light" onClick={() => handleSave(idx)}>
                    Save
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </MantineProvider>
  );
}
