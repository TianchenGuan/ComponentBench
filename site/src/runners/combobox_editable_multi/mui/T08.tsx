'use client';

/**
 * combobox_editable_multi-mui-T08: Scroll to pick two elements (no filtering)
 *
 * The Autocomplete is rendered in the top-right corner in a small compact card titled "Materials".
 * - Theme: light
 * - Spacing: compact
 * - Component scale: small
 * - Target field: Material UI Autocomplete with multiple selection, label "Allowed elements".
 * - Options list contains ~60 chemical elements in alphabetical order.
 * Important behavior for this task:
 * - The dropdown list is NOT filtered by typing (custom filterOptions returns the full list), so you must scroll the list to reach items near the end.
 * - The list is scrollable; Zinc and Zirconium are off-screen when first opened.
 * Initial state: empty.
 *
 * Success: Selected values equal {Zinc, Zirconium} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const elements = [
  'Aluminum', 'Antimony', 'Argon', 'Arsenic', 'Barium', 'Beryllium', 'Bismuth', 'Boron',
  'Bromine', 'Cadmium', 'Calcium', 'Carbon', 'Cerium', 'Cesium', 'Chlorine', 'Chromium',
  'Cobalt', 'Copper', 'Fluorine', 'Gallium', 'Germanium', 'Gold', 'Hafnium', 'Helium',
  'Hydrogen', 'Indium', 'Iodine', 'Iridium', 'Iron', 'Krypton', 'Lead', 'Lithium',
  'Magnesium', 'Manganese', 'Mercury', 'Molybdenum', 'Neon', 'Nickel', 'Niobium', 'Nitrogen',
  'Osmium', 'Oxygen', 'Palladium', 'Phosphorus', 'Platinum', 'Potassium', 'Radium', 'Rhodium',
  'Rubidium', 'Ruthenium', 'Scandium', 'Selenium', 'Silicon', 'Silver', 'Sodium', 'Strontium',
  'Sulfur', 'Tantalum', 'Tellurium', 'Thallium', 'Tin', 'Titanium', 'Tungsten', 'Uranium',
  'Vanadium', 'Xenon', 'Yttrium', 'Zinc', 'Zirconium'
];

const TARGET_SET = ['Zinc', 'Zirconium'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 300 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '0.9rem' }}>Materials</Typography>
        <Typography variant="caption" display="block" gutterBottom sx={{ fontSize: '0.7rem' }}>Allowed elements</Typography>
        <Autocomplete
          data-testid="allowed-elements"
          multiple
          size="small"
          options={elements}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          filterOptions={(options) => options} // Disable filtering - return all options
          ListboxProps={{ style: { maxHeight: 200 } }}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Select elements" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
