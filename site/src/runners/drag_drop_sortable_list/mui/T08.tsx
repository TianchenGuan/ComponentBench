'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T08
 * Task Name: MUI: Dark dashboard — scroll and move 'Weather' to top
 *
 * Setup Description:
 * Scene is a **dashboard** in **dark theme** with multiple cards and charts as distractors (clutter=medium).
 * The target component is a card in the top-left quadrant titled **Dashboard widgets**.
 *
 * Target component:
 * - A scrollable sortable list inside the card (instances=1).
 * - The list shows about 7 rows at a time; the rest require scrolling inside the list.
 *
 * Initial order (top → bottom):
 * Overview, Revenue, Active users, Conversion, Traffic sources, Top pages, Devices, Locations, Campaigns, Funnels, Retention, Cohorts, Alerts, Notes, Tasks, Weather.
 *
 * Drag behavior:
 * - Each row has a small drag handle icon on the left (handle-only).
 * - While dragging, a subtle overlay follows the pointer and the list autoscrolls when near the edges.
 *
 * Other dashboard elements (not required):
 * - A date range picker in the header
 * - Two metric charts to the right
 * - A notification bell button
 *
 * Feedback:
 * - Order updates immediately on drop (no Save/Apply step).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Weather, Overview, Revenue, Active users, Conversion, Traffic sources, Top pages, Devices, Locations, Campaigns, Funnels, Retention, Cohorts, Alerts, Notes, Tasks.
 *
 * Theme: dark, Spacing: comfortable, Layout: dashboard, Placement: top_left
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Paper,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { DragIndicator, Notifications, DateRange } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
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

const targetOrder = ['weather', 'overview', 'revenue', 'active-users', 'conversion', 'traffic-sources', 'top-pages', 'devices', 'locations', 'campaigns', 'funnels', 'retention', 'cohorts', 'alerts', 'notes', 'tasks'];

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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${item.id}`}
      sx={{ py: 0.5, '&:hover': { backgroundColor: 'action.hover' } }}
      dense
    >
      <ListItemIcon sx={{ minWidth: 32, cursor: 'grab' }} {...attributes} {...listeners}>
        <DragIndicator sx={{ color: 'text.secondary', fontSize: 16 }} />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2' }} />
    </ListItem>
  );
}

function DragOverlayItem({ item }: { item: SortableItem }) {
  return (
    <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper' }}>
      <DragIndicator sx={{ color: 'text.secondary', fontSize: 16 }} />
      <Typography variant="body2">{item.label}</Typography>
    </Paper>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
        {/* Dashboard header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Analytics Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Paper sx={{ px: 2, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateRange fontSize="small" />
              <Typography variant="body2">Last 7 days</Typography>
            </Paper>
            <IconButton>
              <Notifications />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Target card - Dashboard widgets */}
          <Card sx={{ width: 280 }} data-testid="dashboard-widgets-card">
            <CardHeader title="Dashboard widgets" titleTypographyProps={{ variant: 'subtitle1' }} />
            <CardContent sx={{ pt: 0 }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  <List
                    data-testid="sortable-list-dashboard-widgets"
                    sx={{ maxHeight: 300, overflow: 'auto' }}
                  >
                    {items.map((item) => (
                      <SortableRow key={item.id} item={item} />
                    ))}
                  </List>
                </SortableContext>
                <DragOverlay>
                  {activeItem ? <DragOverlayItem item={activeItem} /> : null}
                </DragOverlay>
              </DndContext>
            </CardContent>
          </Card>

          {/* Distractor charts */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2, width: 250, height: 160 }}>
              <Typography variant="subtitle2" gutterBottom>Revenue</Typography>
              <Box sx={{ height: 100, bgcolor: 'action.hover', borderRadius: 1 }} />
            </Paper>
            <Paper sx={{ p: 2, width: 250, height: 160 }}>
              <Typography variant="subtitle2" gutterBottom>Users</Typography>
              <Box sx={{ height: 100, bgcolor: 'action.hover', borderRadius: 1 }} />
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
