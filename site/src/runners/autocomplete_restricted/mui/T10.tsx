'use client';

/**
 * autocomplete_restricted-mui-T10: Match warehouse code from a label in a drawer
 *
 * setup_description:
 * The main page shows an "Order #A-1835" summary with a button **Edit order**.
 *
 * Clicking **Edit order** opens a right-side **drawer** (drawer_flow).
 * Inside the drawer:
 * - At the top is a read-only "order label" graphic that includes a bold code **WH-02** (this is the reference).
 * - Below it is one Material UI Autocomplete field labeled **Fulfillment warehouse** (target component).
 *
 * Component behavior:
 * - Theme: light; spacing: comfortable; size: default.
 * - Restricted: options are WH-01, WH-02, WH-03, WH-04.
 * - Initial state: Fulfillment warehouse is empty.
 * - Selecting an option commits immediately; no additional Save action is required.
 *
 * The agent must open the drawer, read the reference code on the label, and select the matching warehouse option.
 *
 * Success: The "Fulfillment warehouse" Autocomplete has selected value "WH-02".
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const warehouses = ['WH-01', 'WH-02', 'WH-03', 'WH-04'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'WH-02') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order #A-1835
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Status: Processing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items: 3
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: $127.50
            </Typography>
            <Button
              variant="contained"
              onClick={() => setDrawerOpen(true)}
              sx={{ mt: 2 }}
            >
              Edit order
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Edit Order
          </Typography>

          {/* Order label (reference) */}
          <Box
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 2,
              mb: 3,
              border: '2px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Order Label
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Warehouse:</Typography>
              <Chip
                data-testid="order-label.warehouse-code"
                label="WH-02"
                size="small"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              />
            </Stack>
          </Box>

          {/* Fulfillment warehouse selector */}
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Fulfillment warehouse
          </Typography>
          <Autocomplete
            data-testid="warehouse-autocomplete"
            options={warehouses}
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select warehouse" size="small" />
            )}
            freeSolo={false}
          />
        </Box>
      </Drawer>
    </>
  );
}
