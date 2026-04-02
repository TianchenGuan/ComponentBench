'use client';

/**
 * switch-mui-T10: Scroll dashboard and enable Live updates
 *
 * Layout: dashboard with multiple cards; the target card is positioned toward the bottom-left of the viewport and may require page scrolling to reach.
 * Spacing: compact; Scale: small — the target uses a small MUI Switch (size="small") with tighter spacing in the card.
 * Several cards above include unrelated toggles (e.g., "Email summaries", "Auto-refresh charts"), creating multiple switch instances on the page.
 * The target card is titled "Updates" and contains the labeled switch "Live updates".
 * Initial state: "Live updates" is OFF.
 * Clutter: medium — charts placeholders and buttons exist in other cards, but only the "Live updates" switch affects success.
 * Feedback: toggling updates immediately; no confirmation dialog.
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  FormControlLabel, 
  Switch,
  Box,
  Button
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState(false);

  const handleLiveUpdatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setLiveUpdates(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Box sx={{ minHeight: 800, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Top row cards */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={emailSummaries}
                  onChange={(e) => setEmailSummaries(e.target.checked)}
                  data-testid="email-summaries-switch"
                />
              }
              label={<Typography variant="body2">Email summaries</Typography>}
            />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Charts
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  data-testid="auto-refresh-switch"
                />
              }
              label={<Typography variant="body2">Auto-refresh charts</Typography>}
            />
            <Box sx={{ height: 100, bgcolor: 'grey.100', mt: 1, borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Box>

      {/* Middle placeholder content */}
      <Card>
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Analytics Overview
          </Typography>
          <Box sx={{ height: 150, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">Chart placeholder</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button variant="outlined" size="small">Export</Button>
            <Button variant="outlined" size="small">Refresh</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Target card at bottom */}
      <Card data-testid="updates-card">
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Updates
          </Typography>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={liveUpdates}
                onChange={handleLiveUpdatesChange}
                data-testid="live-updates-switch"
                inputProps={{ 'aria-checked': liveUpdates }}
              />
            }
            label={<Typography variant="body2">Live updates</Typography>}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
