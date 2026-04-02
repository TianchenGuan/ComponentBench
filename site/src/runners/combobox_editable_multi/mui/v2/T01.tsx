'use client';

/**
 * combobox_editable_multi-mui-v2-T01
 *
 * Dark dashboard panel. MUI Autocomplete (multiple, disableCloseOnSelect, filterSelectedOptions).
 * Visual reference "Target categories": News, Sports, Finance, Travel.
 * Initial chips: News, Science. Suggestions: News, Sports, Finance, Travel, Science, Weather, Health.
 * Success: Categories = {News, Sports, Finance, Travel}, Save routing clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const options = ['News', 'Sports', 'Finance', 'Travel', 'Science', 'Weather', 'Health'];
const TARGET_SET = ['News', 'Sports', 'Finance', 'Travel'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['News', 'Science']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(value, TARGET_SET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 3 }}>
        <Card sx={{ width: 500 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Routing panel</Typography>

            <Box sx={{ mb: 2, p: 1, borderRadius: 1, bgcolor: 'action.hover' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                Target categories
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {TARGET_SET.map((t) => (
                  <Chip key={t} label={t} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>

            <Typography variant="subtitle2" gutterBottom>Categories</Typography>
            <Autocomplete
              multiple
              disableCloseOnSelect
              filterSelectedOptions
              options={options}
              value={value}
              onChange={(_e, newVal) => { setValue(newVal); setSaved(false); }}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Select categories" size="small" />
              )}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" size="small" onClick={() => setSaved(true)}>
              Save routing
            </Button>
          </CardActions>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
