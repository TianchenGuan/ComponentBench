'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T07
 * Task Name: Reset widget lists inside a table cell
 *
 * Setup Description:
 * Scene is a table_cell layout with medium clutter. MUI Table titled 'Dashboard Presets' with
 * multiple rows. Only 'Sales dashboard' row contains the target drag-and-drop between-lists
 * embedded in the 'Widgets' cell. Has a Reset icon button with confirmation dialog.
 *
 * Initial state (non-default):
 * - Visible: Sales, Orders
 * - Hidden: Revenue, Refunds
 * Default state after reset:
 * - Visible: Revenue, Sales, Orders
 * - Hidden: Refunds
 *
 * Success: Click Reset icon, confirm in dialog
 * Theme: light, Spacing: comfortable, Layout: table_cell, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, List, ListItem, ListItemIcon, ListItemText, Tooltip, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
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
import { checkExactOrder } from '../types';

const initialContainers: ContainerState = {
  visible: [
    { id: 'sales', label: 'Sales' },
    { id: 'orders', label: 'Orders' },
  ],
  hidden: [
    { id: 'revenue', label: 'Revenue' },
    { id: 'refunds', label: 'Refunds' },
  ],
};

const defaultContainers: ContainerState = {
  visible: [
    { id: 'revenue', label: 'Revenue' },
    { id: 'sales', label: 'Sales' },
    { id: 'orders', label: 'Orders' },
  ],
  hidden: [
    { id: 'refunds', label: 'Refunds' },
  ],
};

const targetState = {
  'Visible': ['Revenue', 'Sales', 'Orders'],
  'Hidden': ['Refunds'],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
      sx={{ border: '1px solid #e0e0e0', borderRadius: 0.5, mb: 0.25, py: 0.25, px: 0.5, bgcolor: 'background.paper', cursor: 'grab', fontSize: 10 }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 16 }}>
        <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 12 }} />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 10 }} />
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
        minWidth: 70,
        p: 0.5,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 1,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 0.5,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 600 }}>{title}</Typography>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List sx={{ minHeight: 40, p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
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
      'Visible': containers.visible,
      'Hidden': containers.hidden,
    };
    if (checkExactOrder(mappedContainers, targetState)) {
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

  const handleReset = () => {
    setContainers({ visible: [...defaultContainers.visible], hidden: [...defaultContainers.hidden] });
    setResetDialogOpen(false);
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Box sx={{ width: 500 }}>
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>Owner</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>Widgets</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow data-rowid="sales">
              <TableCell sx={{ fontSize: 11 }}>Sales dashboard</TableCell>
              <TableCell sx={{ fontSize: 11 }}>Alice</TableCell>
              <TableCell sx={{ width: 200 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                  <Tooltip title="Reset">
                    <IconButton size="small" onClick={() => setResetDialogOpen(true)} data-testid="reset-button">
                      <RestartAltIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  >
                    <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                      <DroppableContainer id="visible" title="Visible" items={containers.visible} />
                      <DroppableContainer id="hidden" title="Hidden" items={containers.hidden} />
                    </div>
                    <DragOverlay>
                      {activeItem ? (
                        <Paper elevation={4} sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid', borderColor: 'primary.main', fontSize: 10 }}>
                          <DragIndicatorIcon sx={{ fontSize: 12 }} />
                          <Typography variant="caption">{activeItem.label}</Typography>
                        </Paper>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </Box>
              </TableCell>
              <TableCell sx={{ fontSize: 11 }}>Today</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontSize: 11 }}>Marketing overview</TableCell>
              <TableCell sx={{ fontSize: 11 }}>Bob</TableCell>
              <TableCell sx={{ fontSize: 11 }}>—</TableCell>
              <TableCell sx={{ fontSize: 11 }}>Yesterday</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset widgets to default?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will restore the default widget configuration for this dashboard.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReset} data-testid="confirm-reset-button">Reset</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
