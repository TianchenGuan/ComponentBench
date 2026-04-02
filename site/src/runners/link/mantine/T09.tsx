'use client';

/**
 * link-mantine-T09: Download the correct invoice from a small-scale table (top-right placement)
 * 
 * setup_description:
 * A table_cell scene is anchored near the top-right of the viewport (placement=top_right).
 * The table is rendered at small scale (smaller text and tighter columns) and lists 10
 * invoices. Columns include "Invoice ID", "Date", "Total", and "Action".
 * 
 * In the Action column, each row contains a Mantine Anchor link labeled "Download"
 * (identical label across rows). When a row's Download link is activated, it changes
 * that link's label to "Downloaded" and disables it (aria-disabled="true").
 * 
 * success_trigger:
 * - The "Download" link in the "INV-1042" row (data-testid="inv-1042-download") was activated.
 * - That same link becomes disabled (aria-disabled="true").
 * - That same link's visible label changes to "Downloaded".
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Table, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface InvoiceRow {
  key: string;
  id: string;
  date: string;
  total: string;
  testId: string;
}

const invoices: InvoiceRow[] = [
  { key: '1039', id: 'INV-1039', date: '2024-10-01', total: '$150.00', testId: 'inv-1039-download' },
  { key: '1040', id: 'INV-1040', date: '2024-10-15', total: '$225.00', testId: 'inv-1040-download' },
  { key: '1041', id: 'INV-1041', date: '2024-11-01', total: '$175.00', testId: 'inv-1041-download' },
  { key: '1042', id: 'INV-1042', date: '2024-11-15', total: '$299.00', testId: 'inv-1042-download' },
  { key: '1043', id: 'INV-1043', date: '2024-12-01', total: '$199.00', testId: 'inv-1043-download' },
  { key: '1044', id: 'INV-1044', date: '2024-12-15', total: '$350.00', testId: 'inv-1044-download' },
  { key: '1045', id: 'INV-1045', date: '2025-01-01', total: '$275.00', testId: 'inv-1045-download' },
  { key: '1046', id: 'INV-1046', date: '2025-01-10', total: '$425.00', testId: 'inv-1046-download' },
  { key: '1047', id: 'INV-1047', date: '2025-01-15', total: '$180.00', testId: 'inv-1047-download' },
  { key: '1048', id: 'INV-1048', date: '2025-01-20', total: '$320.00', testId: 'inv-1048-download' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [downloadedInvoices, setDownloadedInvoices] = useState<Set<string>>(new Set());
  const [activated, setActivated] = useState(false);

  const handleDownloadClick = (invoice: InvoiceRow) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated || downloadedInvoices.has(invoice.key)) return;
    
    setDownloadedInvoices((prev) => new Set(prev).add(invoice.key));
    
    if (invoice.key === '1042') {
      setActivated(true);
      onSuccess();
    }
  };

  const rows = invoices.map((invoice) => {
    const isDownloaded = downloadedInvoices.has(invoice.key);
    return (
      <Table.Tr key={invoice.key}>
        <Table.Td style={{ fontSize: 11 }}>{invoice.id}</Table.Td>
        <Table.Td style={{ fontSize: 11 }}>{invoice.date}</Table.Td>
        <Table.Td style={{ fontSize: 11 }}>{invoice.total}</Table.Td>
        <Table.Td>
          <Anchor
            href="#"
            onClick={handleDownloadClick(invoice)}
            data-testid={invoice.testId}
            aria-disabled={isDownloaded}
            size="xs"
            c={isDownloaded ? 'dimmed' : undefined}
            style={{ 
              cursor: isDownloaded ? 'not-allowed' : 'pointer',
              pointerEvents: isDownloaded ? 'none' : 'auto',
            }}
          >
            {isDownloaded ? 'Downloaded' : 'Download'}
          </Anchor>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="md" mb="sm">
        Invoices
      </Text>
      
      <Table.ScrollContainer minWidth={400}>
        <Table 
          striped 
          highlightOnHover
          horizontalSpacing="xs"
          verticalSpacing={4}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ fontSize: 11 }}>Invoice ID</Table.Th>
              <Table.Th style={{ fontSize: 11 }}>Date</Table.Th>
              <Table.Th style={{ fontSize: 11 }}>Total</Table.Th>
              <Table.Th style={{ fontSize: 11 }}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
}
