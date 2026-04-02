'use client';

/**
 * combobox_editable_multi-mui-T04: Search-select four 'In-*' movies
 *
 * Centered isolated card titled "Movie night".
 * - Material UI Autocomplete configured for multiple selection from a predefined options list (no freeSolo).
 * - Label: "Movie picks"
 * - Options list contains ~50 movies. Several share similar prefixes and short names, including:
 *   - Inception
 *   - Interstellar
 *   - Inside Out
 *   - Iron Man
 *   - (and other distractors like Inferno, Insomnia, It, etc.)
 * - Initial state: empty selection.
 * The intended interaction is to type partial titles to filter the list and select the four target movies as chips.
 *
 * Success: Selected values equal {Inception, Interstellar, Inside Out, Iron Man} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const movies = [
  'Inception', 'Interstellar', 'Inside Out', 'Iron Man', 'Inferno', 'Insomnia', 'It',
  'Avatar', 'Avengers', 'Ant-Man', 'Aquaman', 'American Psycho',
  'Batman', 'Black Panther', 'Blade Runner', 'Braveheart',
  'Captain America', 'Cars', 'Coco', 'Constantine',
  'Deadpool', 'Django Unchained', 'Doctor Strange', 'Dune',
  'E.T.', 'Edge of Tomorrow', 'Elf', 'Enchanted',
  'Fast & Furious', 'Finding Nemo', 'Forrest Gump', 'Frozen',
  'Gladiator', 'Godfather', 'Gravity', 'Guardians of the Galaxy',
  'Harry Potter', 'Hancock', 'Her', 'Hobbit',
  'Indiana Jones', 'Independence Day', 'Into the Wild',
  'Joker', 'Jaws', 'Jumanji', 'Jurassic Park',
  'Kill Bill', 'King Kong', 'Knives Out',
  'La La Land', 'Logan', 'Lord of the Rings',
];

const TARGET_SET = ['Inception', 'Interstellar', 'Inside Out', 'Iron Man'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Movie night</Typography>
        <Typography variant="subtitle2" gutterBottom>Movie picks</Typography>
        <Autocomplete
          data-testid="movie-picks"
          multiple
          options={movies}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Search movies" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
