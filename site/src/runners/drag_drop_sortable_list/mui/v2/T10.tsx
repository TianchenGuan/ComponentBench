'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-v2-T10
 * Task Name: MUI: Apply only the right rail reorder
 *
 * Two narrow sortable rails: Left rail items (distractor), Right rail items (target).
 * Move Calendar to bottom in right rail; left rail unchanged. "Apply right rail" commits.
 *
 * Success: committed right order: right-search, right-notes, right-home, right-calendar
 * and left order unchanged: left-home, left-search, left-notes, left-calendar.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import type { TaskComponentProps, SortableItem } from '../../types';
import { arraysEqual } from '../../types';

const leftInitial: SortableItem[] = [
  { id: 'left-home', label: 'Home' },
  { id: 'left-search', label: 'Search' },
  { id: 'left-notes', label: 'Notes' },
  { id: 'left-calendar', label: 'Calendar' },
];

const rightInitial: SortableItem[] = [
  { id: 'right-search', label: 'Search' },
  { id: 'right-calendar', label: 'Calendar' },
  { id: 'right-notes', label: 'Notes' },
  { id: 'right-home', label: 'Home' },
];

const targetRightOrder = ['right-search', 'right-notes', 'right-home', 'right-calendar'];

const leftOrderUnchanged = ['left-home', 'left-search', 'left-notes', 'left-calendar'];

function LeftRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      dense
      data-testid={`sortable-item-${item.id}`}
      sx={{ py: 0.15, px: 0.5 }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${item.label}`}
          sx={{ p: 0.15, cursor: 'grab' }}
        >
          <DragIndicator sx={{ fontSize: 16 }} />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.75rem' } }}
      />
    </ListItem>
  );
}

function RightRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      dense
      data-testid={`sortable-item-${item.id}`}
      sx={{ py: 0.15, px: 0.5 }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${item.label}`}
          sx={{ p: 0.15, cursor: 'grab' }}
        >
          <DragIndicator sx={{ fontSize: 16 }} />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.75rem' } }}
      />
    </ListItem>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [leftItems, setLeftItems] = useState<SortableItem[]>(leftInitial);
  const [rightDraft, setRightDraft] = useState<SortableItem[]>(rightInitial);
  const [rightCommitted, setRightCommitted] = useState<SortableItem[]>(rightInitial);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const ro = rightCommitted.map((i) => i.id);
    const lo = leftItems.map((i) => i.id);
    if (
      !successFired.current &&
      arraysEqual(ro, targetRightOrder) &&
      arraysEqual(lo, leftOrderUnchanged)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rightCommitted, leftItems, onSuccess]);

  const onLeftDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLeftItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const onRightDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRightDraft((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleApplyLeft = () => {
    /* Left rail button is a distractor; success is evaluated only after Apply right rail. */
  };

  const handleApplyRight = () => {
    setRightCommitted([...rightDraft]);
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5, maxWidth: 440 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
        Adjust rails independently. Only <strong>Apply right rail</strong> commits the target list for this task.
      </Typography>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
            Left rail items
          </Typography>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onLeftDragEnd}>
            <SortableContext items={leftItems} strategy={verticalListSortingStrategy}>
              <List
                dense
                disablePadding
                data-testid="sortable-list-left-rail-items"
                aria-label="Left rail items"
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                {leftItems.map((item) => (
                  <LeftRow key={item.id} item={item} />
                ))}
              </List>
            </SortableContext>
          </DndContext>
          <Box sx={{ mt: 0.75, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" variant="outlined" onClick={handleApplyLeft}>
              Apply left rail
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
            Right rail items
          </Typography>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onRightDragEnd}>
            <SortableContext items={rightDraft} strategy={verticalListSortingStrategy}>
              <List
                dense
                disablePadding
                data-testid="sortable-list-right-rail-items"
                aria-label="Right rail items"
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                {rightDraft.map((item) => (
                  <RightRow key={item.id} item={item} />
                ))}
              </List>
            </SortableContext>
          </DndContext>
          <Box sx={{ mt: 0.75, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" variant="contained" onClick={handleApplyRight}>
              Apply right rail
            </Button>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
