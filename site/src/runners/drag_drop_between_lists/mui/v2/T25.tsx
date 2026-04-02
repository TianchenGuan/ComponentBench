'use client';

/**
 * Task ID: drag_drop_between_lists-mui-v2-T25
 * Task Name: MUI: Product filters only, with two ordered insertions
 *
 * Setup Description:
 * Layout is dashboard_panel with compact spacing and medium clutter. Two dual-list selectors are stacked vertically:
 * - Product Filters (target)
 * - User Filters (distractor)
 *
 * Product Filters initial state:
 *   Active filters: Category
 *   Inactive filters: Price, Brand, Rating
 * User Filters initial state:
 *   Active filters: Country
 *   Inactive filters: Price, Language
 *
 * Both selectors share the label Price. Footer "Apply filters" commits (confirm_control: Apply filters).
 * Only Product Filters must reach target; User Filters unchanged (non_target_instances_must_remain).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
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

const initialUser: ContainerState = {
  userActive: [{ id: 'u-act-country', label: 'Country' }],
  userInactive: [
    { id: 'u-inact-price', label: 'Price' },
    { id: 'u-inact-lang', label: 'Language' },
  ],
};

const initialProduct: ContainerState = {
  productActive: [{ id: 'p-act-cat', label: 'Category' }],
  productInactive: [
    { id: 'p-inact-price', label: 'Price' },
    { id: 'p-inact-brand', label: 'Brand' },
    { id: 'p-inact-rating', label: 'Rating' },
  ],
};

const initialContainers: ContainerState = {
  ...initialProduct,
  ...initialUser,
};

const targetProduct = {
  'Inactive filters': ['Rating'],
  'Active filters': ['Category', 'Brand', 'Price'],
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
  instanceLabel,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  instanceLabel: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 110,
        p: 1,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 1,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={`${instanceLabel} ${title}`}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
        {title}
      </Typography>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List dense sx={{ minHeight: 64, p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Paper>
  );
}

export default function T25({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const invalidateApplied = useCallback(() => setApplied(false), []);

  useEffect(() => {
    if (successFired.current || !applied) return;

    const userOk = checkExactOrder(
      {
        'User Filters__Active': containers.userActive,
        'User Filters__Inactive': containers.userInactive,
      },
      {
        'User Filters__Active': ['Country'],
        'User Filters__Inactive': ['Price', 'Language'],
      }
    );

    const productOk = checkExactOrder(
      { 'Inactive filters': containers.productInactive, 'Active filters': containers.productActive },
      targetProduct
    );

    if (userOk && productOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, containers, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id)) || String(over.id);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    invalidateApplied();

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
        invalidateApplied();
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  const selectorBlock = (which: 'product' | 'user', heading: string) => {
    const p = which === 'product' ? 'product' : 'user';
    const act = `${p}Active` as string;
    const inact = `${p}Inactive` as string;
    return (
      <Box
        data-testid={which === 'product' ? 'instance-product-filters' : 'instance-user-filters'}
        sx={{ mb: 2 }}
        aria-label={heading}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75, fontSize: 13 }}>
          {heading}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <DroppableContainer
            id={act}
            title="Active filters"
            items={containers[act] as DraggableItem[]}
            instanceLabel={heading}
          />
          <DroppableContainer
            id={inact}
            title="Inactive filters"
            items={containers[inact] as DraggableItem[]}
            instanceLabel={heading}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={1} sx={{ maxWidth: 420, p: 2 }} data-testid="filters-dashboard-panel">
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
        Filter configuration
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {selectorBlock('product', 'Product Filters')}
        {selectorBlock('user', 'User Filters')}

        <Button variant="contained" size="small" data-testid="Apply filters" onClick={() => setApplied(true)} sx={{ mt: 0.5 }}>
          Apply filters
        </Button>

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
