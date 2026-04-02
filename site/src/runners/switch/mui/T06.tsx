'use client';

/**
 * switch-mui-T06: Open drawer and disable public profile
 *
 * Layout: drawer_flow with a trigger button placed near the top-left of the viewport.
 * The main page shows a short paragraph and a button labeled "Privacy controls".
 * The target switch is inside a MUI Drawer that is hidden initially. Clicking "Privacy controls" opens the drawer from the left.
 * Inside the drawer, a small settings list includes one MUI Switch labeled "Public profile" (target) and one non-interactive info line below it.
 * Initial state: "Public profile" is ON.
 * Feedback: toggling updates immediately; closing the drawer is optional and not required for success.
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Drawer, 
  Box,
  FormControlLabel,
  Switch,
  List,
  ListItem
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [publicProfileChecked, setPublicProfileChecked] = useState(true);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setPublicProfileChecked(newChecked);
    if (!newChecked) {
      onSuccess();
    }
  };

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            Manage your privacy settings and control who can see your profile.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setDrawerOpen(true)}
          >
            Privacy controls
          </Button>
        </CardContent>
      </Card>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="privacy-controls-drawer"
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Privacy controls
          </Typography>
          <List>
            <ListItem sx={{ display: 'block', px: 0 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={publicProfileChecked}
                    onChange={handleSwitchChange}
                    data-testid="public-profile-switch"
                    inputProps={{ 'aria-checked': publicProfileChecked }}
                  />
                }
                label="Public profile"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Allow others to view your profile information.
              </Typography>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
