'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T06
 * Task Name: MUI: Match reference order (workflow stages)
 *
 * Setup Description:
 * A centered isolated card titled **Workflow stages** contains:
 * - a sortable list labeled **Workflow stages** with 5 items (instances=1),
 * - a small **Reference** preview panel to the right that visually shows the desired order.
 *
 * Initial list order (top → bottom):
 * Backlog, In progress, Review, Done, Blocked.
 *
 * Visual guidance (guidance=visual):
 * - The Reference panel shows the same stage names as stacked chips in the target order.
 * - The full target order is not repeated in the instruction text.
 *
 * Dragging behavior:
 * - Items can be reordered by dragging the whole row (row activation) for accessibility.
 * - Order updates immediately on drop.
 * - No Save button.
 *
 * Minor clutter (clutter=low):
 * - An informational caption under the list: "Drag to reorder stages" (non-interactive).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Backlog, Blocked, In progress, Review, Done.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Paper,
  Grid,
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

const initialItems: SortableItem[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
  { id: 'blocked', label: 'Blocked' },
];

const targetOrder = ['backlog', 'blocked', 'in-progress', 'review', 'done'];
const referenceLabels = ['Backlog', 'Blocked', 'In progress', 'Review', 'Done'];

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
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <DragIndicator sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItem>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = items.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [items, onSuccess]);

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

  return (
    <Card sx={{ width: 550 }} data-testid="workflow-stages-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Workflow stages</Typography>

        <Grid container spacing={3}>
          <Grid item xs={7}>
            <Typography variant="subtitle2" gutterBottom>Workflow stages</Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <List
                  data-testid="sortable-list-workflow-stages"
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                >
                  {items.map((item) => (
                    <SortableRow key={item.id} item={item} />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Drag to reorder stages
            </Typography>
          </Grid>

          <Grid item xs={5}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 12 }}>Reference</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {referenceLabels.map((label, i) => (
                  <Chip
                    key={label}
                    label={`${i + 1}. ${label}`}
                    size="small"
                    variant="outlined"
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
