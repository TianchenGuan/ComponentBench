'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T04
 * Task Name: MUI: Reorder Left panel items (two lists)
 *
 * Setup Description:
 * Layout is a **form section** titled **Layout builder** with two sortable lists displayed side-by-side (instances=2).
 *
 * Target list (left column):
 * - **Left panel items**
 * - Initial order (top → bottom): Overview, Projects, Calendar, Reports
 *
 * Other list (right column):
 * - **Right panel items**
 * - Initial order (top → bottom): Help, Feedback, About, Sign out
 *
 * Each list item is an MUI ListItem row with:
 * - a drag handle icon on the left (IconButton with drag indicator),
 * - label text,
 * - a small "eye" icon on the right (decorative; toggling visibility is disabled in this task).
 *
 * Distractors (clutter=low):
 * - A text field labeled "Layout name" above the lists.
 * - A disabled "Publish" button at the bottom.
 *
 * Behavior:
 * - Reorder is immediate within each list.
 * - Dragging between lists is disabled.
 * - No scrolling required.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Overview, Projects, Reports, Calendar.
 * Only the list labeled 'Left panel items' counts toward success.
 *
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { DragIndicator, Visibility } from '@mui/icons-material';
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

const initialLeftItems: SortableItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'reports', label: 'Reports' },
];

const initialRightItems: SortableItem[] = [
  { id: 'help', label: 'Help' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'about', label: 'About' },
  { id: 'signout', label: 'Sign out' },
];

const targetOrder = ['overview', 'projects', 'reports', 'calendar'];

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
      {...attributes}
      {...listeners}
      data-testid={`sortable-item-${item.id}`}
      sx={{ cursor: 'grab', '&:hover': { backgroundColor: '#fafafa' }, py: 1 }}
      secondaryAction={
        <Visibility sx={{ color: 'text.disabled', fontSize: 18 }} />
      }
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <DragIndicator sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItem>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [leftItems, setLeftItems] = useState<SortableItem[]>(initialLeftItems);
  const [rightItems, setRightItems] = useState<SortableItem[]>(initialRightItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = leftItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [leftItems, onSuccess]);

  const handleLeftDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLeftItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRightDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRightItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card sx={{ width: 550 }} data-testid="layout-builder-form">
      <CardContent>
        <Typography variant="h6" gutterBottom>Layout builder</Typography>
        
        <TextField
          label="Layout name"
          fullWidth
          size="small"
          sx={{ mb: 3 }}
          defaultValue="My Layout"
        />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>Left panel items</Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleLeftDragEnd}
            >
              <SortableContext items={leftItems} strategy={verticalListSortingStrategy}>
                <List
                  data-testid="sortable-list-left-panel"
                  aria-label="Left panel items"
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                >
                  {leftItems.map((item) => (
                    <SortableRow key={item.id} item={item} />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>Right panel items</Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleRightDragEnd}
            >
              <SortableContext items={rightItems} strategy={verticalListSortingStrategy}>
                <List
                  data-testid="sortable-list-right-panel"
                  aria-label="Right panel items"
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 1, opacity: 0.7 }}
                >
                  {rightItems.map((item) => (
                    <SortableRow key={item.id} item={item} />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" disabled>Publish</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
