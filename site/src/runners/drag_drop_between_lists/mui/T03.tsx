'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T03
 * Task Name: Match Selected tags to a visual chip preview
 *
 * Setup Description:
 * Scene is an isolated Paper card titled 'Tag Picker'. Two lists: 'Available tags' (left)
 * and 'Selected tags' (right). Above Selected tags list is a 'Preview' area showing the
 * desired selected tags as MUI Chips.
 *
 * Initial state:
 * - Selected tags: Bug
 * - Available tags: Urgent, Docs, Feature
 * Preview chips show: Bug, Urgent
 *
 * Success: Match Selected tags to the preview (need to add 'Urgent')
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Box } from '@mui/material';
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
    { id: 'urgent', label: 'Urgent' },
    { id: 'docs', label: 'Docs' },
    { id: 'feature', label: 'Feature' },
  ],
  selected: [
    { id: 'bug', label: 'Bug' },
  ],
};

const targetState = {
  'Available tags': ['Docs', 'Feature'],
  'Selected tags': ['Bug', 'Urgent'],
};

const previewTags = ['Bug', 'Urgent'];

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
  preview,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  preview?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 160,
        p: 2,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        transition: 'all 0.2s',
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
      {preview}
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List sx={{ minHeight: 100, p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Paper>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
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
      'Available tags': containers.available,
      'Selected tags': containers.selected,
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
    <Paper elevation={2} sx={{ width: 480, p: 3 }} data-testid="tag-picker-card">
      <Typography variant="h6" sx={{ mb: 2 }}>Tag Picker</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Match Selected tags to the preview
      </Typography>
      
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
            title="Available tags"
            items={containers.available}
          />
          <DroppableContainer
            id="selected"
            title="Selected tags"
            items={containers.selected}
            preview={
              <Box
                sx={{
                  mb: 1.5,
                  p: 1,
                  bgcolor: 'success.50',
                  border: '1px solid',
                  borderColor: 'success.200',
                  borderRadius: 1,
                }}
                data-testid="tag-preview"
              >
                <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 0.5 }}>
                  Preview
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {previewTags.map(tag => (
                    <Chip key={tag} label={tag} size="small" color="success" />
                  ))}
                </Box>
              </Box>
            }
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
