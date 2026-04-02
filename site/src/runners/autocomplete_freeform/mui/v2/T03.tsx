'use client';

/**
 * autocomplete_freeform-mui-v2-T03: Async office picker in modal with explicit save
 *
 * Click "Add office" to open a modal. The Office Autocomplete uses async search-as-you-type.
 * Select `San Sebastián Office` from the async results. Click "Save office".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Paper, Typography, Box, CircularProgress,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const allOffices = [
  'San Diego Office',
  'San José Office',
  'San Sebastián Office',
  'Santiago Office',
];

function useAsyncSearch(query: string) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setOptions([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      setOptions(allOffices.filter(o => o.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return { options, loading };
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [fromSuggestion, setFromSuggestion] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const { options, loading } = useAsyncSearch(inputValue);

  const handleSave = useCallback(() => {
    setSaved(true);
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (selectedOffice === 'San Sebastián Office' && fromSuggestion) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selectedOffice, fromSuggestion, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>Office Directory</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage office assignments for your organization.
        </Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>Add office</Button>
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add office</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>Office</Typography>
          <Autocomplete
            freeSolo
            data-testid="office-autocomplete"
            options={options}
            loading={loading}
            filterOptions={(x) => x}
            inputValue={inputValue}
            onInputChange={(_e, val, reason) => {
              setInputValue(val);
              if (reason === 'input') {
                setFromSuggestion(false);
                setSelectedOffice(null);
              }
            }}
            onChange={(_e, val) => {
              if (typeof val === 'string' && allOffices.includes(val)) {
                setSelectedOffice(val);
                setFromSuggestion(true);
              } else if (typeof val === 'string') {
                setSelectedOffice(val);
                setFromSuggestion(false);
              } else {
                setSelectedOffice(null);
                setFromSuggestion(false);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Type to search offices"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && <CircularProgress color="inherit" size={16} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save office</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
