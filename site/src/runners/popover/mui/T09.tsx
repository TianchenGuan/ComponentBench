'use client';

/**
 * popover-mui-T09: Open Service fee popover in compact fees table (3 instances)
 *
 * Table-cell layout with a compact fees table (small scale components).
 * Three rows are shown: 'Platform fee', 'Service fee', 'Support fee'.
 * Each row has a tiny help IconButton in the rightmost cell that opens a MUI Popover on click.
 * Icons are small and closely spaced; row height is reduced due to small scale.
 * Popover titles match the row labels.
 * Initial state: all popovers closed.
 * Success: Open only the 'Service fee' popover.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Popover, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { TaskComponentProps } from '../types';

type FeeType = 'Platform fee' | 'Service fee' | 'Support fee';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [openFee, setOpenFee] = useState<FeeType | null>(null);
  const [anchorEls, setAnchorEls] = useState<Record<FeeType, HTMLButtonElement | null>>({
    'Platform fee': null,
    'Service fee': null,
    'Support fee': null,
  });
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (openFee === 'Service fee' && !successCalledRef.current) {
      // Check that no other popovers are open
      const othersOpen = Object.entries(anchorEls).some(
        ([fee, anchor]) => fee !== 'Service fee' && anchor !== null
      );
      if (!othersOpen) {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [openFee, anchorEls, onSuccess]);

  const handleClick = (fee: FeeType) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEls((prev) => ({ ...prev, [fee]: event.currentTarget }));
    setOpenFee(fee);
  };

  const handleClose = (fee: FeeType) => () => {
    setAnchorEls((prev) => ({ ...prev, [fee]: null }));
    if (openFee === fee) {
      setOpenFee(null);
    }
  };

  const feeDescriptions: Record<FeeType, string> = {
    'Platform fee': 'A fee for using our platform infrastructure.',
    'Service fee': 'A fee for service management and coordination.',
    'Support fee': 'A fee for 24/7 customer support access.',
  };

  const fees: { name: FeeType; amount: string }[] = [
    { name: 'Platform fee', amount: '$2.50' },
    { name: 'Service fee', amount: '$1.99' },
    { name: 'Support fee', amount: '$0.50' },
  ];

  return (
    <Card sx={{ width: 350 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" gutterBottom>
          Fees breakdown
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          Open the &apos;Service fee&apos; info popover.
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 0.5, fontSize: '0.75rem' }}>Fee type</TableCell>
                <TableCell sx={{ py: 0.5, fontSize: '0.75rem' }}>Amount</TableCell>
                <TableCell sx={{ py: 0.5, fontSize: '0.75rem', width: 40 }}>Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.name}>
                  <TableCell sx={{ py: 0.5, fontSize: '0.75rem' }}>{fee.name}</TableCell>
                  <TableCell sx={{ py: 0.5, fontSize: '0.75rem' }}>{fee.amount}</TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={handleClick(fee.name)}
                      data-testid={`fee-popover-target-${fee.name.toLowerCase().replace(' ', '-')}`}
                      sx={{ p: 0.25 }}
                    >
                      <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorEls[fee.name])}
                      anchorEl={anchorEls[fee.name]}
                      onClose={handleClose(fee.name)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <Box sx={{ p: 1.5, maxWidth: 180 }}>
                        <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                          {fee.name}
                        </Typography>
                        <Typography variant="caption">
                          {feeDescriptions[fee.name]}
                        </Typography>
                      </Box>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
