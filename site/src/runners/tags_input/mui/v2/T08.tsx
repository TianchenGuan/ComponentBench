'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const focusSuggestions = ['generic', 'retry', 'docs', 'release', 'deep-dive', 'blocked'];

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

export default function T08({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [headerTags] = useState<string[]>(['summary']);
  const [focusTags, setFocusTags] = useState<string[]>(['generic']);
  const [footerTags] = useState<string[]>(['archived']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(focusTags, ['deep-dive', 'blocked']) &&
      setsEqual(headerTags, ['summary']) &&
      setsEqual(footerTags, ['archived'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [focusTags, headerTags, footerTags, onSuccess]);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', minHeight: '80vh' }}>
      <Box
        sx={{
          width: 320,
          maxHeight: 400,
          overflowY: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Panel Tags</Typography>

        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Header tags</Typography>
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={[]}
          value={headerTags}
          readOnly
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Header tags" />
          )}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Focus tags</Typography>
        <Autocomplete
          multiple
          freeSolo
          size="small"
          disablePortal
          options={focusSuggestions}
          value={focusTags}
          onChange={(_, val) => setFocusTags(val)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Add focus tags" />
          )}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Footer tags</Typography>
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={[]}
          value={footerTags}
          readOnly
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Footer tags" />
          )}
        />
      </Box>
    </Box>
  );
}
