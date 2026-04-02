'use client';

/**
 * listbox_multi-mui-v2-T10: Customer segments reference filter card
 *
 * Dashboard with 3 MUI checkbox lists (Customer segments, Product lines, Regions) in a sidebar card.
 * Reference chip row: Enterprise, Education, Non-profit. Customer segments is TARGET.
 * Product lines and Regions start empty and must remain unchanged.
 * Target: Enterprise, Education, Non-profit. Confirm via "Apply segments". High-contrast theme.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Checkbox, Chip, Divider, Box, Stack,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const highContrastTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#000', paper: '#121212' }, text: { primary: '#fff' } },
});

const segmentOptions = ['Enterprise', 'Education', 'Non-profit', 'Mid-market', 'SMB', 'Government', 'Startup'];
const productOptions = ['SaaS', 'Platform', 'API', 'Hardware'];
const regionOptions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];

const referenceChips = ['Enterprise', 'Education', 'Non-profit'];
const targetSet = ['Enterprise', 'Education', 'Non-profit'];

function CheckboxList({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <List dense sx={{ border: '1px solid #424242', borderRadius: 1 }}>
      {options.map(opt => (
        <ListItem key={opt} disablePadding>
          <ListItemButton dense onClick={() => onToggle(opt)}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Checkbox edge="start" size="small" checked={selected.includes(opt)} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={opt} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [segments, setSegments] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(segments, targetSet) && setsEqual(products, []) && setsEqual(regions, [])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, segments, products, regions, onSuccess]);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    const idx = list.indexOf(value);
    const next = [...list];
    if (idx === -1) next.push(value); else next.splice(idx, 1);
    setList(next);
    setSaved(false);
  };

  return (
    <ThemeProvider theme={highContrastTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, display: 'flex', gap: 2, minHeight: '100vh' }}>
        <Card sx={{ width: 300, flexShrink: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Filters</Typography>

            <Typography variant="caption" color="text.secondary">Reference segments</Typography>
            <Stack direction="row" spacing={0.5} sx={{ mb: 2, mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              {referenceChips.map(c => <Chip key={c} label={c} size="small" color="primary" />)}
            </Stack>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Customer segments</Typography>
            <CheckboxList options={segmentOptions} selected={segments} onToggle={v => toggle(segments, setSegments, v)} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Product lines</Typography>
            <CheckboxList options={productOptions} selected={products} onToggle={v => toggle(products, setProducts, v)} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Regions</Typography>
            <CheckboxList options={regionOptions} selected={regions} onToggle={v => toggle(regions, setRegions, v)} />

            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => setSaved(true)}>
              Apply segments
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h5">Customer Analytics</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Revenue and retention by segment
            </Typography>
            <Box sx={{ mt: 4, p: 6, textAlign: 'center', border: '1px dashed #424242', borderRadius: 1 }}>
              <Typography color="text.secondary">Chart area</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
