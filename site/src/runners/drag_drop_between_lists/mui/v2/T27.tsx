'use client';

/**
 * Task ID: drag_drop_between_lists-mui-v2-T27
 * Task Name: MUI: Manage fields popover with exact insertion and apply
 *
 * Setup Description:
 * Layout is inline_surface with compact spacing and medium clutter. A toolbar button "Manage fields" opens a compact anchored popover containing one dual-list selector.
 *
 * Initial selector state:
 * - Available fields: Company, Address, Email
 * - Shown fields: Name, Phone
 *
 * Footer contains "Cancel" and "Apply". The base table updates only after Apply (confirm_control: Apply). overlay_open: false when committed.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
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
import type { TaskComponentProps, DraggableItem, ContainerState } from '../../types';
import { checkExactOrder } from '../../types';

const initialContainers: ContainerState = {
  available: [
    { id: 'fld-company', label: 'Company' },
    { id: 'fld-address', label: 'Address' },
    { id: 'fld-email', label: 'Email' },
  ],
  shown: [
    { id: 'fld-name', label: 'Name' },
    { id: 'fld-phone', label: 'Phone' },
  ],
};

const targetState = {
  'Available fields': ['Company', 'Address'],
  'Shown fields': ['Name', 'Email', 'Phone'],
};

type Snap = { available: DraggableItem[]; shown: DraggableItem[] };

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <ListItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 0.5,
        mb: 0.5,
        py: 0.25,
        px: 0.75,
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 22 }} ref={setActivatorNodeRef} {...listeners} style={{ cursor: 'grab' }}>
        <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 12 }} />
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
        minWidth: 108,
        p: 1,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 1,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
        {title}
      </Typography>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List dense sx={{ minHeight: 72, p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Paper>
  );
}

export default function T27({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const snapRef = useRef<Snap | null>(null);
  const successFired = useRef(false);

  const open = Boolean(anchorEl);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current || !applied || open) return;
    const mapped = {
      'Available fields': containers.available,
      'Shown fields': containers.shown,
    };
    if (checkExactOrder(mapped, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, open, containers, onSuccess]);

  const invalidateApplied = () => setApplied(false);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
    }
    return undefined;
  };

  const openPopover = (el: HTMLElement) => {
    snapRef.current = {
      available: containers.available.map(i => ({ ...i })),
      shown: containers.shown.map(i => ({ ...i })),
    };
    setApplied(false);
    setAnchorEl(el);
  };

  const handleCancel = () => {
    if (snapRef.current) {
      setContainers({
        available: snapRef.current.available.map(i => ({ ...i })),
        shown: snapRef.current.shown.map(i => ({ ...i })),
      });
    }
    setAnchorEl(null);
    setApplied(false);
  };

  const handleApply = () => {
    const mapped = {
      'Available fields': containers.available,
      'Shown fields': containers.shown,
    };
    if (checkExactOrder(mapped, targetState)) {
      setApplied(true);
    } else {
      setApplied(false);
    }
    setAnchorEl(null);
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    invalidateApplied();
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
        invalidateApplied();
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  const columnPreview = containers.shown.map(i => i.label).join(' · ') || '—';

  return (
    <Paper elevation={1} sx={{ maxWidth: 520, p: 0 }} data-testid="manage-fields-surface">
      <Toolbar variant="dense" sx={{ gap: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Records table
        </Typography>
        <Button size="small" variant="outlined" onClick={e => openPopover(e.currentTarget)} data-testid="manage-fields-open">
          Manage fields
        </Button>
      </Toolbar>

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Column order (applied): {columnPreview}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              {containers.shown.map(col => (
                <TableCell key={col.id} sx={{ fontWeight: 600, fontSize: 12 }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {containers.shown.map(col => (
                <TableCell key={col.id} sx={{ fontSize: 12, color: 'text.secondary' }}>
                  …
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 1.5, maxWidth: 360 } } }}
        data-testid="manage-fields-popover"
      >
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Field visibility
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Drag into Shown fields. Apply updates the table below.
        </Typography>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
            <DroppableContainer id="available" title="Available fields" items={containers.available} />
            <DroppableContainer id="shown" title="Shown fields" items={containers.shown} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="small" variant="contained" onClick={handleApply} data-testid="Apply">
              Apply
            </Button>
          </Box>
          <DragOverlay>
            {activeItem ? (
              <Paper
                elevation={4}
                sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid', borderColor: 'primary.main' }}
              >
                <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                <Typography sx={{ fontSize: 12 }}>{activeItem.label}</Typography>
              </Paper>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Popover>
    </Paper>
  );
}
