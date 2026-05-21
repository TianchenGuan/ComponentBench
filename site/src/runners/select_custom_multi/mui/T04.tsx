'use client';

/**
 * select_custom_multi-mui-T04: Set hobbies with two similar fields
 *
 * Scene context: theme=light, spacing=comfortable, layout=form_section, placement=center, scale=default, instances=2, guidance=text, clutter=none.
 * Layout: a minimal form section titled "About you" centered on the page.
 * There are two MUI Autocomplete (multiple, freeSolo) fields:
 *   1) "Skills" (distractor instance)
 *   2) "Hobbies" (TARGET instance)
 * Both fields share the same dropdown suggestion list of 12 activities: Reading, Writing, Hiking, Cooking, Painting, Photography, Gaming, Running, Swimming, Travel, Gardening, Music.
 * Initial state:
 *   - Skills has chips "Reading" and "Writing" (distractor).
 *   - Hobbies is empty.
 * No other form controls are included in this section (clutter: none). There is no Save button; chips update immediately.
 *
 * Success: Only 'Hobbies' is evaluated. The selected values are exactly: Hiking, Cooking, Photography (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const activities = [
  'Reading', 'Writing', 'Hiking', 'Cooking', 'Painting', 'Photography',
  'Gaming', 'Running', 'Swimming', 'Travel', 'Gardening', 'Music'
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [skills, setSkills] = useState<string[]>(['Reading', 'Writing']);
  const [hobbies, setHobbies] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Hiking', 'Cooking', 'Photography']);
    const currentSet = new Set(hobbies);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [hobbies, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>About you</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            multiple
            freeSolo
            data-testid="skills-select"
            options={activities}
            value={skills}
            onChange={(_, newValue) => setSkills(newValue as string[])}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Skills" placeholder="Select skills" />
            )}
          />
        </Box>

        <Autocomplete
          multiple
          freeSolo
          data-testid="hobbies-select"
          options={activities}
          value={hobbies}
          onChange={(_, newValue) => setHobbies(newValue as string[])}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Hobbies" placeholder="Select hobbies" />
          )}
        />
      </CardContent>
    </Card>
  );
}
