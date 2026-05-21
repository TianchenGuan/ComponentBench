'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T02
 * Task Name: MUI: Place 'Charts' under 'Summary'
 *
 * Setup Description:
 * A single centered card titled **Report sections** contains one vertical sortable list (MUI List).
 *
 * Initial order (top → bottom):
 * Summary, Details, Charts, Exports, Logs.
 *
 * Each list item shows:
 * - a drag handle icon on the left,
 * - section name text,
 * - secondary text (e.g., 'included') below (non-interactive).
 *
 * Behavior:
 * - Order updates immediately after drop.
 * - No Apply/Save.
 * - No additional page elements.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Summary, Charts, Details, Exports, Logs.
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

interface SectionItem {
  id: string;
  label: string;
  secondary: string;
}

const initialItems: SectionItem[] = [
  { id: 'summary', label: 'Summary', secondary: 'included' },
  { id: 'details', label: 'Details', secondary: 'included' },
  { id: 'charts', label: 'Charts', secondary: 'included' },
  { id: 'exports', label: 'Exports', secondary: 'optional' },
  { id: 'logs', label: 'Logs', secondary: 'optional' },
];

const targetOrder = ['summary', 'charts', 'details', 'exports', 'logs'];

function SortableRow({ item }: { item: SectionItem }) {
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
      <ListItemText primary={item.label} secondary={item.secondary} />
    </ListItem>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SectionItem[]>(initialItems);
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
    <Card sx={{ width: 400 }} data-testid="sortable-list-report-sections">
      <CardHeader title="Report sections" />
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
