'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-v2-T09
 * Task Name: MUI: Hidden widget to top in nested scroll panel
 *
 * Outer scroll region (decoy content) + inner fixed-height scrollable "Dashboard widgets" list.
 * Weather starts last; move to top, then "Save panel".
 *
 * Success: full committed order (ids) matches target (Weather first, then remainder in original order).
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

const initialItems: SortableItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'active-users', label: 'Active users' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'traffic-sources', label: 'Traffic sources' },
  { id: 'top-pages', label: 'Top pages' },
  { id: 'devices', label: 'Devices' },
  { id: 'locations', label: 'Locations' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'funnels', label: 'Funnels' },
  { id: 'retention', label: 'Retention' },
  { id: 'cohorts', label: 'Cohorts' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'notes', label: 'Notes' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'weather', label: 'Weather' },
];

const targetOrder = [
  'weather',
  'overview',
  'revenue',
  'active-users',
  'conversion',
  'traffic-sources',
  'top-pages',
  'devices',
  'locations',
  'campaigns',
  'funnels',
  'retention',
  'cohorts',
  'alerts',
  'notes',
  'tasks',
];

function SortableRow({ item }: { item: SortableItem }) {
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
      sx={{ py: 0.25 }}
    >
      <ListItemIcon sx={{ minWidth: 32 }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${item.label}`}
          sx={{ p: 0.25, cursor: 'grab' }}
        >
          <DragIndicator sx={{ fontSize: 18 }} />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.78rem' } }}
      />
    </ListItem>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [draftItems, setDraftItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = committedItems.map((item) => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDraftItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    setCommittedItems([...draftItems]);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 720,
        maxHeight: 420,
        overflow: 'auto',
        p: 1,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.default',
      }}
      data-testid="nested-scroll-page"
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Analytics workspace
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2, minWidth: 600 }}>
        <Paper variant="outlined" sx={{ flex: 1, p: 1, height: 120 }}>
          <Typography variant="caption" color="text.secondary">
            Revenue trend
          </Typography>
          <Box sx={{ mt: 1, height: 48, bgcolor: 'action.hover', borderRadius: 1 }} />
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, p: 1, height: 120 }}>
          <Typography variant="caption" color="text.secondary">
            Conversion funnel
          </Typography>
          <Box sx={{ mt: 1, height: 48, bgcolor: 'action.hover', borderRadius: 1 }} />
        </Paper>
      </Stack>
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Filters: last 7 days · segment: all users
      </Typography>
      <Box sx={{ height: 48, bgcolor: 'action.selected', borderRadius: 1, mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Paper
          elevation={2}
          sx={{
            width: 280,
            maxWidth: '100%',
            p: 1,
            mb: 2,
          }}
          data-testid="dashboard-widgets-panel"
        >
          <Typography variant="subtitle2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
            Dashboard widgets
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
            Drag handles to reorder. Scroll inside this list when needed.
          </Typography>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            autoScroll
          >
            <SortableContext items={draftItems} strategy={verticalListSortingStrategy}>
              <List
                dense
                disablePadding
                data-testid="sortable-list-dashboard-widgets"
                aria-label="Dashboard widgets"
                sx={{
                  maxHeight: 200,
                  overflow: 'auto',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                {draftItems.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </List>
            </SortableContext>
          </DndContext>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button size="small" variant="contained" onClick={handleSave}>
              Save panel
            </Button>
          </Box>
        </Paper>
      </Box>

      <Typography variant="caption" color="text.secondary">
        Outer region scrolls independently of the widget list.
      </Typography>
    </Box>
  );
}
