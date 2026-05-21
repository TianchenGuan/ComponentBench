'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T08
 * Task Name: Enable multiple sections in dark compact mode
 *
 * Setup Description:
 * Scene uses dark theme and compact spacing. Centered isolated Paper card titled 'App Sections'.
 * Two narrow lists: 'Available sections' (left) and 'Enabled sections' (right).
 * Dense rows with reduced padding; small DragIndicator handle.
 *
 * Initial state:
 * - Enabled sections: Profile, Notifications
 * - Available sections: Billing, Security, Integrations
 *
 * Success: Move BOTH 'Billing' and 'Security' to Enabled sections
 * Theme: dark, Spacing: compact, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, DraggableItem, ContainerState } from '../types';
import { checkSetMembership } from '../types';

const initialContainers: ContainerState = {
  available: [
    { id: 'billing', label: 'Billing' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' },
  ],
  enabled: [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
  ],
};

const targetState = {
  'Available sections': ['Integrations'],
  'Enabled sections': ['Profile', 'Notifications', 'Billing', 'Security'],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      sx={{
        border: '1px solid #333',
        borderRadius: 0.5,
        mb: 0.5,
        py: 0.5,
        px: 1,
        bgcolor: '#2a2a2a',
        '&:hover': { bgcolor: '#333' },
      }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 20 }} ref={setActivatorNodeRef} {...listeners} style={{ cursor: 'grab' }}>
        <DragIndicatorIcon sx={{ color: '#666', fontSize: 14 }} />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 11, color: '#e0e0e0' }} />
    </ListItem>
  );
}

function DroppableContainer({ id, title, items }: { id: string; title: string; items: DraggableItem[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 130,
        p: 1,
        bgcolor: isOver ? '#1a3a4a' : '#1f1f1f',
        border: 1,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : '#404040',
        borderRadius: 1,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, color: '#aaa', fontSize: 10 }}>{title}</Typography>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List sx={{ minHeight: 80, p: 0, mt: 0.5 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Check success condition
  useEffect(() => {
    if (successFired.current) return;
    const mappedContainers = {
      'Available sections': containers.available,
      'Enabled sections': containers.enabled,
    };
    if (checkSetMembership(mappedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setContainers(prev => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex(item => item.id === active.id);
      const activeItem = activeItems[activeIndex];

      activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex(item => item.id === over.id);
      if (overIndex === -1) overItems.push(activeItem);
      else overItems.splice(overIndex, 0, activeItem);

      return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Paper elevation={2} sx={{ width: 340, p: 2, bgcolor: '#1f1f1f', border: '1px solid #333' }} data-testid="app-sections-card">
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#e0e0e0', fontSize: 14 }}>App Sections</Typography>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <DroppableContainer id="available" title="Available sections" items={containers.available} />
          <DroppableContainer id="enabled" title="Enabled sections" items={containers.enabled} />
        </div>
        <DragOverlay>
          {activeItem ? (
            <Paper elevation={4} sx={{ p: 0.75, display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#2a2a2a', border: '1px solid', borderColor: 'primary.main' }}>
              <DragIndicatorIcon sx={{ color: '#666', fontSize: 14 }} />
              <Typography variant="body2" sx={{ fontSize: 11, color: '#e0e0e0' }}>{activeItem.label}</Typography>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
