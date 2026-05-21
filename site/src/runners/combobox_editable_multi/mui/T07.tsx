'use client';

/**
 * combobox_editable_multi-mui-T07: Set regions inside an advanced-filters drawer
 *
 * This page uses a drawer flow:
 * - The main page is a dashboard header with a button "Advanced filters" (top-right).
 * - Clicking it opens a right-side Drawer containing filter controls.
 *
 * Inside the drawer there are TWO similar multi-select Autocomplete fields:
 * - "Regions" (target): Material UI Autocomplete (multiple) with options North America, South America, Europe, Asia, Africa, Oceania. Initial selection: empty.
 * - "Countries" (distractor): another Material UI Autocomplete (multiple) listing a handful of countries. Initial selection: "Canada".
 *
 * Other drawer clutter:
 * - A date range input and two checkboxes (not required).
 *
 * No Apply/Save click is required for success; the task ends when the Regions chips equal the target set. You must avoid changing the Countries field.
 *
 * Success: Regions selected values equal {North America, Europe, Asia} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { 
  Autocomplete, TextField, Card, CardContent, Typography, Chip, Button, Box,
  Drawer, Checkbox, FormControlLabel
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const regions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];
const countries = ['Canada', 'United States', 'Mexico', 'Brazil', 'United Kingdom', 'Germany', 'France', 'Japan', 'China', 'Australia'];

const TARGET_SET = ['North America', 'Europe', 'Asia'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [regionsValue, setRegionsValue] = useState<string[]>([]);
  const [countriesValue, setCountriesValue] = useState<string[]>(['Canada']);

  useEffect(() => {
    if (setsEqual(regionsValue, TARGET_SET)) {
      onSuccess();
    }
  }, [regionsValue, onSuccess]);

  return (
    <>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Dashboard</Typography>
            <Button 
              data-testid="open-advanced-filters"
              variant="outlined" 
              onClick={() => setDrawerOpen(true)}
            >
              Advanced filters
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Click "Advanced filters" to configure your filter settings.
          </Typography>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>Advanced Filters</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Regions</Typography>
            <Autocomplete
              data-testid="regions-autocomplete"
              multiple
              options={regions}
              value={regionsValue}
              onChange={(_event, newValue) => setRegionsValue(newValue)}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Select regions" size="small" />
              )}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Countries</Typography>
            <Autocomplete
              data-testid="countries-autocomplete"
              multiple
              options={countries}
              value={countriesValue}
              onChange={(_event, newValue) => setCountriesValue(newValue)}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Select countries" size="small" />
              )}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Date Range</Typography>
            <TextField fullWidth size="small" placeholder="Select date range" />
          </Box>
          
          <Box>
            <FormControlLabel control={<Checkbox />} label="Include archived" />
            <FormControlLabel control={<Checkbox />} label="Show inactive" />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
