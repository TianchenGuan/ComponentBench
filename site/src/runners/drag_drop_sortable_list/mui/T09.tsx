'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-T09
 * Task Name: MUI: Compact table row reorder with Apply
 *
 * Setup Description:
 * Scene is embedded like a **table cell** editor in the bottom-right of the viewport.
 * The component is compact and small (spacing=compact, scale=small).
 *
 * A small MUI Paper titled **Column manager** contains a compact table:
 * - Each row represents a column.
 * - The first cell contains a tiny drag handle IconButton (handle-only).
 * - The second cell shows the column name.
 * - The third cell shows a checkbox labeled "Visible" (distractor).
 *
 * Initial row order (top → bottom):
 * Name, Status, Owner, Last updated, Tags.
 *
 * Commit behavior:
 * - Row order changes are staged until you click **Apply** in the footer.
 * - Footer actions: **Cancel** and **Apply**.
 *
 * Distractors (clutter=medium):
 * - A small search icon button in the header (disabled).
 * - A caption text "Drag rows to reorder" under the header.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Status, Owner, Last updated, Tags, Name.
 * Changes must be committed by activating 'Apply'.
 *
 * Theme: light, Spacing: compact, Layout: table_cell, Placement: bottom_right, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
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
import type { TaskComponentProps } from '../types';
import { arraysEqual } from '../types';

interface ColumnItem {
  id: string;
  label: string;
  visible: boolean;
}

const initialItems: ColumnItem[] = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'owner', label: 'Owner', visible: true },
  { id: 'last-updated', label: 'Last updated', visible: true },
  { id: 'tags', label: 'Tags', visible: true },
];

const targetOrder = ['status', 'owner', 'last-updated', 'tags', 'name'];

function SortableTableRow({ item, onVisibilityChange }: { item: ColumnItem; onVisibilityChange: (id: string, visible: boolean) => void }) {
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
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#f5f5f5' : 'transparent',
  };

  return (
    <TableRow ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <TableCell sx={{ py: 0.5, px: 1, width: 30 }}>
        <IconButton size="small" sx={{ cursor: 'grab', p: 0 }} {...attributes} {...listeners}>
          <DragIndicator sx={{ fontSize: 14, color: 'text.secondary' }} />
        </IconButton>
      </TableCell>
      <TableCell sx={{ py: 0.5, px: 1, fontSize: 12 }}>{item.label}</TableCell>
      <TableCell sx={{ py: 0.5, px: 1, textAlign: 'center' }}>
        <Checkbox
          size="small"
          checked={item.visible}
          onChange={(e) => onVisibilityChange(item.id, e.target.checked)}
          sx={{ p: 0 }}
        />
      </TableCell>
    </TableRow>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<ColumnItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<ColumnItem[]>(initialItems);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = committedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleVisibilityChange = (id: string, visible: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, visible } : item));
  };

  const handleApply = () => {
    setCommittedItems([...items]);
    setSnackbarOpen(true);
  };

  const handleCancel = () => {
    setItems([...committedItems]);
  };

  return (
    <Paper sx={{ width: 280, p: 1.5 }} data-testid="column-manager-card">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>Column manager</Typography>
        <IconButton size="small" disabled>
          <Search sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Drag rows to reorder
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 0.5, px: 1, width: 30 }}></TableCell>
                  <TableCell sx={{ py: 0.5, px: 1, fontSize: 11 }}>Column</TableCell>
                  <TableCell sx={{ py: 0.5, px: 1, fontSize: 11, textAlign: 'center' }}>Visible</TableCell>
                </TableRow>
              </TableHead>
              <TableBody data-testid="sortable-list-column-manager">
                {items.map((item) => (
                  <SortableTableRow
                    key={item.id}
                    item={item}
                    onVisibilityChange={handleVisibilityChange}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SortableContext>
      </DndContext>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
        <Button size="small" onClick={handleCancel}>Cancel</Button>
        <Button size="small" variant="contained" onClick={handleApply}>Apply</Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Applied
        </Alert>
      </Snackbar>
    </Paper>
  );
}
