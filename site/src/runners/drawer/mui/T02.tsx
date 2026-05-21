'use client';

/**
 * drawer-mui-T02: Open the drawer that matches a mixed (icon+text) reference
 *
 * Layout: isolated_card centered with comfortable spacing. No unrelated controls are shown.
 *
 * At the top of the card:
 * - A "Target preview" chip shows BOTH:
 *   - an icon (shopping cart), and
 *   - the text label "Cart"
 *
 * Below the preview are two similar icon buttons (same size/shape):
 * 1) Icon button with a shopping cart icon (opens Drawer instance "Cart")
 * 2) Icon button with a bookmark icon (opens Drawer instance "Saved")
 *
 * Target components:
 * - Two separate MUI Drawer instances (variant="temporary", anchor="right").
 * - Each drawer has a header with the same icon as its trigger and a title ("Cart" or "Saved").
 *
 * Initial state:
 * - Both drawers are CLOSED.
 *
 * Feedback:
 * - Opening the correct drawer shows the matching icon + title in the drawer header.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Drawer,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { ShoppingCart, Bookmark } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

type DrawerType = 'cart' | 'saved' | null;

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const successCalledRef = useRef(false);

  // Target is the Cart drawer
  useEffect(() => {
    if (openDrawer === 'cart' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openDrawer, onSuccess]);

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Stack spacing={3} alignItems="center">
          {/* Target preview */}
          <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Target preview
            </Typography>
            <Chip
              icon={<ShoppingCart />}
              label="Cart"
              variant="outlined"
              data-testid="target-preview"
            />
          </Box>

          {/* Icon buttons */}
          <Stack direction="row" spacing={2}>
            <IconButton
              onClick={() => setOpenDrawer('cart')}
              data-testid="open-cart"
              sx={{ border: '1px solid #ccc' }}
            >
              <ShoppingCart />
            </IconButton>
            <IconButton
              onClick={() => setOpenDrawer('saved')}
              data-testid="open-saved"
              sx={{ border: '1px solid #ccc' }}
            >
              <Bookmark />
            </IconButton>
          </Stack>
        </Stack>

        {/* Cart Drawer */}
        <Drawer
          anchor="right"
          open={openDrawer === 'cart'}
          onClose={() => setOpenDrawer(null)}
          data-testid="drawer-cart"
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <ShoppingCart />
              <Typography variant="h6">Cart</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Your shopping cart is empty.
            </Typography>
          </Box>
        </Drawer>

        {/* Saved Drawer */}
        <Drawer
          anchor="right"
          open={openDrawer === 'saved'}
          onClose={() => setOpenDrawer(null)}
          data-testid="drawer-saved"
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Bookmark />
              <Typography variant="h6">Saved</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              No saved items yet.
            </Typography>
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
}
