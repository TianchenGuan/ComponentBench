'use client';

/**
 * listbox_multi-mui-T04: Scroll to select destinations
 *
 * Layout: isolated_card anchored near the top-left of the viewport.
 * Target component: a scrollable Material UI List with sticky subheaders by region (e.g., "Asia", "Europe", "Africa", "Americas").
 * Each item row has a checkbox.
 * Total options: 30 cities spread across subheaders; only ~10 are visible without scrolling.
 * Kyoto is under "Asia", Reykjavík under "Europe", and Cape Town under "Africa" (so at least one target is off-screen initially).
 * Initial state: none selected.
 * No overlays.
 *
 * Success: The target listbox has exactly: Kyoto, Reykjavík, Cape Town.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Checkbox,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

interface CityOption {
  region: string;
  cities: string[];
}

const cityData: CityOption[] = [
  { region: 'Asia', cities: ['Tokyo', 'Seoul', 'Bangkok', 'Singapore', 'Kyoto', 'Hong Kong', 'Mumbai', 'Shanghai'] },
  { region: 'Europe', cities: ['Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam', 'Reykjavík', 'Berlin', 'Vienna'] },
  { region: 'Africa', cities: ['Cairo', 'Marrakech', 'Cape Town', 'Nairobi', 'Tunis', 'Accra', 'Lagos'] },
  { region: 'Americas', cities: ['New York', 'Rio de Janeiro', 'Toronto', 'Buenos Aires', 'Lima', 'Mexico City', 'Vancouver'] },
];

const targetSet = ['Kyoto', 'Reykjavík', 'Cape Town'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

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
    <Card sx={{ width: 360 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Travel destinations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Travel destinations (scroll to find cities).
        </Typography>
        <List
          data-testid="listbox-travel-destinations"
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            maxHeight: 300,
            overflow: 'auto',
            position: 'relative',
          }}
          subheader={<li />}
        >
          {cityData.map((section) => (
            <li key={section.region}>
              <ul style={{ padding: 0 }}>
                <ListSubheader
                  sx={{
                    bgcolor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  {section.region}
                </ListSubheader>
                {section.cities.map((city) => (
                  <ListItem key={city} disablePadding>
                    <ListItemButton onClick={() => handleToggle(city)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selected.includes(city)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={city} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </ul>
            </li>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
