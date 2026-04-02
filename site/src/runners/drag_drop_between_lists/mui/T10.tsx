'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T10
 * Task Name: Match a quick-actions preview order and save
 *
 * Setup Description:
 * Scene is an isolated Paper card titled 'Quick actions'. Dual-list drag-and-drop selector
 * with exact ordering requirements. Above 'Quick actions' list is a non-interactive Preview
 * row showing desired actions as icon tiles. A 'Save' button commits the selection.
 *
 * Initial state:
 * - Quick actions: New invoice, Create report
 * - Available actions: Add customer, Send email, Export CSV
 * Preview indicates target order: Send email, New invoice, Export CSV
 *
 * Success: Match Quick actions to preview order AND click Save
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Button, Box, Chip } from '@mui/material';
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
import { checkExactOrder, getItemLabels } from '../types';

const initialContainers: ContainerState = {
  available: [
    { id: 'add-customer', label: 'Add customer' },
    { id: 'send-email', label: 'Send email' },
    { id: 'export-csv', label: 'Export CSV' },
  ],
  quick: [
    { id: 'new-invoice', label: 'New invoice' },
    { id: 'create-report', label: 'Create report' },
  ],
};

const targetState = {
  'Available actions': ['Add customer', 'Create report'],
  'Quick actions': ['Send email', 'New invoice', 'Export CSV'],
};

const previewActions = ['Send email', 'New invoice', 'Export CSV'];

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 0.5,
        py: 0.75,
        bgcolor: 'background.paper',
        cursor: 'grab',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13 }} />
    </ListItem>
  );
}

function DroppableContainer({ id, title, items, preview }: { id: string; title: string; items: DraggableItem[]; preview?: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 160,
        p: 1.5,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 12 }}>{title}</Typography>
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

export default function T10({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committedContainers, setCommittedContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Check success condition (committed state must match)
  useEffect(() => {
    if (successFired.current) return;
    const mappedContainers = {
      'Available actions': committedContainers.available,
      'Quick actions': committedContainers.quick,
    };
    if (checkExactOrder(mappedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedContainers, onSuccess]);

  const handleSave = () => {
    setCommittedContainers({ available: [...containers.available], quick: [...containers.quick] });
  };

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
    <Paper elevation={2} sx={{ width: 480, p: 2 }} data-testid="quick-actions-card">
      <Typography variant="h6" sx={{ mb: 2, fontSize: 16 }}>Quick actions</Typography>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <DroppableContainer id="available" title="Available actions" items={containers.available} />
          <DroppableContainer
            id="quick"
            title="Quick actions"
            items={containers.quick}
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
                data-testid="actions-preview"
              >
                <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 0.5, fontSize: 10 }}>
                  Preview
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {previewActions.map(action => (
                    <Chip key={action} label={action} size="small" color="success" sx={{ fontSize: 10 }} />
                  ))}
                </Box>
              </Box>
            }
          />
        </div>
        <DragOverlay>
          {activeItem ? (
            <Paper elevation={4} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', borderColor: 'primary.main' }}>
              <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">{activeItem.label}</Typography>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSave} data-testid="save-button">Save</Button>
      </Box>

      {/* Hidden field for checker */}
      <input
        type="hidden"
        data-testid="quick-actions-committed-json"
        value={JSON.stringify({
          available: getItemLabels(committedContainers.available),
          quick: getItemLabels(committedContainers.quick),
        })}
      />
    </Paper>
  );
}
