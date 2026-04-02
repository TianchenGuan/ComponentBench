'use client';

/**
 * autocomplete_restricted-mui-v2-T03
 *
 * Modal with an async load-on-open MUI Autocomplete for "Warehouse".
 * Options load after a simulated delay. Initial value: Frankfurt-01.
 * Success: Warehouse = "Frankfurt-03" committed, Save warehouse clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import type { TaskComponentProps } from '../../types';

const warehouseList = ['Frankfurt-01', 'Frankfurt-02', 'Frankfurt-03', 'Paris-01'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [warehouse, setWarehouse] = useState<string | null>('Frankfurt-01');
  const [saved, setSaved] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && warehouse === 'Frankfurt-03') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, warehouse, onSuccess]);

  const handlePopupOpen = useCallback(() => {
    setPopupOpen(true);
    setLoading(true);
    setOptions([]);
    const timer = setTimeout(() => {
      setOptions(warehouseList);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setModalOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Chip label={`Current: ${warehouse}`} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage warehouse assignment for this deployment region.
        </Typography>
        <Button variant="contained" onClick={() => { setModalOpen(true); setSaved(false); }}>
          Edit warehouse
        </Button>
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit warehouse</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose the warehouse for asset distribution.
          </Typography>
          <Autocomplete
            size="small"
            open={popupOpen}
            onOpen={handlePopupOpen}
            onClose={() => setPopupOpen(false)}
            options={options}
            loading={loading}
            value={warehouse}
            onChange={(_, v) => { setWarehouse(v); setSaved(false); }}
            freeSolo={false}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Warehouse"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save warehouse</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
