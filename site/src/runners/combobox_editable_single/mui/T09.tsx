'use client';

/**
 * combobox_editable_single-mui-T09: Choose Paris, France over Paris, Texas (dark dashboard)
 *
 * A travel planning dashboard is displayed in dark theme with multiple widgets.
 * The target editable combobox is labeled "Destination" and is implemented with MUI Autocomplete.
 * - Scene: dashboard layout, bottom_left placement, dark theme, comfortable spacing, default scale.
 * - Options (~14) with confusable entries: Paris, France; Paris, Texas; Paris, Ontario; etc.
 * - Initial state: empty.
 * - Distractors: date range widget, price slider, sidebar navigation menu, Search button.
 *
 * Success: The "Destination" combobox value equals "Paris, France".
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Slider, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import type { TaskComponentProps } from '../types';

const destinations = [
  'Paris, France',
  'Paris, Texas',
  'Paris, Ontario',
  'London, UK',
  'London, Ontario',
  'Rome, Italy',
  'Berlin, Germany',
  'Barcelona, Spain',
  'Porto, Portugal',
  'Vienna, Austria',
  'Prague, Czech Republic',
  'Amsterdam, Netherlands',
  'Brussels, Belgium',
  'Lisbon, Portugal',
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [destination, setDestination] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([500, 2000]);

  const handleDestinationChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setDestination(newValue);
    if (newValue === 'Paris, France') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', background: '#1a1a2e', minWidth: 800, borderRadius: 2 }}>
      {/* Sidebar */}
      <Box sx={{ width: 180, background: '#16213e', p: 2 }}>
        <Typography variant="subtitle2" sx={{ color: '#888', mb: 2 }}>Navigation</Typography>
        <List dense>
          {['Dashboard', 'Trips', 'Bookings', 'Settings'].map((item) => (
            <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
              <ListItemText 
                primary={item} 
                primaryTypographyProps={{ 
                  sx: { color: item === 'Dashboard' ? '#4db6ac' : '#888', fontSize: 14 } 
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Travel Dashboard</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Destination Card */}
          <Card sx={{ width: 300, background: '#0f3460' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 2 }}>Destination</Typography>
              <Autocomplete
                data-testid="destination-autocomplete"
                freeSolo
                options={destinations}
                value={destination}
                onChange={handleDestinationChange}
                sx={{
                  '& .MuiInputBase-root': { background: '#1a1a2e' },
                  '& .MuiInputBase-input': { color: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select destination" size="small" />
                )}
              />
            </CardContent>
          </Card>

          {/* Date Range Widget */}
          <Card sx={{ width: 200, background: '#0f3460' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 2 }}>Dates</Typography>
              <Typography variant="body2" sx={{ color: '#aaa' }}>Mar 15 - Mar 22</Typography>
            </CardContent>
          </Card>

          {/* Price Slider Widget */}
          <Card sx={{ width: 200, background: '#0f3460' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 2 }}>Budget</Typography>
              <Slider
                value={priceRange}
                onChange={(_e, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={100}
                max={5000}
                sx={{ color: '#4db6ac' }}
              />
            </CardContent>
          </Card>
        </Box>

        <Button variant="contained" sx={{ mt: 3, background: '#4db6ac' }}>Search</Button>
      </Box>
    </Box>
  );
}
