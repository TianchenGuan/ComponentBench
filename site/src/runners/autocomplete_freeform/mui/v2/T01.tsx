'use client';

/**
 * autocomplete_freeform-mui-v2-T01: Collapsed chips in dark panel with explicit save
 *
 * Dark dashboard panel with two chip Autocompletes (Labels, Watch tags).
 * Labels uses limitTags=1 so chips collapse when blurred. Start with {backend},
 * end with exactly {backend, urgent, p0}. Watch tags must stay {triage}.
 * Click "Save labels" to commit.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Autocomplete, TextField, Chip, Paper, Button, Typography, Box, Stack,
  createTheme, ThemeProvider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const labelOptions = ['backend', 'urgent', 'p0', 'p1', 'frontend', 'qa'];
const watchOptions = ['triage', 'deploy', 'review'];

const setsEqual = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [labels, setLabels] = useState<string[]>(['backend']);
  const [watchTags, setWatchTags] = useState<string[]>(['triage']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleSave = useCallback(() => setSaved(true), []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (setsEqual(labels, ['backend', 'urgent', 'p0']) && setsEqual(watchTags, ['triage'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, labels, watchTags, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Paper sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>Ticket labels</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage labels and watch tags for this ticket.
          </Typography>

          <Stack spacing={3}>
            <div>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Labels</Typography>
              <Autocomplete
                multiple
                freeSolo
                filterSelectedOptions
                limitTags={1}
                data-testid="labels"
                options={labelOptions}
                value={labels}
                onChange={(_e, newVal) => setLabels(newVal as string[])}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} size="small" placeholder="Add label" />
                )}
              />
            </div>

            <div>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Watch tags</Typography>
              <Autocomplete
                multiple
                freeSolo
                filterSelectedOptions
                data-testid="watch-tags"
                options={watchOptions}
                value={watchTags}
                onChange={(_e, newVal) => setWatchTags(newVal as string[])}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} size="small" placeholder="Add tag" />
                )}
              />
            </div>
          </Stack>

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="contained" onClick={handleSave}>Save labels</Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
