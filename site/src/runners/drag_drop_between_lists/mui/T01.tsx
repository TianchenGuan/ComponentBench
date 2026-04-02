'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T01
 * Task Name: Add one label to Selected
 *
 * Setup Description:
 * Scene is an isolated Paper card centered in the viewport with the title 'Labels'.
 * Inside is a two-column drag-and-drop selector:
 * - Left: 'Available labels'
 * - Right: 'Selected labels'
 * Each label is a draggable MUI ListItem with DragIndicator (handle) icon and label text.
 *
 * Initial state:
 * - Available labels: Bug, Feature, Urgent
 * - Selected labels: Needs review
 *
 * Success: Move 'Urgent' to Selected labels
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
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
    { id: 'bug', label: 'Bug' },
    { id: 'feature', label: 'Feature' },
    { id: 'urgent', label: 'Urgent' },
  ],
  selected: [
    { id: 'needs-review', label: 'Needs review' },
  ],
};

const targetState = {
  'Available labels': ['Bug', 'Feature'],
  'Selected labels': ['Needs review', 'Urgent'],
};

function SortableItem({ item }: { item: DraggableItem }) {
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
      {...attributes}
      {...listeners}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
        cursor: 'grab',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 32 }}>
        <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItem>
  );
}

function DroppableContainer({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 180,
        p: 2,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        transition: 'all 0.2s',
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{title}</Typography>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List sx={{ minHeight: 120, p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Paper>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success condition
  useEffect(() => {
    if (successFired.current) return;
    
    const mappedContainers = {
      'Available labels': containers.available,
      'Selected labels': containers.selected,
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

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
      if (overIndex === -1) {
        overItems.push(activeItem);
      } else {
        overItems.splice(overIndex, 0, activeItem);
      }

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
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

  const activeItem = activeId
    ? Object.values(containers).flat().find(item => item.id === activeId)
    : null;

  return (
    <Paper elevation={2} sx={{ width: 480, p: 3 }} data-testid="labels-card">
      <Typography variant="h6" sx={{ mb: 2 }}>Labels</Typography>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <DroppableContainer
            id="available"
            title="Available labels"
            items={containers.available}
          />
          <DroppableContainer
            id="selected"
            title="Selected labels"
            items={containers.selected}
          />
        </div>

        <DragOverlay>
          {activeItem ? (
            <Paper
              elevation={4}
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                border: '1px solid',
                borderColor: 'primary.main',
              }}
            >
              <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
              <Typography>{activeItem.label}</Typography>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
