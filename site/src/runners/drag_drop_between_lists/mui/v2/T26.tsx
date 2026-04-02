'use client';

/**
 * Task ID: drag_drop_between_lists-mui-v2-T26
 * Task Name: MUI: Favorite metrics long-list preview match
 *
 * Setup Description:
 * Layout is dashboard_panel with compact spacing and high clutter. The target card contains:
 * - a scrollable Available metrics list on the left
 * - a Favorite metrics list on the right
 * - a visual Reference preview chip row showing the desired final Favorite metrics order
 *
 * Initial Favorite metrics: Revenue.
 * Available metrics include several items; some are below the fold.
 * Reference preview: Revenue, Churn rate, Net promoter score.
 * Footer "Save metrics" commits (confirm_control: Save metrics). reference_id: ref-favorite-metrics.
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
  Chip,
  Stack,
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
    { id: 'm-active-users', label: 'Active users' },
    { id: 'm-bounce', label: 'Bounce rate' },
    { id: 'm-churn', label: 'Churn rate' },
    { id: 'm-nps', label: 'Net promoter score' },
    { id: 'm-sessions', label: 'Sessions' },
    { id: 'm-pageviews', label: 'Page views' },
    { id: 'm-conversion', label: 'Conversion rate' },
    { id: 'm-mrr', label: 'MRR' },
    { id: 'm-arpu', label: 'ARPU' },
    { id: 'm-dau', label: 'Daily active users' },
    { id: 'm-retention', label: 'Retention' },
    { id: 'm-ltv', label: 'LTV' },
  ],
  favorite: [{ id: 'm-revenue', label: 'Revenue' }],
};

const targetState = {
  'Favorite metrics': ['Revenue', 'Churn rate', 'Net promoter score'],
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
  scrollable,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  scrollable?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const list = (
    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
      <List dense sx={{ minHeight: scrollable ? 0 : 80, p: 0 }}>
        {items.map(item => (
          <SortableItem key={item.id} item={item} />
        ))}
      </List>
    </SortableContext>
  );

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 130,
        p: 1,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 1,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
        {title}
      </Typography>
      {scrollable ? (
        <Box sx={{ maxHeight: 140, overflowY: 'auto', pr: 0.5 }} data-testid="available-metrics-scroll">
          {list}
        </Box>
      ) : (
        list
      )}
    </Paper>
  );
}

export default function T26({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current || !saved) return;
    const mapped = {
      'Available metrics': containers.available,
      'Favorite metrics': containers.favorite,
    };
    if (checkExactOrder(mapped, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, containers, onSuccess]);

  const invalidateSaved = () => setSaved(false);

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

    invalidateSaved();
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
        invalidateSaved();
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Paper elevation={1} sx={{ maxWidth: 440, p: 2 }} data-testid="favorite-metrics-card">
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Favorite metrics
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Reference preview
      </Typography>
      <Stack
        direction="row"
        spacing={0.5}
        flexWrap="wrap"
        useFlexGap
        id="ref-favorite-metrics"
        data-testid="ref-favorite-metrics"
        sx={{ mb: 1.5 }}
      >
        <Chip label="Revenue" size="small" variant="outlined" sx={{ fontSize: 10, height: 22 }} />
        <Chip label="Churn rate" size="small" variant="outlined" sx={{ fontSize: 10, height: 22 }} />
        <Chip label="Net promoter score" size="small" variant="outlined" sx={{ fontSize: 10, height: 22 }} />
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Unrelated: cohort size 12.4k · last sync 2m ago · export enabled
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <DroppableContainer id="available" title="Available metrics" items={containers.available} scrollable />
          <DroppableContainer id="favorite" title="Favorite metrics" items={containers.favorite} />
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

      <Button variant="contained" size="small" data-testid="Save metrics" onClick={() => setSaved(true)}>
        Save metrics
      </Button>
    </Paper>
  );
}
