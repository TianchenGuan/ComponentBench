'use client';

/**
 * listbox_multi-mui-T09: Search within list: select tree species
 *
 * Layout: isolated_card centered titled "Tree species selector".
 * Target component: a composite listbox consisting of a small search TextField directly above a scrollable MUI List of checkbox items.
 * Typing in the search box filters the visible list items but does not clear already selected items.
 * Total options: 40 species (e.g., Acacia, Alder, Ash, Beech, Birch, Cedar, Cypress, Elm, Fir, Maple, Oak, Pine, Redwood, Spruce, Willow, …).
 * Initial state: none selected; search box empty.
 * No overlays.
 *
 * Success: The target listbox has exactly: Redwood, Cedar, Maple, Pine.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const allSpecies = [
  'Acacia', 'Alder', 'Ash', 'Aspen', 'Beech', 'Birch', 'Boxwood', 'Cedar',
  'Cherry', 'Chestnut', 'Cottonwood', 'Cypress', 'Dogwood', 'Elm', 'Eucalyptus',
  'Fir', 'Ginkgo', 'Hawthorn', 'Hazel', 'Hemlock', 'Hickory', 'Holly',
  'Hornbeam', 'Juniper', 'Larch', 'Linden', 'Locust', 'Magnolia', 'Maple',
  'Oak', 'Palm', 'Pecan', 'Pine', 'Poplar', 'Redwood', 'Sequoia', 'Spruce',
  'Sycamore', 'Walnut', 'Willow',
];

const targetSet = ['Redwood', 'Cedar', 'Maple', 'Pine'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  const filteredSpecies = useMemo(() => {
    if (!search.trim()) return allSpecies;
    const lower = search.toLowerCase();
    return allSpecies.filter((s) => s.toLowerCase().includes(lower));
  }, [search]);

  const handleToggle = (value: string) => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];
    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelected(newSelected);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tree species selector
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tree species selector (search and select multiple).
        </Typography>
        <TextField
          data-testid="search-tree-species"
          size="small"
          fullWidth
          placeholder="Search species..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
        <List
          data-testid="listbox-tree-species"
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            maxHeight: 280,
            overflow: 'auto',
          }}
        >
          {filteredSpecies.map((species) => (
            <ListItem key={species} disablePadding>
              <ListItemButton onClick={() => handleToggle(species)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(species)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={species} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected: {selected.join(', ') || 'None'}
        </Typography>
      </CardContent>
    </Card>
  );
}
