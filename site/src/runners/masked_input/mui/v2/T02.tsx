'use client';

/**
 * masked_input-mui-v2-T02: Backup vehicle plate in compact fleet table
 *
 * A compact MUI Table "Fleet record" near the bottom-right shows two rows: "Primary van"
 * and "Backup van" with columns Vehicle, Vehicle plate, and a row-local Save button.
 * Each Vehicle plate cell is a masked TextField (size="small") with pattern AAA-####.
 * Primary starts as QPX-0421; Backup starts as QPX-0401.
 *
 * Success: Backup van plate = "QPX-0471" saved; Primary unchanged.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PlateMask = forwardRef<HTMLInputElement, MaskProps>(function PlateMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="AAA-0000"
      definitions={{ 'A': /[A-Za-z]/, '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) =>
        onChange({ target: { name: props.name, value: value.toUpperCase() } })
      }
      overwrite
    />
  );
});

const INITIAL_PRIMARY = 'QPX-0421';
const INITIAL_BACKUP = 'QPX-0401';

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryValue, setPrimaryValue] = useState(INITIAL_PRIMARY);
  const [backupValue, setBackupValue] = useState(INITIAL_BACKUP);
  const [backupSaved, setBackupSaved] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (backupSaved && backupValue === 'QPX-0471' && primaryValue === INITIAL_PRIMARY) {
      successFired.current = true;
      onSuccess();
    }
  }, [backupSaved, backupValue, primaryValue, onSuccess]);

  const renderPlateCell = (
    value: string,
    onChange: (v: string) => void,
    resetSaved?: () => void,
  ) => (
    <TextField
      size="small"
      value={value}
      onChange={(e) => { onChange(e.target.value); resetSaved?.(); }}
      slotProps={{ input: { inputComponent: PlateMask as any } }}
      sx={{ width: 130 }}
    />
  );

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, width: 480, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Fleet record</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Vehicle</TableCell>
            <TableCell>Vehicle plate</TableCell>
            <TableCell>State</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Primary van</TableCell>
            <TableCell>
              {renderPlateCell(primaryValue, setPrimaryValue)}
            </TableCell>
            <TableCell>Active</TableCell>
            <TableCell>
              <Button size="small" variant="outlined" disabled>Save</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Backup van</TableCell>
            <TableCell>
              {renderPlateCell(backupValue, setBackupValue, () => setBackupSaved(false))}
            </TableCell>
            <TableCell>Standby</TableCell>
            <TableCell>
              <Button size="small" variant="contained" onClick={() => setBackupSaved(true)}>
                Save
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
