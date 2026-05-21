'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T10
 * Task Name: MUI: Discard reordered rules via confirmation dialog
 *
 * Setup Description:
 * Scene uses a **modal flow** with confirmation.
 *
 * On load, an MUI Dialog titled **Edit inbox rules** is already open (no need to open it).
 * Inside the dialog is one sortable list labeled **Rule order** (instances=1).
 *
 * Initial rule order (top → bottom):
 * Newsletters, Receipts, Social, Promotions, Updates.
 *
 * Dragging behavior:
 * - Each row has a left drag handle IconButton (handle-only).
 * - Dropping updates the visible order immediately, but changes are not saved unless confirmed.
 *
 * Footer actions:
 * - **Save** (not required for this task)
 * - **Cancel**
 *
 * Confirmation (confirm_cancel):
 * - If the order has been changed, clicking **Cancel** opens a confirmation dialog titled "Discard changes?"
 * - The confirmation dialog buttons are **Keep editing** and **Discard changes**
 * - Clicking **Discard changes** closes the dialogs and restores the original order.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Newsletters, Receipts, Social, Promotions, Updates.
 * Changes must be committed by activating 'Discard changes'.
 *
 * Theme: dark, Spacing: comfortable, Layout: modal_flow, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
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
import type { TaskComponentProps, SortableItem } from '../types';
import { arraysEqual } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const initialItems: SortableItem[] = [
  { id: 'newsletters', label: 'Newsletters' },
  { id: 'receipts', label: 'Receipts' },
  { id: 'social', label: 'Social' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'updates', label: 'Updates' },
];

// Target order is the original order (after discard)
const targetOrder = ['newsletters', 'receipts', 'social', 'promotions', 'updates'];

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
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${item.id}`}
      sx={{ '&:hover': { backgroundColor: 'action.hover' }, py: 1 }}
    >
      <ListItemIcon sx={{ minWidth: 36, cursor: 'grab' }} {...attributes} {...listeners}>
        <DragIndicator sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItem>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [mainDialogOpen, setMainDialogOpen] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const [discardActionTaken, setDiscardActionTaken] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = !arraysEqual(
    items.map(i => i.id),
    initialItems.map(i => i.id)
  );

  useEffect(() => {
    // Success is triggered when:
    // 1. The committed items match the original order (target order)
    // 2. The discard action was explicitly taken
    const currentOrder = committedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder) && discardActionTaken) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, discardActionTaken, onSuccess]);

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

  const handleCancel = () => {
    if (hasChanges) {
      setConfirmDialogOpen(true);
    } else {
      setMainDialogOpen(false);
    }
  };

  const handleKeepEditing = () => {
    setConfirmDialogOpen(false);
  };

  const handleDiscardChanges = () => {
    setItems([...initialItems]);
    setCommittedItems([...initialItems]);
    setDiscardActionTaken(true);
    setConfirmDialogOpen(false);
    setMainDialogOpen(false);
  };

  const handleSave = () => {
    setCommittedItems([...items]);
    setMainDialogOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Dialog open={mainDialogOpen} maxWidth="sm" fullWidth>
          <DialogTitle>Edit inbox rules</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>Rule order</Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <List
                  data-testid="sortable-list-rule-order"
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                >
                  {items.map((item) => (
                    <SortableRow key={item.id} item={item} />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Drag rules to change processing order
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialogOpen}>
          <DialogTitle>Discard changes?</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              You have unsaved changes. Are you sure you want to discard them?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleKeepEditing}>Keep editing</Button>
            <Button onClick={handleDiscardChanges} color="error" variant="contained">
              Discard changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
