'use client';

/**
 * tags_input-mui-T05: Edit the correct field when two tag inputs are present
 *
 * The UI is a compact **settings panel** with two stacked MUI Autocomplete inputs (multiple + chips).
 * Spacing is set to **compact** so labels and inputs are close together.
 *
 * Instances:
 * - "Skills" (distractor) — pre-filled with chips: "python", "sql".
 * - "Tools" (target) — initially empty.
 *
 * Behavior:
 * - Both inputs allow freeSolo entry; pressing Enter turns the current text into a chip.
 * - Each chip has a delete icon; there is no global clear button in this configuration.
 *
 * Clutter:
 * - A toggle switch ("Public profile") appears below; it does not affect success.
 * - The two Autocomplete inputs are visually similar, so the label must be used to pick the correct instance.
 *
 * Success: The target Tags Input component (Tools) contains exactly these tags (order does not matter): git, docker, kubernetes.
 */

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip, FormControlLabel, Switch } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [skillsTags, setSkillsTags] = React.useState<string[]>(['python', 'sql']);
  const [toolsTags, setToolsTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = toolsTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['git', 'docker', 'kubernetes'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    // Also check that skills remain unchanged
    const skillsUnchanged = skillsTags.length === 2 && 
      skillsTags.includes('python') && 
      skillsTags.includes('sql');
    
    if (isSuccess && skillsUnchanged && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [toolsTags, skillsTags, onSuccess]);

  return (
    <Card sx={{ width: 350 }}>
      <CardContent sx={{ '& > *:not(:last-child)': { mb: 1.5 } }}>
        <Typography variant="h6" gutterBottom>Profile Settings</Typography>
        
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={skillsTags}
          onChange={(_, newValue) => setSkillsTags(newValue as string[])}
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
              label="Skills"
              size="small"
              inputProps={{
                ...params.inputProps,
                'data-testid': 'skills-input',
                'aria-label': 'Skills',
              }}
            />
          )}
        />

        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={toolsTags}
          onChange={(_, newValue) => setToolsTags(newValue as string[])}
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
              label="Tools"
              size="small"
              placeholder="Add tools..."
              inputProps={{
                ...params.inputProps,
                'data-testid': 'tools-input',
                'aria-label': 'Tools',
              }}
            />
          )}
        />

        <FormControlLabel 
          control={<Switch size="small" />} 
          label="Public profile" 
        />
      </CardContent>
    </Card>
  );
}
