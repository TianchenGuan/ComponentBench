'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T06
 * Task Name: Assign a reviewer in a modal dialog
 *
 * Setup Description:
 * Scene is a modal_flow. Base page has a settings row 'Reviewers' with 'Edit reviewers' button.
 * Clicking opens a centered MUI Dialog titled 'Assign reviewers' with drag-and-drop between-lists.
 * Dialog has 'Done' (commits) and 'Cancel' buttons.
 *
 * Initial state (in dialog):
 * - Assigned reviewers: Avery Patel
 * - Available reviewers: Jordan Lee, Kai Nguyen, Riley Chen
 *
 * Success: Open dialog, move 'Jordan Lee' to Assigned reviewers, click Done
 * Theme: light, Spacing: comfortable, Layout: modal_flow, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, Chip, Box } from '@mui/material';
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
    { id: 'jordan-lee', label: 'Jordan Lee' },
    { id: 'kai-nguyen', label: 'Kai Nguyen' },
    { id: 'riley-chen', label: 'Riley Chen' },
  ],
  assigned: [
    { id: 'avery-patel', label: 'Avery Patel' },
  ],
};

const targetState = {
  'Available reviewers': ['Kai Nguyen', 'Riley Chen'],
  'Assigned reviewers': ['Avery Patel', 'Jordan Lee'],
};

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

function DroppableContainer({ id, title, items }: { id: string; title: string; items: DraggableItem[] }) {
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

export default function T06({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committedContainers, setCommittedContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Check success condition (committed state)
  useEffect(() => {
    if (successFired.current) return;
    const mappedContainers = {
      'Available reviewers': committedContainers.available,
      'Assigned reviewers': committedContainers.assigned,
    };
    if (checkSetMembership(mappedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedContainers, onSuccess]);

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

  const handleDone = () => {
    setCommittedContainers({ available: [...containers.available], assigned: [...containers.assigned] });
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setContainers({ available: [...committedContainers.available], assigned: [...committedContainers.assigned] });
    setDialogOpen(false);
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Box sx={{ width: 300 }}>
      {/* Base page content */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Reviewers</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
              {committedContainers.assigned.map(r => (
                <Chip key={r.id} label={r.label} size="small" />
              ))}
            </Box>
          </Box>
          <Button variant="outlined" size="small" onClick={() => setDialogOpen(true)} data-testid="edit-reviewers-button">
            Edit reviewers
          </Button>
        </Box>
      </Paper>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Assign reviewers</DialogTitle>
        <DialogContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <DroppableContainer id="available" title="Available reviewers" items={containers.available} />
              <DroppableContainer id="assigned" title="Assigned reviewers" items={containers.assigned} />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleDone} data-testid="done-button">Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
