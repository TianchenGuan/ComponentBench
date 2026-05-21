'use client';

/**
 * Task ID: drag_drop_between_lists-mui-v2-T22
 * Task Name: MUI: Sales row exact widget transfer and row save
 *
 * Setup Description:
 * Layout is table_cell with compact spacing, small scale, and high clutter. The page shows a table titled "Dashboard presets". Two rows are expanded:
 * - Sales dashboard (target)
 * - Support dashboard (distractor)
 *
 * Each expanded row embeds a dual-list drag/drop selector inside the Widgets cell.
 * Sales row initial state:
 *   Visible: Sales, Orders
 *   Hidden: Revenue, Refunds
 * Support row initial state:
 *   Visible: Tickets, SLA
 *   Hidden: Revenue, Escalations
 *
 * Each row has its own small "Save" button. Rows are handle-only and exact insertion order matters.
 *
 * Success: Move Revenue to top of Visible in Sales row only; click Save in Sales row (save-sales-row).
 * Theme: light, Spacing: compact, Layout: table_cell, Placement: bottom_right
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
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

const initialSupport: ContainerState = {
  supportVisible: [
    { id: 'sup-v-tickets', label: 'Tickets' },
    { id: 'sup-v-sla', label: 'SLA' },
  ],
  supportHidden: [
    { id: 'sup-h-revenue', label: 'Revenue' },
    { id: 'sup-h-escalations', label: 'Escalations' },
  ],
};

const initialSales: ContainerState = {
  salesVisible: [
    { id: 'sal-v-sales', label: 'Sales' },
    { id: 'sal-v-orders', label: 'Orders' },
  ],
  salesHidden: [
    { id: 'sal-h-revenue', label: 'Revenue' },
    { id: 'sal-h-refunds', label: 'Refunds' },
  ],
};

const initialContainers: ContainerState = {
  ...initialSales,
  ...initialSupport,
};

const targetSales = {
  Visible: ['Revenue', 'Sales', 'Orders'],
  Hidden: ['Refunds'],
};

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

function DroppableContainer({
  id,
  title,
  items,
  rowLabel,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  rowLabel: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 100,
        p: 1,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 1,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={`${rowLabel} ${title}`}
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

export default function T22({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [salesSaved, setSalesSaved] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const invalidateSalesSave = useCallback(() => {
    setSalesSaved(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !salesSaved) return;

    const supportOk = checkExactOrder(
      {
        'Support dashboard__Visible': containers.supportVisible,
        'Support dashboard__Hidden': containers.supportHidden,
      },
      {
        'Support dashboard__Visible': ['Tickets', 'SLA'],
        'Support dashboard__Hidden': ['Revenue', 'Escalations'],
      }
    );

    const salesOk = checkExactOrder(
      { Visible: containers.salesVisible, Hidden: containers.salesHidden },
      targetSales
    );

    if (supportOk && salesOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, salesSaved, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id)) || String(over.id);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    invalidateSalesSave();

    setContainers(prev => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex(item => item.id === String(active.id));
      const activeItem = activeItems[activeIndex];
      activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex(item => item.id === String(over.id));
      if (overIndex === -1) overItems.push(activeItem);
      else overItems.splice(overIndex, 0, activeItem);
      return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id));
    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const oldIndex = items.findIndex(item => item.id === String(active.id));
      const newIndex = items.findIndex(item => item.id === String(over.id));
      if (oldIndex !== newIndex) {
        invalidateSalesSave();
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  const rowWidgets = (row: 'sales' | 'support') => {
    const prefix = row === 'sales' ? 'sales' : 'support';
    const label = row === 'sales' ? 'Sales dashboard' : 'Support dashboard';
    const vis = `${prefix}Visible` as string;
    const hid = `${prefix}Hidden` as string;
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <DroppableContainer id={vis} title="Visible" items={containers[vis] as DraggableItem[]} rowLabel={label} />
        <DroppableContainer id={hid} title="Hidden" items={containers[hid] as DraggableItem[]} rowLabel={label} />
      </Box>
    );
  };

  return (
    <Paper elevation={1} sx={{ maxWidth: 640, p: 1.5 }} data-testid="dashboard-presets-table">
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
        Dashboard presets
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Adjust widget visibility per dashboard. Each row saves independently.
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <TableContainer>
          <Table size="small" padding="none">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: 11 }}>Dashboard</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 11 }}>Widgets</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: 11, width: 88 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow data-testid="row-sales-dashboard">
                <TableCell sx={{ verticalAlign: 'top', fontSize: 11, fontWeight: 600, pt: 1 }}>
                  Sales dashboard
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top', pt: 0.5 }}>{rowWidgets('sales')}</TableCell>
                <TableCell align="right" sx={{ verticalAlign: 'top', pt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    data-testid="save-sales-row"
                    onClick={() => setSalesSaved(true)}
                    sx={{ fontSize: 10, minWidth: 0, px: 1 }}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow data-testid="row-support-dashboard">
                <TableCell sx={{ verticalAlign: 'top', fontSize: 11, fontWeight: 600, pt: 1 }}>
                  Support dashboard
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top', pt: 0.5 }}>{rowWidgets('support')}</TableCell>
                <TableCell align="right" sx={{ verticalAlign: 'top', pt: 1 }}>
                  <Button size="small" variant="outlined" disabled sx={{ fontSize: 10, minWidth: 0, px: 1 }}>
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

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
    </Paper>
  );
}
