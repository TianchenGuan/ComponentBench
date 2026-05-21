'use client';

/**
 * table_static-mui-T09: Horizontal scroll in a small table card (cell target)
 *
 * A table_cell card is anchored at the top-left of the viewport, simulating a dashboard widget. It contains
 * a read-only Services table built with MUI Table components. The table has many narrow metric columns, so the "Latency
 * p95" column is off-screen to the right. A horizontal scrollbar is available within the card; the agent must horizontally
 * scroll/drag to reveal Latency p95. Clicking a body cell sets an active cell highlight. Initial state: no active body cell;
 * Latency p95 not visible.
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface ServiceData {
  key: string;
  service: string;
  requests: string;
  errors: string;
  latencyP50: string;
  latencyP90: string;
  latencyP95: string;
  latencyP99: string;
  uptime: string;
}

const servicesData: ServiceData[] = [
  { key: 'api-gateway', service: 'api-gateway', requests: '1.2M', errors: '0.01%', latencyP50: '45ms', latencyP90: '120ms', latencyP95: '180ms', latencyP99: '350ms', uptime: '99.99%' },
  { key: 'auth-service', service: 'auth-service', requests: '850K', errors: '0.02%', latencyP50: '30ms', latencyP90: '80ms', latencyP95: '110ms', latencyP99: '200ms', uptime: '99.98%' },
  { key: 'search-api', service: 'search-api', requests: '2.1M', errors: '0.05%', latencyP50: '150ms', latencyP90: '400ms', latencyP95: '550ms', latencyP99: '800ms', uptime: '99.95%' },
  { key: 'payment-api', service: 'payment-api', requests: '320K', errors: '0.00%', latencyP50: '200ms', latencyP90: '450ms', latencyP95: '600ms', latencyP99: '950ms', uptime: '99.99%' },
  { key: 'user-service', service: 'user-service', requests: '1.5M', errors: '0.01%', latencyP50: '25ms', latencyP90: '60ms', latencyP95: '85ms', latencyP99: '150ms', uptime: '99.97%' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [activeCell, setActiveCell] = useState<{ rowKey: string; columnKey: string } | null>(null);

  const handleCellClick = (rowKey: string, columnKey: string) => {
    setActiveCell({ rowKey, columnKey });
    if (rowKey === 'search-api' && columnKey === 'latency_p95') {
      onSuccess();
    }
  };

  const createCellProps = (rowKey: string, columnKey: string) => ({
    onClick: () => handleCellClick(rowKey, columnKey),
    sx: {
      cursor: 'pointer',
      outline: activeCell?.rowKey === rowKey && activeCell?.columnKey === columnKey ? '2px solid #1976d2' : undefined,
      outlineOffset: -2,
    },
  });

  return (
    <Card sx={{ width: 380 }} data-cb-active-cell={activeCell ? `${activeCell.rowKey}|${activeCell.columnKey}` : undefined}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
          Services
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 340 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 100 }}>Service</TableCell>
                <TableCell sx={{ minWidth: 70 }}>Requests</TableCell>
                <TableCell sx={{ minWidth: 60 }}>Errors</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Latency p50</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Latency p90</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Latency p95</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Latency p99</TableCell>
                <TableCell sx={{ minWidth: 70 }}>Uptime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesData.map((row) => (
                <TableRow key={row.key} data-row-key={row.key}>
                  <TableCell {...createCellProps(row.key, 'service')}>{row.service}</TableCell>
                  <TableCell {...createCellProps(row.key, 'requests')}>{row.requests}</TableCell>
                  <TableCell {...createCellProps(row.key, 'errors')}>{row.errors}</TableCell>
                  <TableCell {...createCellProps(row.key, 'latency_p50')}>{row.latencyP50}</TableCell>
                  <TableCell {...createCellProps(row.key, 'latency_p90')}>{row.latencyP90}</TableCell>
                  <TableCell {...createCellProps(row.key, 'latency_p95')}>{row.latencyP95}</TableCell>
                  <TableCell {...createCellProps(row.key, 'latency_p99')}>{row.latencyP99}</TableCell>
                  <TableCell {...createCellProps(row.key, 'uptime')}>{row.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
