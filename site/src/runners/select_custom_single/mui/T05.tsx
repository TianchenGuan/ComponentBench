'use client';

/**
 * select_custom_single-mui-T05: Scroll to select Home & Garden category
 *
 * Layout: centered isolated card titled "New listing".
 * The card contains one MUI Select labeled "Category", default size and comfortable spacing.
 *
 * Initial state: no category selected.
 * Opening the select shows a Menu with 25 categories. The menu has a fixed max height, so it becomes scrollable.
 * "Home & Garden" is near the bottom and is not visible without scrolling.
 *
 * Categories are plain text, but many are similarly structured (e.g., "Home & Garden", "Home Services", "Garden Tools"),
 * increasing the chance of near-miss selections.
 *
 * Feedback: selecting an item immediately updates the Select's displayed value; no Apply/OK button.
 * No other selects exist in this scene.
 *
 * Success: The MUI Select labeled "Category" has selected value exactly "Home & Garden".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const categories = [
  'Antiques & Collectibles',
  'Art & Crafts',
  'Baby & Kids',
  'Beauty & Personal Care',
  'Books & Magazines',
  'Business & Industrial',
  'Clothing & Accessories',
  'Computers & Tech',
  'Electronics',
  'Food & Beverages',
  'Garden Tools',
  'Health & Wellness',
  'Home & Garden',
  'Home Appliances',
  'Home Services',
  'Jewelry & Watches',
  'Music & Instruments',
  'Office Supplies',
  'Outdoor & Sports',
  'Pet Supplies',
  'Real Estate',
  'Services',
  'Toys & Games',
  'Travel & Leisure',
  'Vehicles & Parts',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue === 'Home & Garden') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>New listing</Typography>
        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            data-testid="category-select"
            value={value}
            label="Category"
            onChange={handleChange}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 250 },
              },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}
