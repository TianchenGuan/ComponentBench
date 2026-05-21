'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T03
 * Task Name: MUI: Make 'High' first (priority list)
 *
 * Setup Description:
 * Centered isolated card titled **Priority order** contains one sortable list with 4 items.
 *
 * Initial order (top → bottom):
 * Medium, Low, High, Urgent.
 *
 * Row styling:
 * - Each row has a left drag indicator icon.
 * - Each row includes a small colored dot next to the label (visual cue only).
 *
 * Behavior:
 * - Reorders immediately on drop.
 * - No confirmation step.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: High, Medium, Low, Urgent.
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
  Box,
} from '@mui/material';
import { DragIndicator, Circle } from '@mui/icons-material';
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

interface PriorityItem {
  id: string;
  label: string;
  color: string;
}

const initialItems: PriorityItem[] = [
  { id: 'medium', label: 'Medium', color: '#faad14' },
  { id: 'low', label: 'Low', color: '#52c41a' },
  { id: 'high', label: 'High', color: '#fa8c16' },
  { id: 'urgent', label: 'Urgent', color: '#ff4d4f' },
];

const targetOrder = ['high', 'medium', 'low', 'urgent'];

function SortableRow({ item }: { item: PriorityItem }) {
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Circle sx={{ fontSize: 12, color: item.color }} />
        <ListItemText primary={item.label} sx={{ m: 0 }} />
      </Box>
    </ListItem>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<PriorityItem[]>(initialItems);
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
    <Card sx={{ width: 350 }} data-testid="sortable-list-priority-order">
      <CardHeader title="Priority order" />
      <CardContent sx={{ pt: 0 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <List data-testid="sortable-list">
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
