'use client';

/**
 * Task ID: drag_drop_sortable_list-mui-v2-T07
 * Task Name: MUI: Dark compact adjacency reorder with Apply
 *
 * Setup: inline_surface, dark, compact, high clutter, bottom_left placement (wrapper).
 * Dense settings surface with toggles, chips, counts; sortable "Accessibility sections"
 * (handle-only). Draft until "Apply order".
 *
 * Success: committed order (top → bottom) ids:
 * color-contrast, keyboard-support, focus-ring, screen-reader-notes, motion-settings, labels
 * after "Apply order".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
} from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
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
  { id: 'color-contrast', label: 'Color contrast' },
  { id: 'focus-ring', label: 'Focus ring' },
  { id: 'keyboard-support', label: 'Keyboard support' },
  { id: 'screen-reader-notes', label: 'Screen reader notes' },
  { id: 'motion-settings', label: 'Motion settings' },
  { id: 'labels', label: 'Labels' },
];

const targetOrder = [
  'color-contrast',
  'keyboard-support',
  'focus-ring',
  'screen-reader-notes',
  'motion-settings',
  'labels',
];

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
      sx={{ py: 0.25, px: 0.5 }}
      secondaryAction={
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          ref:{item.id.slice(0, 3)}
        </Typography>
      }
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <IconButton
          ref={setActivatorNodeRef}
          size="small"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${item.label}`}
          sx={{ p: 0.25, cursor: 'grab' }}
        >
          <DragIndicator sx={{ fontSize: 18, color: 'text.secondary' }} />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.8rem' } }}
      />
    </ListItem>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
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
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

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

  const handleCancel = () => {
    setDraftItems([...committedItems]);
  };

  const handleApply = () => {
    setCommittedItems([...draftItems]);
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      data-testid="accessibility-settings-surface"
      sx={{
        p: 1,
        maxWidth: 360,
        borderColor: 'divider',
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        A11y workspace
      </Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5, mb: 1 }}>
        <Chip size="small" label="WCAG 2.2" variant="outlined" sx={{ height: 22, fontSize: '0.65rem' }} />
        <Chip size="small" color="default" label="Audit: queued" sx={{ height: 22, fontSize: '0.65rem' }} />
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
          Open issues: 12
        </Typography>
      </Stack>
      <Stack spacing={0.25} sx={{ mb: 1 }}>
        <FormControlLabel
          control={<Switch size="small" defaultChecked />}
          label={<Typography variant="caption">Reduce motion previews</Typography>}
          sx={{ m: 0, alignItems: 'center' }}
        />
        <FormControlLabel
          control={<Switch size="small" />}
          label={<Typography variant="caption">Strict focus outlines</Typography>}
          sx={{ m: 0, alignItems: 'center' }}
        />
      </Stack>

      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
        Accessibility sections
      </Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={draftItems} strategy={verticalListSortingStrategy}>
          <List
            dense
            disablePadding
            data-testid="sortable-list-accessibility-sections"
            aria-label="Accessibility sections"
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            {draftItems.map((item) => (
              <SortableRow key={item.id} item={item} />
            ))}
          </List>
        </SortableContext>
      </DndContext>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1.5 }}>
        <Button size="small" variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={handleApply}>
          Apply order
        </Button>
      </Stack>
    </Paper>
  );
}
