'use client';

/**
 * tags_input-mui-T10: Pick tags in a small top-right settings panel with three instances
 *
 * The scene is a narrow **settings panel** pinned to the top-right of the viewport.
 * All controls use the **small** size variant, making the input and icons smaller.
 *
 * Instances (3):
 * - "Email tags" (target): MUI Autocomplete multiple chips, starts empty.
 * - "SMS tags" (disabled): looks like the same component but is visibly disabled and cannot be edited.
 * - "Push tags" (distractor): starts with chips "alerts" and "do-not-edit".
 *
 * Options:
 * - Email tags has a suggestion list grouped into categories ("Cadence", "Topic", "Audience").
 * - The tags "weekly" and "product" are in different groups.
 * - Typing into the field filters options; selecting adds a chip.
 *
 * Clutter:
 * - The panel also contains a numeric input "Daily limit" and a Save icon button in the header (not required).
 * - Because placement is top-right, the dropdown may open downward and partially overlap other panel elements (no click traps; just realistic tight space).
 *
 * Success: The target Tags Input component (Email tags) contains exactly these tags (order does not matter): weekly, product.
 */

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Autocomplete, Chip, IconButton, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import type { TaskComponentProps } from '../types';

const emailTagOptions = [
  // Cadence
  'daily', 'weekly', 'monthly', 'quarterly', 'yearly',
  // Topic
  'product', 'marketing', 'engineering', 'sales', 'support',
  // Audience
  'all-users', 'premium', 'trial', 'enterprise', 'free'
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [emailTags, setEmailTags] = React.useState<string[]>([]);
  const [pushTags, setPushTags] = React.useState<string[]>(['alerts', 'do-not-edit']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = emailTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['weekly', 'product'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    // Also verify push tags remain unchanged
    const pushUnchanged = pushTags.length === 2 && 
      pushTags.includes('alerts') && 
      pushTags.includes('do-not-edit');
    
    if (isSuccess && pushUnchanged && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [emailTags, pushTags, onSuccess]);

  return (
    <Card sx={{ width: 300 }}>
      <CardContent sx={{ '& > *:not(:last-child)': { mb: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" fontSize={16}>Notification Tags</Typography>
          <IconButton size="small"><SaveIcon fontSize="small" /></IconButton>
        </Box>

        <Autocomplete
          multiple
          size="small"
          options={emailTagOptions}
          value={emailTags}
          onChange={(_, newValue) => setEmailTags(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
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
              label="Email tags"
              size="small"
              inputProps={{
                ...params.inputProps,
                'data-testid': 'email-tags-input',
                'aria-label': 'Email tags',
              }}
            />
          )}
        />

        <Autocomplete
          multiple
          size="small"
          disabled
          options={[]}
          value={['newsletter']}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
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
              label="SMS tags"
              size="small"
              inputProps={{
                ...params.inputProps,
                'data-testid': 'sms-tags-input',
                'aria-disabled': 'true',
              }}
            />
          )}
        />

        <Autocomplete
          multiple
          size="small"
          options={[]}
          freeSolo
          value={pushTags}
          onChange={(_, newValue) => setPushTags(newValue as string[])}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
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
              label="Push tags"
              size="small"
              inputProps={{
                ...params.inputProps,
                'data-testid': 'push-tags-input',
              }}
            />
          )}
        />

        <TextField
          label="Daily limit"
          type="number"
          size="small"
          defaultValue={100}
          fullWidth
        />
      </CardContent>
    </Card>
  );
}
