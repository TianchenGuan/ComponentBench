'use client';

/**
 * select_native-mui-v2-T20: Drawer locale settings — set Fallback locale to Japanese and save
 *
 * "Locale settings" button opens a right-side drawer with two MUI NativeSelect controls:
 * "Display language" (starts English, must stay) and "Fallback locale" (starts Spanish → Japanese).
 * Drawer footer: "Save locale settings" / "Discard". Committed on Save only.
 *
 * Success: Fallback locale = "Japanese", Display language = "English", Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Drawer, Box, Checkbox, FormControlLabel, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const languageOptions = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  { label: 'German', value: 'German' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'Korean', value: 'Korean' },
  { label: 'Chinese', value: 'Chinese' },
];

export default function T20({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [displayLang, setDisplayLang] = useState('English');
  const [fallbackLocale, setFallbackLocale] = useState('Spanish');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && fallbackLocale === 'Japanese' && displayLang === 'English') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, fallbackLocale, displayLang, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  const handleDiscard = () => {
    setDisplayLang('English');
    setFallbackLocale('Spanish');
    setSaved(false);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Preferences</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage your language and locale preferences.
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Locale settings</Button>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 380, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>Locale Settings</Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel variant="standard" htmlFor="display-language">Display language</InputLabel>
            <NativeSelect
              data-testid="display-language"
              data-canonical-type="select_native"
              data-selected-value={displayLang}
              value={displayLang}
              onChange={(e) => { setDisplayLang(e.target.value); setSaved(false); }}
              inputProps={{ name: 'display-language', id: 'display-language' }}
            >
              {languageOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel variant="standard" htmlFor="fallback-locale">Fallback locale</InputLabel>
            <NativeSelect
              data-testid="fallback-locale"
              data-canonical-type="select_native"
              data-selected-value={fallbackLocale}
              value={fallbackLocale}
              onChange={(e) => { setFallbackLocale(e.target.value); setSaved(false); }}
              inputProps={{ name: 'fallback-locale', id: 'fallback-locale' }}
            >
              {languageOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
          </FormControl>

          <Divider sx={{ my: 3 }} />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Use locale-specific number format" />
          <FormControlLabel control={<Checkbox />} label="Use locale-specific date format" />

          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>Save locale settings</Button>
            <Button variant="outlined" onClick={handleDiscard}>Discard</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
