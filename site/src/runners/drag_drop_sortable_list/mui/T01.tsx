'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T01
 * Task Name: MUI: Move 'Messages' to top (navigation order)
 *
 * Setup Description:
 * A centered isolated card titled **Navigation order** uses Material UI styling.
 * It contains one sortable list built from MUI List/ListItem rows.
 *
 * Initial order (top → bottom):
 * Home, Search, Messages, Alerts, Settings.
 *
 * Each row includes:
 * - a left drag indicator icon (grip),
 * - the item label text (ListItemText),
 * - a trailing icon (non-interactive).
 *
 * Behavior:
 * - Dragging the row reorders items immediately on drop (no Save).
 * - All items are visible; no scrolling.
 * - No other UI components on the page.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Messages, Home, Search, Alerts, Settings.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
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
} from '@mui/material';
import { DragIndicator, ChevronRight } from '@mui/icons-material';
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
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
  { id: 'messages', label: 'Messages' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'settings', label: 'Settings' },
];

const targetOrder = ['messages', 'home', 'search', 'alerts', 'settings'];

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
      sx={{ cursor: 'grab', '&:hover': { backgroundColor: '#fafafa' } }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <DragIndicator sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
      <ChevronRight sx={{ color: 'text.disabled' }} />
    </ListItem>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
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
    <Card sx={{ width: 400 }} data-testid="sortable-list-navigation-order">
      <CardHeader title="Navigation order" />
      <CardContent sx={{ pt: 0 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <List data-testid="sortable-list" aria-label="Navigation order">
              {items.map((item) => (
                <SortableRow key={item.id} item={item} />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
