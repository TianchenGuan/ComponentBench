'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const topicsSuggestions = ['legacy', 'api', 'docs', 'urgent', 'hotfix', 'qa', 'release'];

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

export default function T04({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [topicsTags, setTopicsTags] = useState<string[]>(['api', 'docs', 'legacy', 'urgent']);
  const [archiveTags] = useState<string[]>(['archived', 'read-only']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(topicsTags, ['api', 'docs', 'release', 'urgent']) &&
      setsEqual(archiveTags, ['archived', 'read-only'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [topicsTags, archiveTags, onSuccess]);

  return (
    <Box sx={{ p: 3, maxWidth: 340 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Settings</Typography>

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Topics</Typography>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        limitTags={2}
        options={topicsSuggestions}
        value={topicsTags}
        onChange={(_, val) => setTopicsTags(val)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} placeholder="Add topics" />
        )}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Archive tags</Typography>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={[]}
        value={archiveTags}
        readOnly
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} placeholder="Archive tags" />
        )}
      />
    </Box>
  );
}
