'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const emailSuggestions = [
  { group: 'Frequency', label: 'daily' },
  { group: 'Type', label: 'marketing' },
  { group: 'Type', label: 'customer' },
  { group: 'Type', label: 'billing' },
  { group: 'Frequency', label: 'weekly' },
  { group: 'Type', label: 'product' },
];

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

export default function T01({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [emailTags, setEmailTags] = useState<string[]>([]);
  const [pushTags] = useState<string[]>(['alerts', 'do-not-edit']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(emailTags, ['weekly', 'product']) &&
      setsEqual(pushTags, ['alerts', 'do-not-edit'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [emailTags, pushTags, onSuccess]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        width: 280,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Notification Settings</Typography>

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Email tags</Typography>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={emailSuggestions.map(o => o.label)}
        groupBy={(option) => {
          const found = emailSuggestions.find(s => s.label === option);
          return found ? found.group : '';
        }}
        value={emailTags}
        onChange={(_, val) => setEmailTags(val)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => <TextField {...params} placeholder="Add email tags" />}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>SMS tags</Typography>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        disabled
        options={[]}
        value={[]}
        renderInput={(params) => <TextField {...params} placeholder="Disabled" />}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Push tags</Typography>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={[]}
        value={pushTags}
        readOnly
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => <TextField {...params} placeholder="Push tags" />}
      />
    </Box>
  );
}
