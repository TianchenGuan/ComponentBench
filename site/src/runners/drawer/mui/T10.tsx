'use client';

/**
 * drawer-mui-T10: Close multiple drawers to reach a clean page state
 *
 * Layout: isolated_card centered with comfortable spacing. Clutter is LOW: only controls related to the three drawers are shown.
 *
 * There are THREE MUI drawer instances on the page:
 * 1) Navigation drawer (variant="persistent", anchor="left")
 * 2) Details drawer (variant="temporary", anchor="right")
 * 3) Help drawer (variant="temporary", anchor="bottom")
 *
 * Initial state:
 * - Navigation drawer is OPEN (pinned, no backdrop).
 * - Details drawer is OPEN (with backdrop).
 * - Help drawer is CLOSED.
 *
 * Controls:
 * - Navigation drawer has a toggle button labeled "Unpin navigation" inside its header area.
 * - Details drawer has a header close (X) icon and also supports Escape/backdrop click.
 * - Help drawer has a trigger button "Open help" (not needed) and a close icon when open.
 *
 * Task requirement:
 * - End state must have ALL drawers closed (none visible).
 *
 * Feedback:
 * - When each drawer closes, its panel disappears; for the temporary Details drawer, the backdrop disappears as well.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [navOpen, setNavOpen] = useState(true); // Start open
  const [detailsOpen, setDetailsOpen] = useState(true); // Start open
  const [helpOpen, setHelpOpen] = useState(false); // Closed
  const successCalledRef = useRef(false);

  // Success when ALL drawers are closed
  useEffect(() => {
    if (!navOpen && !detailsOpen && !helpOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [navOpen, detailsOpen, helpOpen, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Drawer Management
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Close all open drawers to complete the task.
        </Typography>
        
        <Button variant="outlined" disabled>
          Open help
        </Button>

        {/* Navigation drawer (persistent, left) */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={navOpen}
          data-testid="drawer-nav"
          sx={{
            '& .MuiDrawer-paper': {
              position: 'relative',
              width: 200,
            },
          }}
        >
          <Box sx={{ width: 200, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={500}>
                Navigation
              </Typography>
            </Stack>
            <List dense>
              <ListItem>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Projects" />
              </ListItem>
            </List>
            <Button
              size="small"
              onClick={() => setNavOpen(false)}
              data-testid="unpin-nav"
            >
              Unpin navigation
            </Button>
          </Box>
        </Drawer>

        {/* Details drawer (temporary, right) */}
        <Drawer
          anchor="right"
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          data-testid="drawer-details"
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Details</Typography>
              <IconButton size="small" onClick={() => setDetailsOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
            <Typography variant="body2">
              Detailed information panel content.
            </Typography>
          </Box>
        </Drawer>

        {/* Help drawer (temporary, bottom) */}
        <Drawer
          anchor="bottom"
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          data-testid="drawer-help"
        >
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={500}>Help</Typography>
              <IconButton size="small" onClick={() => setHelpOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
            <Typography variant="body2">
              Help and support content.
            </Typography>
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
}
