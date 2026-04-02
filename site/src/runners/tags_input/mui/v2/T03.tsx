'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Autocomplete, TextField, Chip, Typography, Box, Button, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const suggestions = ['qa', 'docs', 'hotfix', 'blocked', 'release', 'notes', 'approved'];

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

export default function T03({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['draft', 'review']);
  const [savedTags, setSavedTags] = useState<string[]>(['draft', 'review']);

  const handleApply = () => {
    setSavedTags([...tags]);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setTags([...savedTags]);
    setDialogOpen(false);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedTags, ['release', 'notes', 'approved'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedTags, onSuccess]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Release Management</Typography>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Edit release tags
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Edit release tags</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1, mt: 1 }}>Release tags</Typography>
          <Autocomplete
            multiple
            freeSolo
            disableCloseOnSelect
            options={suggestions}
            value={tags}
            onChange={(_, val) => setTags(val)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select or type tags" size="small" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
