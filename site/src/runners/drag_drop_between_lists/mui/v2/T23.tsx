'use client';

/**
 * Task ID: drag_drop_between_lists-mui-v2-T23
 * Task Name: MUI: Modal reviewers with two transfers and commit
 *
 * Setup Description:
 * Layout is modal_flow with comfortable spacing but medium clutter from dialog chrome and helper text. The base page has a settings row with a button "Edit reviewers". Clicking it opens a centered MUI Dialog titled "Assign reviewers".
 *
 * Initial dialog state:
 * - Assigned reviewers: Avery Patel
 * - Available reviewers: Jordan Lee, Kai Nguyen, Riley Chen
 *
 * Dragging updates the dialog lists immediately, but the committed assignment updates only when "Done" is clicked. The target end state requires two transfers and exact destination order: Avery Patel, Jordan Lee, Kai Nguyen.
 *
 * Success: Open dialog, move Jordan Lee and Kai Nguyen to Assigned in order, click Done (confirm_control: Done). overlay_open: false, saved: true.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
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
import type { TaskComponentProps, DraggableItem, ContainerState } from '../../types';
import { checkExactOrder } from '../../types';

const initialContainers: ContainerState = {
  available: [
    { id: 'jordan', label: 'Jordan Lee' },
    { id: 'kai', label: 'Kai Nguyen' },
    { id: 'riley', label: 'Riley Chen' },
  ],
  assigned: [{ id: 'avery', label: 'Avery Patel' }],
};

const targetState = {
  'Available reviewers': ['Riley Chen'],
  'Assigned reviewers': ['Avery Patel', 'Jordan Lee', 'Kai Nguyen'],
};

type Snap = { available: DraggableItem[]; assigned: DraggableItem[] };

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <ListItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.7 : 1 }}
      {...attributes}
      sx={{
        border: isDragging ? '1px solid' : '1px solid #e0e0e0',
        borderColor: isDragging ? 'primary.main' : undefined,
        borderRadius: 1,
        mb: 0.75,
        bgcolor: isDragging ? 'primary.50' : 'background.paper',
        boxShadow: isDragging ? 3 : 0,
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative',
        '&:hover': { bgcolor: isDragging ? 'primary.50' : 'action.hover' },
      }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 32 }} ref={setActivatorNodeRef} {...listeners} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
        <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText primary={item.label} />
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
        borderRadius: 2,
        transition: 'all 0.2s',
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
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

export default function T23({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committed, setCommitted] = useState(false);
  const snapRef = useRef<Snap | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current || !committed || open) return;

    const mapped = {
      'Available reviewers': containers.available,
      'Assigned reviewers': containers.assigned,
    };
    if (checkExactOrder(mapped, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, open, containers, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
    }
    return undefined;
  };

  const invalidateCommit = () => setCommitted(false);

  const openDialog = () => {
    snapRef.current = {
      available: containers.available.map(i => ({ ...i })),
      assigned: containers.assigned.map(i => ({ ...i })),
    };
    setCommitted(false);
    setOpen(true);
  };

  const handleClose = () => {
    if (snapRef.current) {
      setContainers({
        available: snapRef.current.available.map(i => ({ ...i })),
        assigned: snapRef.current.assigned.map(i => ({ ...i })),
      });
    }
    setOpen(false);
    setCommitted(false);
  };

  const handleDone = () => {
    const mapped = {
      'Available reviewers': containers.available,
      'Assigned reviewers': containers.assigned,
    };
    if (checkExactOrder(mapped, targetState)) {
      setCommitted(true);
    } else {
      setCommitted(false);
    }
    setOpen(false);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    invalidateCommit();
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
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        invalidateCommit();
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 480 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure reviewer assignments for the next release gate. Changes apply only after you confirm in the dialog.
      </Typography>
      <Button variant="outlined" size="small" onClick={openDialog} data-testid="edit-reviewers-open">
        Edit reviewers
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign reviewers</DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Drag reviewers between lists. Click Done to commit; Cancel discards this session.
          </Typography>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <DroppableContainer id="available" title="Available reviewers" items={containers.available} />
              <DroppableContainer id="assigned" title="Assigned reviewers" items={containers.assigned} />
            </Box>
          </DndContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleDone} data-testid="Done">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
