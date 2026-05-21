'use client';

/**
 * tags_input-mui-T04: Filter a long suggestion list and select two items
 *
 * The scene is a small **form section** docked to the bottom-right of the page (placement != center).
 * It contains several filter controls; the target component is labeled "Tags".
 *
 * Target component details:
 * - MUI Autocomplete in multiple mode with Chips.
 * - A longer options list (≈40 food keywords) is provided; many begin with "pa…" (e.g., pasta, pastry, papaya, paprika, parsley).
 * - As the user types, the listbox filters to matching options; selecting an option adds a chip.
 *
 * Initial state:
 * - Tags is empty.
 *
 * Distractors (clutter=medium):
 * - A "Category" single-select above Tags.
 * - Two checkboxes ("In stock", "On sale") below.
 * - None of these affect the success condition.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): pasta, pastry.
 */

import React, { useRef, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Autocomplete, TextField, Chip, 
  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const foodOptions = [
  'apple', 'apricot', 'avocado', 'bacon', 'bagel', 'banana', 'basil', 'beef',
  'bread', 'broccoli', 'butter', 'cabbage', 'carrot', 'cheese', 'chicken',
  'chocolate', 'cinnamon', 'coconut', 'coffee', 'corn', 'cream', 'cucumber',
  'egg', 'fish', 'flour', 'garlic', 'ginger', 'grape', 'honey', 'lemon',
  'lettuce', 'mango', 'milk', 'mushroom', 'noodle', 'olive', 'onion', 'orange',
  'papaya', 'paprika', 'parsley', 'pasta', 'pastry', 'peach', 'peanut', 'pepper'
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['pasta', 'pastry'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card sx={{ width: 320 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Product Filters</Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select label="Category" defaultValue="all">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="produce">Produce</MenuItem>
            <MenuItem value="bakery">Bakery</MenuItem>
            <MenuItem value="dairy">Dairy</MenuItem>
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          freeSolo
          options={foodOptions}
          value={tags}
          onChange={(_, newValue) => setTags(newValue as string[])}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              size="small"
              placeholder="Search tags..."
              inputProps={{
                ...params.inputProps,
                'data-testid': 'tags-input',
              }}
            />
          )}
          sx={{ mb: 2 }}
        />

        <FormControlLabel control={<Checkbox size="small" />} label="In stock" />
        <FormControlLabel control={<Checkbox size="small" />} label="On sale" />
      </CardContent>
    </Card>
  );
}
