'use client';

/**
 * masked_input-mui-T06: Update asset tag in table
 * 
 * Table-cell layout: a small inventory table is centered on the page with several rows (e.g., Printer-01, Printer-02, Printer-03) and columns (Device, Status, Asset tag).
 * Only the Asset tag cell for the row labeled "Printer-03" contains an editable masked MUI TextField; other rows show read-only text.
 * The mask enforces the pattern "AT-####" and displays a placeholder like "AT-____". The Printer-03 Asset tag starts as "AT-0041".
 * The table also includes non-target UI (row hover states, sort icons) as realistic clutter, but only the masked input value determines success.
 * 
 * Success: The editable "Asset tag" masked input value equals "AT-0720".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, Chip
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const AssetTagMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function AssetTagMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="AT-0000"
        definitions={{
          '0': /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
);

export default function T06({ onSuccess }: TaskComponentProps) {
  const [assetTag, setAssetTag] = useState('AT-0041');

  useEffect(() => {
    if (assetTag === 'AT-0720') {
      onSuccess();
    }
  }, [assetTag, onSuccess]);

  const rows = [
    { device: 'Printer-01', status: 'Online', assetTag: 'AT-0012', editable: false },
    { device: 'Printer-02', status: 'Offline', assetTag: 'AT-0023', editable: false },
    { device: 'Printer-03', status: 'Online', assetTag: assetTag, editable: true },
    { device: 'Printer-04', status: 'Maintenance', assetTag: 'AT-0054', editable: false },
  ];

  return (
    <TableContainer component={Paper} sx={{ width: 600 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Device</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Asset tag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow 
              key={row.device} 
              data-row={row.device}
              sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
              <TableCell>{row.device}</TableCell>
              <TableCell>
                <Chip 
                  label={row.status}
                  size="small"
                  color={row.status === 'Online' ? 'success' : row.status === 'Offline' ? 'error' : 'warning'}
                />
              </TableCell>
              <TableCell>
                {row.editable ? (
                  <TextField
                    size="small"
                    placeholder="AT-____"
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value)}
                    slotProps={{
                      input: {
                        inputComponent: AssetTagMaskCustom as any,
                      },
                    }}
                    inputProps={{
                      'data-testid': 'asset-tag',
                      style: { fontFamily: 'monospace', width: 80 },
                    }}
                    sx={{ '& .MuiInputBase-root': { fontSize: 13 } }}
                  />
                ) : (
                  <span style={{ fontFamily: 'monospace' }}>{row.assetTag}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
