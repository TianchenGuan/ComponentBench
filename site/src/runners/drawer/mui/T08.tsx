'use client';

/**
 * drawer-mui-T08: Open a SwipeableDrawer by dragging (bottom anchor)
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * This scene uses a swipeable drawer (mobile-style bottom sheet) implemented with MUI SwipeableDrawer (anchor="bottom").
 *
 * Initial state:
 * - The swipeable drawer is CLOSED.
 * - A visible grab handle (a short horizontal bar) is shown at the very bottom edge of the card with the label "Filters".
 *
 * Interaction affordance:
 * - The intended way to open is to drag (swipe) upward from the handle area.
 * - Dragging upward 50+ px from the handle opens the drawer.
 *
 * Drawer content (not required for success):
 * - A few filter chips and a header "Filters" once fully opened.
 *
 * Feedback:
 * - During drag, the drawer partially reveals; when fully open it settles into place and the content becomes fully visible.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  SwipeableDrawer,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const DRAG_THRESHOLD = 50;

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);
  const dragStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragStartY.current = e.clientY;
    isDragging.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - e.clientY;
    if (dy > 10) isDragging.current = true;
    if (dy > DRAG_THRESHOLD && !open) {
      setOpen(true);
      dragStartY.current = null;
      isDragging.current = false;
    }
  }, [open]);

  const handlePointerUp = useCallback(() => {
    dragStartY.current = null;
    isDragging.current = false;
  }, []);

  const filterChips = ['Price', 'Rating', 'Distance', 'Category', 'Availability'];

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search Results
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Drag up from the handle below to open filters.
        </Typography>

        {/* Grab handle area */}
        <Box
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          data-testid="drawer-filters-handle"
          sx={{
            position: 'relative',
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            p: 2,
            cursor: 'grab',
            textAlign: 'center',
            userSelect: 'none',
            touchAction: 'none',
            '&:hover': { bgcolor: '#eeeeee' },
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: '#bdbdbd',
              borderRadius: 2,
              mx: 'auto',
              mb: 1,
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ userSelect: 'none' }}>
            Filters
          </Typography>
        </Box>

        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          swipeAreaWidth={0}
          disableSwipeToOpen
          data-testid="drawer-filters-swipeable"
        >
          <Box sx={{ p: 3, minHeight: 250 }}>
            {/* Puller handle */}
            <Box
              sx={{
                width: 40,
                height: 4,
                bgcolor: '#bdbdbd',
                borderRadius: 2,
                mx: 'auto',
                mb: 2,
              }}
            />
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {filterChips.map((filter) => (
                <Chip key={filter} label={filter} variant="outlined" />
              ))}
            </Stack>
          </Box>
        </SwipeableDrawer>
      </CardContent>
    </Card>
  );
}
