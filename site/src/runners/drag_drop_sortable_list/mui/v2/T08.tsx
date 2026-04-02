'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-v2-T08
 * Task Name: MUI: Export columns only in a paired table editor
 *
 * Two compact tables: Default columns (distractor) and Export columns (target).
 * Handle-only row drags. "Apply export order" commits export order.
 *
 * Success: committed export order: status, owner, last-updated, name
 * and Default columns unchanged: name, status, owner, last-updated.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material';
import { DragIndicator, Search } from '@mui/icons-material';
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
import type { TaskComponentProps, SortableItem } from '../../types';
import { arraysEqual } from '../../types';

const defaultInitial: SortableItem[] = [
  { id: 'default-name', label: 'Name' },
  { id: 'default-status', label: 'Status' },
  { id: 'default-owner', label: 'Owner' },
  { id: 'default-last-updated', label: 'Last updated' },
];

const exportInitial: SortableItem[] = [
  { id: 'export-name', label: 'Name' },
  { id: 'export-owner', label: 'Owner' },
  { id: 'export-status', label: 'Status' },
  { id: 'export-last-updated', label: 'Last updated' },
];

const targetExportOrder = ['export-status', 'export-owner', 'export-last-updated', 'export-name'];

const defaultOrderUnchanged = ['default-name', 'default-status', 'default-owner', 'default-last-updated'];

function ExportSortableRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <TableCell padding="checkbox" sx={{ width: 40, py: 0.5 }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${item.label}`}
          sx={{ p: 0.25 }}
        >
          <DragIndicator sx={{ fontSize: 18 }} />
        </IconButton>
      </TableCell>
      <TableCell sx={{ py: 0.5, fontSize: '0.8rem' }}>{item.label}</TableCell>
    </TableRow>
  );
}

function DefaultSortableRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <TableCell padding="checkbox" sx={{ width: 40, py: 0.5 }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${item.label}`}
          sx={{ p: 0.25 }}
        >
          <DragIndicator sx={{ fontSize: 18 }} />
        </IconButton>
      </TableCell>
      <TableCell sx={{ py: 0.5, fontSize: '0.8rem' }}>{item.label}</TableCell>
    </TableRow>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [defaultItems, setDefaultItems] = useState<SortableItem[]>(defaultInitial);
  const [exportDraft, setExportDraft] = useState<SortableItem[]>(exportInitial);
  const [exportCommitted, setExportCommitted] = useState<SortableItem[]>(exportInitial);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const exportOrder = exportCommitted.map((i) => i.id);
    const defaultOrder = defaultItems.map((i) => i.id);
    if (
      !successFired.current &&
      arraysEqual(exportOrder, targetExportOrder) &&
      arraysEqual(defaultOrder, defaultOrderUnchanged)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [exportCommitted, defaultItems, onSuccess]);

  const onExportDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setExportDraft((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const onDefaultDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDefaultItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleApplyExport = () => {
    setExportCommitted([...exportDraft]);
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5, maxWidth: 520 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ flex: 1, fontSize: '0.9rem' }}>
          Column export layout
        </Typography>
        <Tooltip title="Search unavailable">
          <span>
            <IconButton size="small" disabled aria-label="Search columns">
              <Search fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Reorder handles affect row order only. Use the export footer to commit export changes.
      </Typography>

      <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
        Default columns
      </Typography>
      <TableContainer sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDefaultDragEnd}>
          <SortableContext items={defaultItems} strategy={verticalListSortingStrategy}>
            <Table size="small" data-testid="sortable-table-default-columns" aria-label="Default columns">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 40 }} />
                  <TableCell sx={{ fontSize: '0.75rem' }}>Column</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {defaultItems.map((item) => (
                  <DefaultSortableRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </TableContainer>

      <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
        Export columns
      </Typography>
      <TableContainer sx={{ mb: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onExportDragEnd}>
          <SortableContext items={exportDraft} strategy={verticalListSortingStrategy}>
            <Table size="small" data-testid="sortable-table-export-columns" aria-label="Export columns">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 40 }} />
                  <TableCell sx={{ fontSize: '0.75rem' }}>Column</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exportDraft.map((item) => (
                  <ExportSortableRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" variant="contained" onClick={handleApplyExport}>
          Apply export order
        </Button>
      </Box>
    </Paper>
  );
}
