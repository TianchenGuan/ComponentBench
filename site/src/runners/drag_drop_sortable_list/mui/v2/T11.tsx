'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-v2-T11
 * Task Name: MUI: Left drawer reference ranking with confirm
 *
 * Header button opens left Drawer "Edit feature ranking". Handle-only sortable list
 * "Feature ranking" + Reference order chips. "Apply ranking" commits, closes drawer.
 *
 * Success: committed order: security, collaboration, analytics, automation, customization
 * after Apply ranking, with drawer closed (overlay_open false).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { DragIndicator, Menu as MenuIcon } from '@mui/icons-material';
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

const initialItems: SortableItem[] = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'automation', label: 'Automation' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'customization', label: 'Customization' },
  { id: 'security', label: 'Security' },
];

const referenceOrder: SortableItem[] = [
  { id: 'security', label: 'Security' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'automation', label: 'Automation' },
  { id: 'customization', label: 'Customization' },
];

const targetOrder = referenceOrder.map((i) => i.id);

function SortableRow({ item }: { item: SortableItem }) {
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
    <ListItem
      ref={setNodeRef}
      style={style}
      dense
      data-testid={`sortable-item-${item.id}`}
      sx={{ py: 0.35 }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${item.label}`}
          sx={{ cursor: 'grab' }}
        >
          <DragIndicator sx={{ color: 'text.secondary' }} />
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2' }} />
    </ListItem>
  );
}

export default function T11({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = committedItems.map((item) => item.id);
    const drawerClosed = !drawerOpen;
    if (
      !successFired.current &&
      drawerClosed &&
      arraysEqual(currentOrder, targetOrder)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, drawerOpen, onSuccess]);

  const handleOpen = () => {
    setDraftItems([...committedItems]);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDraftItems([...committedItems]);
    setDrawerOpen(false);
  };

  const handleApply = () => {
    setCommittedItems([...draftItems]);
    setDrawerOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDraftItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 560 }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48 }}>
          <IconButton edge="start" size="small" aria-label="menu">
            <MenuIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            Product dashboard
          </Typography>
          <Button size="small" variant="outlined" onClick={handleOpen}>
            Edit feature ranking
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Use the header action to open the ranking drawer.
        </Typography>
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={handleClose} PaperProps={{ sx: { width: 320 } }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>
            Edit feature ranking
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Reference order
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5} sx={{ mb: 2 }}>
            {referenceOrder.map((ref) => (
              <Chip key={ref.id} size="small" label={ref.label} variant="outlined" />
            ))}
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Feature ranking
          </Typography>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draftItems} strategy={verticalListSortingStrategy}>
              <List
                dense
                disablePadding
                data-testid="sortable-list-feature-ranking"
                aria-label="Feature ranking"
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, flex: 1, overflow: 'auto' }}
              >
                {draftItems.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </List>
            </SortableContext>
          </DndContext>

          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={handleClose}>Close</Button>
            <Button variant="contained" onClick={handleApply}>
              Apply ranking
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
