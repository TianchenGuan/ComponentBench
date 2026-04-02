'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T05
 * Task Name: MUI: Reorder quick settings and save
 *
 * Setup Description:
 * Layout is a **settings panel** with a left navigation rail and a main content pane.
 *
 * In the main pane, a card titled **Customize quick settings** contains:
 * - a sortable list labeled **Quick settings** (instances=1),
 * - a primary button **Save changes** at the bottom-right of the card.
 *
 * Initial list order (top → bottom):
 * Profile, Security, Billing, Notifications, Integrations.
 *
 * Dragging behavior:
 * - Each row has a small drag indicator IconButton on the left (handle-only activation).
 * - Dropping updates the on-screen order, but changes are considered *pending* until saved.
 *
 * Commit behavior:
 * - Clicking **Save changes** commits the new order and shows a snackbar "Saved".
 * - Until saved, a small "Unsaved changes" text appears under the list.
 *
 * Distractors (clutter=low):
 * - Two unrelated toggles above the list ("Compact mode" and "Reduce motion") that do not affect success.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Profile, Billing, Security, Notifications, Integrations.
 * Changes must be committed by activating 'Save changes'.
 *
 * Theme: light, Spacing: comfortable, Layout: settings_panel, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Drawer,
} from '@mui/material';
import { DragIndicator, Settings, Security, Payment, Notifications, Extension } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, SortableItem } from '../types';
import { arraysEqual } from '../types';

const initialItems: SortableItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'billing', label: 'Billing' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
];

const targetOrder = ['profile', 'billing', 'security', 'notifications', 'integrations'];

function SortableRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#f5f5f5' : 'transparent',
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${item.id}`}
      sx={{ '&:hover': { backgroundColor: '#fafafa' }, py: 1 }}
    >
      <ListItemIcon sx={{ minWidth: 36, cursor: 'grab' }} {...attributes} {...listeners}>
        <DragIndicator sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItem>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasUnsavedChanges = !arraysEqual(
    items.map(i => i.id),
    committedItems.map(i => i.id)
  );

  useEffect(() => {
    const currentOrder = committedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    setCommittedItems([...items]);
    setSnackbarOpen(true);
  };

  const navItems = ['General', 'Quick settings', 'Privacy', 'About'];

  return (
    <Box sx={{ display: 'flex', minHeight: 500 }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 180,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 180,
            position: 'relative',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <List sx={{ pt: 2 }}>
          {navItems.map((item, i) => (
            <ListItem
              key={item}
              sx={{
                py: 1,
                color: i === 1 ? 'primary.main' : 'text.secondary',
                fontWeight: i === 1 ? 500 : 400,
              }}
            >
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Card sx={{ maxWidth: 450 }} data-testid="quick-settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>Customize quick settings</Typography>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch size="small" />}
                label={<Typography variant="body2">Compact mode</Typography>}
              />
              <FormControlLabel
                control={<Switch size="small" />}
                label={<Typography variant="body2">Reduce motion</Typography>}
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>Quick settings</Typography>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <List
                  data-testid="sortable-list-quick-settings"
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                >
                  {items.map((item) => (
                    <SortableRow key={item.id} item={item} />
                  ))}
                </List>
              </SortableContext>
            </DndContext>

            {hasUnsavedChanges && (
              <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                Unsaved changes
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={handleSave}>Save changes</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Saved
        </Alert>
      </Snackbar>
    </Box>
  );
}
