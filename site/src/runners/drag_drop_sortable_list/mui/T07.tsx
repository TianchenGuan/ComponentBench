'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T07
 * Task Name: MUI: Reorder inside modal dialog and finish
 *
 * Setup Description:
 * Scene uses a **modal flow**:
 * - The base page shows a centered button labeled **Edit playlist order**.
 * - Clicking the button opens an MUI Dialog titled **Edit playlist order** (modal).
 *
 * Target component:
 * - Inside the dialog is one sortable list labeled **Playlist** (instances=1).
 * - Initial order (top → bottom): Pop, Rock, Jazz, Classical, Podcasts.
 *
 * Row structure:
 * - Left drag handle IconButton (handle-only)
 * - Track/category label text
 * - Right-aligned duration text (decorative)
 *
 * Commit behavior:
 * - The dialog has two actions in the footer: **Cancel** and **Done**.
 * - Reordering is considered committed only after clicking **Done** (closing the dialog).
 * - Clicking **Cancel** discards changes.
 *
 * Distractors (clutter=low):
 * - A disabled search field at the top of the dialog labeled "Filter" (not required).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Jazz, Pop, Rock, Classical, Podcasts.
 * Changes must be committed by activating 'Done'.
 *
 * Theme: light, Spacing: comfortable, Layout: modal_flow, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
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
import type { TaskComponentProps } from '../types';
import { arraysEqual } from '../types';

interface PlaylistItem {
  id: string;
  label: string;
  duration: string;
}

const initialItems: PlaylistItem[] = [
  { id: 'pop', label: 'Pop', duration: '3:24' },
  { id: 'rock', label: 'Rock', duration: '4:12' },
  { id: 'jazz', label: 'Jazz', duration: '5:01' },
  { id: 'classical', label: 'Classical', duration: '6:45' },
  { id: 'podcasts', label: 'Podcasts', duration: '45:00' },
];

const targetOrder = ['jazz', 'pop', 'rock', 'classical', 'podcasts'];

function SortableRow({ item }: { item: PlaylistItem }) {
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
      secondaryAction={
        <Typography variant="body2" color="text.secondary">{item.duration}</Typography>
      }
    >
      <ListItemIcon sx={{ minWidth: 36, cursor: 'grab' }} {...attributes} {...listeners}>
        <DragIndicator sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItem>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PlaylistItem[]>(initialItems);
  const [tempItems, setTempItems] = useState<PlaylistItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<PlaylistItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = committedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

  const handleOpen = () => {
    setTempItems([...items]);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    // Discard changes by not updating items
  };

  const handleDone = () => {
    setItems([...tempItems]);
    setCommittedItems([...tempItems]);
    setOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTempItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <Button variant="contained" onClick={handleOpen}>Edit playlist order</Button>

      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Edit playlist order</DialogTitle>
        <DialogContent>
          <TextField
            label="Filter"
            fullWidth
            size="small"
            disabled
            sx={{ mb: 2, mt: 1 }}
          />

          <Typography variant="subtitle2" gutterBottom>Playlist</Typography>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tempItems} strategy={verticalListSortingStrategy}>
              <List
                data-testid="sortable-list-playlist"
                sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
              >
                {tempItems.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleDone} variant="contained">Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
