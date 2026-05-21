'use client';

/**
 * combobox_editable_multi-mui-v2-T04
 *
 * Drawer flow: "Advanced filters" opens a drawer with two MUI Autocomplete (multiple) fields:
 *   - Regions (initial: none) — target
 *   - Countries (initial: Canada) — must remain unchanged
 * Region options: North America, South America, Europe, Asia, Africa, Oceania.
 * disableCloseOnSelect enabled. Also contains a date range field and a checkbox.
 * Success: Regions = {North America, Europe, Asia}, Countries = {Canada}, Save filters clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Button,
  Card,
  CardContent,
  Typography,
  Drawer,
  Box,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const regionOptions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];
const countryOptions = ['Canada', 'United States', 'Mexico', 'Brazil', 'Germany', 'Japan'];
const TARGET_REGIONS = ['North America', 'Europe', 'Asia'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>(['Canada']);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(regions, TARGET_REGIONS) && setsEqual(countries, ['Canada'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, regions, countries, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ width: 440 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Report filters</Typography>
          <Typography variant="body2" color="text.secondary">
            Regions: {regions.length ? regions.join(', ') : '(none)'} | Countries: {countries.join(', ')}
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => setOpen(true)}>
            Advanced filters
          </Button>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 380, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">Advanced filters</Typography>

          <TextField label="Start date" size="small" defaultValue="2025-01-01" type="date" InputLabelProps={{ shrink: true }} />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Include archived" />
          <Divider />

          <Typography variant="subtitle2">Regions</Typography>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={regionOptions}
            value={regions}
            onChange={(_e, v) => { setRegions(v); setSaved(false); }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select regions" size="small" />
            )}
          />

          <Typography variant="subtitle2">Countries</Typography>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={countryOptions}
            value={countries}
            onChange={(_e, v) => { setCountries(v); setSaved(false); }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select countries" size="small" />
            )}
          />

          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save filters</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
