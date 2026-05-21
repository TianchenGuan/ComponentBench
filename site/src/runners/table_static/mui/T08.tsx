'use client';

/**
 * table_static-mui-T08: Open a drawer and select a log row (dark theme)
 *
 * The page uses a drawer_flow: a text button labeled "View full log" opens a right-side Drawer. Inside
 * the drawer is a read-only Log table built with MUI Table components, with columns Log ID, Service, and Message. The entire
 * UI is in dark theme. The drawer has its own scroll area; the table itself may also scroll internally if needed. Rows are
 * single-select with highlight feedback. Initial state: drawer is closed; when opened, no row is selected.
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
  Button,
  Drawer,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

interface LogData {
  key: string;
  logId: string;
  service: string;
  message: string;
}

// Generate log data with LOG-771 as target
const generateLogData = (): LogData[] => {
  const services = ['auth-service', 'api-gateway', 'user-service', 'payment-service', 'notification-service'];
  const messages = ['Request processed', 'Connection established', 'Cache miss', 'Rate limit applied', 'Config updated'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    key: `LOG-${750 + i}`,
    logId: `LOG-${750 + i}`,
    service: services[i % services.length],
    message: messages[i % messages.length],
  }));
};

const logData = generateLogData();

export default function T08({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
    setSelectedRowKey(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleRowClick = (record: LogData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'LOG-771') {
      onSuccess();
    }
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            System Logs
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Recent system activity is available in the full log viewer.
          </Typography>
          <Button variant="text" onClick={handleOpenDrawer}>
            View full log
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: 500 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Full Log</Typography>
            <IconButton onClick={handleCloseDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 120px)' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Log ID</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logData.map((row) => (
                  <TableRow
                    key={row.key}
                    onClick={() => handleRowClick(row)}
                    aria-selected={selectedRowKey === row.key}
                    data-row-key={row.key}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: selectedRowKey === row.key ? 'action.selected' : undefined,
                      '&:hover': {
                        backgroundColor: selectedRowKey === row.key ? 'action.selected' : 'action.hover',
                      },
                    }}
                  >
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85em' }}>{row.logId}</TableCell>
                    <TableCell>{row.service}</TableCell>
                    <TableCell>{row.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Drawer>
    </>
  );
}
