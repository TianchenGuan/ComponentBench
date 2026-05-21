'use client';

/**
 * alpha_slider-mui-T06: Scroll to overlays section and set map opacity to 40%
 *
 * A settings panel page contains a long scrollable column of settings (medium clutter):
 * - Top sections: "General", "Performance", "Labels" with various toggles and dropdowns (distractors).
 * - Near the bottom is the "Overlays" section (initially below the fold).
 * - In "Overlays", the target control is a MUI Slider labeled "Map overlay opacity" with a small checkerboard preview.
 * Initial state:
 * - Map overlay opacity starts at 55%.
 * Feedback:
 * - Slider updates the preview immediately; no Apply button.
 *
 * Success: The 'Map overlay opacity' alpha is set to 0.40 (40%). Alpha must be within ±0.015 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, Switch, FormControlLabel, Select, MenuItem, Divider, FormControl, InputLabel } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [mapOpacity, setMapOpacity] = useState(55);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState('en');
  const [hardwareAccel, setHardwareAccel] = useState(true);
  const [cacheSize, setCacheSize] = useState('medium');
  const [showLabels, setShowLabels] = useState(true);
  const [labelSize, setLabelSize] = useState('medium');

  useEffect(() => {
    const alpha = mapOpacity / 100;
    if (isAlphaWithinTolerance(alpha, 0.4, 0.015)) {
      onSuccess();
    }
  }, [mapOpacity, onSuccess]);

  const handleOpacityChange = (_event: Event, newValue: number | number[]) => {
    setMapOpacity(newValue as number);
  };

  return (
    <Card sx={{ width: 400, height: 400, overflow: 'auto' }}>
      <CardContent>
        {/* General Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>General</Typography>
        <FormControlLabel
          control={<Switch checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} />}
          label="Auto-save"
          sx={{ display: 'block', mb: 1 }}
        />
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)} label="Language">
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Performance Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>Performance</Typography>
        <FormControlLabel
          control={<Switch checked={hardwareAccel} onChange={(e) => setHardwareAccel(e.target.checked)} />}
          label="Hardware acceleration"
          sx={{ display: 'block', mb: 1 }}
        />
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Cache size</InputLabel>
          <Select value={cacheSize} onChange={(e) => setCacheSize(e.target.value)} label="Cache size">
            <MenuItem value="small">Small (256MB)</MenuItem>
            <MenuItem value="medium">Medium (512MB)</MenuItem>
            <MenuItem value="large">Large (1GB)</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Labels Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>Labels</Typography>
        <FormControlLabel
          control={<Switch checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />}
          label="Show labels"
          sx={{ display: 'block', mb: 1 }}
        />
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Label size</InputLabel>
          <Select value={labelSize} onChange={(e) => setLabelSize(e.target.value)} label="Label size">
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Overlays Section - TARGET */}
        <Typography variant="h6" sx={{ mb: 2 }}>Overlays</Typography>
        
        {/* Preview */}
        <Box
          sx={{
            width: 60,
            height: 60,
            mb: 2,
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
            borderRadius: 1,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: `rgba(33, 150, 243, ${mapOpacity / 100})`,
              borderRadius: 1,
            }}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Map overlay opacity
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={mapOpacity}
            onChange={handleOpacityChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Map overlay opacity"
            data-testid="map-opacity-slider"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Current: {mapOpacity}%
        </Typography>
      </CardContent>
    </Card>
  );
}
