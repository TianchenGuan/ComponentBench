'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, Typography, Box, Button } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const searchSuggestions = ['retry', 'nightly', 'release', 'docs', 'backend', 'urgent'];

function setsEqual(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.toLowerCase().trim()));
  const sb = new Set(b.map(s => s.toLowerCase().trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [searchTags, setSearchTags] = useState<string[]>(['draft', 'legacy', 'temp']);
  const [savedSearches] = useState<string[]>(['pinned']);
  const [savedSearchTags, setSavedSearchTags] = useState<string[]>(['draft', 'legacy', 'temp']);
  const [savedSavedSearches] = useState<string[]>(['pinned']);

  const handleApply = () => {
    setSavedSearchTags([...searchTags]);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedSearchTags, ['backend', 'urgent']) &&
      setsEqual(savedSavedSearches, ['pinned'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedSearchTags, savedSavedSearches, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 380 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Filters</Typography>

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Search tags</Typography>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={searchSuggestions}
        value={searchTags}
        onChange={(_, val) => setSearchTags(val)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} placeholder="Add search tags" />
        )}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Saved searches</Typography>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={[]}
        value={savedSearches}
        readOnly
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} placeholder="Saved searches" />
        )}
        sx={{ mb: 2 }}
      />

      <Button size="small" variant="contained" onClick={handleApply}>
        Apply filters
      </Button>
    </Box>
  );
}
