'use client';

/**
 * search_input-mui-T10: Dark drawer filters: select category and apply
 *
 * Drawer flow: the main page shows a button labeled "Filters" in the top-right.
 * Clicking it opens a right-side Drawer titled "Filters".
 * Inside the drawer is a single MUI Autocomplete labeled "Category search" with placeholder "Type to filter categories…".
 * Options include: Electronics, Electrical, Books, Clothing, Home.
 * At the bottom of the drawer there is an "Apply filters" button (required to commit).
 * Initial state: no category selected.
 * Feedback: after clicking "Apply filters", the main page updates a pill "Category: Electronics".
 * No additional controls or distractors are present in the drawer besides the search field and the Apply button.
 *
 * Success: Within the Filters drawer, the Category search Autocomplete has applied_query equal to "Electronics" after clicking "Apply filters".
 */

import React, { useState, useRef } from 'react';
import { Button, Drawer, Box, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const categories = ['Electronics', 'Electrical', 'Books', 'Clothing', 'Home'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleApply = () => {
    setAppliedCategory(selectedCategory);
    if (selectedCategory === 'Electronics' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
    setIsDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
      <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>
        Filters
      </Button>

      {appliedCategory && (
        <Chip
          label={`Category: ${appliedCategory}`}
          color="primary"
          onDelete={() => setAppliedCategory(null)}
        />
      )}

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          <Autocomplete
            id="search-category"
            options={categories}
            value={selectedCategory}
            onChange={(_e, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category search"
                placeholder="Type to filter categories…"
                inputProps={{
                  ...params.inputProps,
                  'data-testid': 'search-category',
                }}
              />
            )}
            sx={{ mb: 2 }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            onClick={handleApply}
            fullWidth
          >
            Apply filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
