'use client';

/**
 * date_picker_single-mui-v2-T07: Ship by from visual reference in drawer + Save
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Drawer,
  Typography,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [publishOn, setPublishOn] = useState<Dayjs | null>(dayjs('2027-02-01'));
  const [shipBy, setShipBy] = useState<Dayjs | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (
      saved &&
      shipBy &&
      shipBy.isValid() &&
      shipBy.format('YYYY-MM-DD') === '2027-02-14' &&
      publishOn?.format('YYYY-MM-DD') === '2027-02-01'
    ) {
      onSuccess();
    }
  }, [saved, shipBy, publishOn, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Edit shipment dates
        </Button>
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 380 } }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shipment dates
            </Typography>
            <Card
              data-testid="ship-by-reference"
              variant="outlined"
              sx={{ mb: 2, bgcolor: '#e8f4fc', borderColor: '#90caf9' }}
            >
              <CardContent sx={{ py: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Reference
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="overline" display="block">
                      February
                    </Typography>
                    <Typography variant="h3" component="span" sx={{ fontWeight: 700 }}>
                      14
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    2027
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Stack spacing={2}>
              <Box>
                <Typography component="label" sx={{ fontWeight: 500, fontSize: 14, display: 'block', mb: 0.5 }}>
                  Publish on
                </Typography>
                <DatePicker
                  value={publishOn}
                  onChange={(v) => setPublishOn(v)}
                  format="YYYY-MM-DD"
                  readOnly
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'publish-on' },
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography component="label" sx={{ fontWeight: 500, fontSize: 14, display: 'block', mb: 0.5 }}>
                  Ship by
                </Typography>
                <DatePicker
                  value={shipBy}
                  onChange={(v) => setShipBy(v)}
                  closeOnSelect={false}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'ship-by' },
                    },
                    actionBar: { actions: ['cancel', 'accept'] },
                  }}
                />
              </Box>
            </Stack>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => setSaved(true)}
              data-testid="save-shipment-dates"
            >
              Save shipment dates
            </Button>
          </Box>
        </Drawer>
      </Box>
    </LocalizationProvider>
  );
}
