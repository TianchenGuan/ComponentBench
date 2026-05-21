'use client';

/**
 * data_grid_row_selection-mantine-T06: Match reference list to select shipments
 *
 * A centered isolated card titled "Shipments" is split into two parts.
 * On the left is a Mantine Table with a Checkbox column for row selection. On the right is a small reference
 * list titled "Select these shipments" showing three codes as badges: SHP-201, SHP-214, SHP-219.
 * Spacing is comfortable and scale is default. The table shows 18 rows with columns: Shipment code,
 * Destination, Carrier.
 * Initial state: no rows selected. There is no pagination and selection is applied immediately.
 * Some shipment codes are visually similar (e.g., SHP-218 vs SHP-219), making careful matching necessary.
 *
 * Success: selected_row_ids equals ['shp_201', 'shp_214', 'shp_219']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Checkbox, Badge, Stack, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface ShipmentData {
  key: string;
  shipmentCode: string;
  destination: string;
  carrier: string;
}

const shipmentsData: ShipmentData[] = [
  { key: 'shp_200', shipmentCode: 'SHP-200', destination: 'New York', carrier: 'FedEx' },
  { key: 'shp_201', shipmentCode: 'SHP-201', destination: 'Los Angeles', carrier: 'UPS' },
  { key: 'shp_202', shipmentCode: 'SHP-202', destination: 'Chicago', carrier: 'DHL' },
  { key: 'shp_210', shipmentCode: 'SHP-210', destination: 'Houston', carrier: 'FedEx' },
  { key: 'shp_211', shipmentCode: 'SHP-211', destination: 'Phoenix', carrier: 'UPS' },
  { key: 'shp_212', shipmentCode: 'SHP-212', destination: 'Philadelphia', carrier: 'DHL' },
  { key: 'shp_213', shipmentCode: 'SHP-213', destination: 'San Antonio', carrier: 'FedEx' },
  { key: 'shp_214', shipmentCode: 'SHP-214', destination: 'San Diego', carrier: 'UPS' },
  { key: 'shp_215', shipmentCode: 'SHP-215', destination: 'Dallas', carrier: 'DHL' },
  { key: 'shp_216', shipmentCode: 'SHP-216', destination: 'San Jose', carrier: 'FedEx' },
  { key: 'shp_217', shipmentCode: 'SHP-217', destination: 'Austin', carrier: 'UPS' },
  { key: 'shp_218', shipmentCode: 'SHP-218', destination: 'Jacksonville', carrier: 'DHL' },
  { key: 'shp_219', shipmentCode: 'SHP-219', destination: 'San Francisco', carrier: 'FedEx' },
  { key: 'shp_220', shipmentCode: 'SHP-220', destination: 'Columbus', carrier: 'UPS' },
  { key: 'shp_221', shipmentCode: 'SHP-221', destination: 'Indianapolis', carrier: 'DHL' },
  { key: 'shp_222', shipmentCode: 'SHP-222', destination: 'Fort Worth', carrier: 'FedEx' },
  { key: 'shp_223', shipmentCode: 'SHP-223', destination: 'Charlotte', carrier: 'UPS' },
  { key: 'shp_224', shipmentCode: 'SHP-224', destination: 'Seattle', carrier: 'DHL' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const toggleRow = (key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(Array.from(selectedKeys), ['shp_201', 'shp_214', 'shp_219'])) {
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={500} size="md" mb="md">Shipments</Text>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Table */}
        <div style={{ flex: 2 }}>
          <ScrollArea h={400}>
            <Table
              highlightOnHover
              data-testid="shipments-table"
              data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 40 }} />
                  <Table.Th>Shipment code</Table.Th>
                  <Table.Th>Destination</Table.Th>
                  <Table.Th>Carrier</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {shipmentsData.map((row) => (
                  <Table.Tr
                    key={row.key}
                    bg={selectedKeys.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined}
                    data-row-id={row.key}
                    data-selected={selectedKeys.has(row.key)}
                  >
                    <Table.Td>
                      <Checkbox
                        checked={selectedKeys.has(row.key)}
                        onChange={() => toggleRow(row.key)}
                        aria-label={`Select ${row.shipmentCode}`}
                      />
                    </Table.Td>
                    <Table.Td>{row.shipmentCode}</Table.Td>
                    <Table.Td>{row.destination}</Table.Td>
                    <Table.Td>{row.carrier}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>

        {/* Reference panel */}
        <div style={{ flex: 1 }}>
          <Text fw={500} size="sm" mb="sm">Select these shipments</Text>
          <Stack gap="xs">
            <Badge color="blue" variant="light">SHP-201</Badge>
            <Badge color="green" variant="light">SHP-214</Badge>
            <Badge color="orange" variant="light">SHP-219</Badge>
          </Stack>
        </div>
      </div>
    </Card>
  );
}
