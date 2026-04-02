'use client';

/**
 * button-mantine-T08: Download report from table row (ActionIcon in table)
 * 
 * Compact reports table with three rows: Report Q1, Q2, Q3.
 * Each row has a download ActionIcon.
 * Task: Click download for "Report Q3".
 */

import React, { useState } from 'react';
import { Table, ActionIcon, Badge, Paper, Tooltip } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

interface ReportRow {
  id: string;
  name: string;
  date: string;
  size: string;
}

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [downloadedRows, setDownloadedRows] = useState<Set<string>>(new Set());

  const handleDownload = (rowKey: string) => {
    if (downloadedRows.has(rowKey)) return;
    
    setDownloadedRows((prev) => new Set(Array.from(prev).concat(rowKey)));
    
    if (rowKey === 'Report Q3') {
      onSuccess();
    }
  };

  const reports: ReportRow[] = [
    { id: 'Report Q1', name: 'Report Q1', date: '2024-03-31', size: '2.4 MB' },
    { id: 'Report Q2', name: 'Report Q2', date: '2024-06-30', size: '3.1 MB' },
    { id: 'Report Q3', name: 'Report Q3', date: '2024-09-30', size: '2.8 MB' },
  ];

  return (
    <Paper shadow="sm" radius="md" withBorder style={{ width: 500 }}>
      <Table striped highlightOnHover data-table-id="mantine-reports-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Report</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Size</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {reports.map((report) => (
            <Table.Tr key={report.id}>
              <Table.Td>{report.name}</Table.Td>
              <Table.Td>{report.date}</Table.Td>
              <Table.Td>{report.size}</Table.Td>
              <Table.Td style={{ textAlign: 'center' }}>
                {downloadedRows.has(report.id) ? (
                  <Badge color="green" size="sm">Downloaded</Badge>
                ) : (
                  <Tooltip label="Download">
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() => handleDownload(report.id)}
                      data-testid={`mantine-actionicon-download-${report.id.toLowerCase().replace(/\s+/g, '-')}`}
                      data-row-key={report.id}
                    >
                      <IconDownload size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
