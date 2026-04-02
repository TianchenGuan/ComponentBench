'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const campaignSuggestions = [
  'product', 'field', 'docs', 'internal', 'launch', 'partner', 'webinar',
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

export default function T05({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [audienceTags] = useState<string[]>(['community']);
  const [campaignTags, setCampaignTags] = useState<string[]>(['draft']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(campaignTags, ['launch', 'partner', 'webinar']) &&
      setsEqual(audienceTags, ['community'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [campaignTags, audienceTags, onSuccess]);

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Campaign Dashboard</Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ mr: 1 }}>Target badges:</Typography>
        <Chip label="launch" color="primary" size="small" />
        <Chip label="partner" color="secondary" size="small" />
        <Chip label="webinar" color="info" size="small" />
      </Box>

      <Box sx={{ maxWidth: 400 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Audience tags</Typography>
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={[]}
          value={audienceTags}
          readOnly
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Audience tags" />
          )}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Campaign tags</Typography>
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={campaignSuggestions}
          value={campaignTags}
          onChange={(_, val) => setCampaignTags(val)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Add campaign tags" />
          )}
        />
      </Box>
    </Box>
  );
}
