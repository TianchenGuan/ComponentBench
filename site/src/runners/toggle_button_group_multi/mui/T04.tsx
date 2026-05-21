'use client';

/**
 * toggle_button_group_multi-mui-T14: Customize quick actions in drawer
 *
 * Layout: drawer_flow with the interactive content anchored to the top-right 
 * (a right-side drawer slides in).
 *
 * The main page shows a dashboard header with a button labeled "Customize dashboard".
 * - Clicking it opens a right-side MUI Drawer titled "Customize dashboard".
 *
 * Inside the drawer:
 * - A section labeled "Quick actions" contains a ToggleButtonGroup (multiple selection) 
 *   with four buttons: Create, Export, Share, Delete
 * - Initial state: Create and Share are selected.
 * - A brief helper text under the label explains "Choose which quick actions appear 
 *   in the header" (non-interactive).
 *
 * Drawer footer:
 * - "Cancel" and "Done" buttons. Changes are committed only when Done is clicked.
 *
 * Clutter=low: there is one additional unrelated switch ("Show tips") in the drawer 
 * but it does not affect success.
 *
 * Success: Selected options equal exactly: Create, Export, Share (require_confirm: true, confirm_control: Done)
 */

import React, { useState } from 'react';
import { 
  Card, CardContent, Button, Drawer, Box, Typography, 
  FormControlLabel, Switch, Divider 
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TaskComponentProps } from '../types';

const TARGET_SET = new Set(['Create', 'Export', 'Share']);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Create', 'Share']);
  const [showTips, setShowTips] = useState(true);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSelected(newFormats);
  };

  const handleDone = () => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      setDrawerOpen(false);
      onSuccess();
    } else {
      setDrawerOpen(false);
    }
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Dashboard
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setDrawerOpen(true)}
            data-testid="customize-dashboard-button"
          >
            Customize dashboard
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 360 } }}
        data-testid="customize-drawer"
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Customize dashboard
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Quick actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose which quick actions appear in the header.
            </Typography>

            <ToggleButtonGroup
              value={selected}
              onChange={handleChange}
              aria-label="quick actions"
              size="small"
              sx={{ flexWrap: 'wrap', gap: 1 }}
              data-testid="quick-actions-group"
            >
              <ToggleButton value="Create" aria-label="Create" data-testid="action-create">
                Create
              </ToggleButton>
              <ToggleButton value="Export" aria-label="Export" data-testid="action-export">
                Export
              </ToggleButton>
              <ToggleButton value="Share" aria-label="Share" data-testid="action-share">
                Share
              </ToggleButton>
              <ToggleButton value="Delete" aria-label="Delete" data-testid="action-delete">
                Delete
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={<Switch checked={showTips} onChange={(e) => setShowTips(e.target.checked)} />}
            label="Show tips"
          />
        </Box>

        <Box sx={{ p: 3, mt: 'auto', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => setDrawerOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDone} data-testid="done-button">
            Done
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
