'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T04
 * Task Name: Activate a filter in the correct instance (two selectors)
 *
 * Setup Description:
 * Scene has two separate Paper sections stacked vertically. Each section contains its own
 * instance of the drag-and-drop between-lists selector.
 * Instance 1: 'Product Filters' (TARGET)
 * Instance 2: 'User Filters' (DISTRACTOR)
 *
 * Initial state:
 * Product Filters: Active: Category | Inactive: Price, Brand, Rating
 * User Filters: Active: Country | Inactive: Price, Language
 *
 * Success: In Product Filters, move 'Price' to Active filters
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center, Instances: 2
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
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
import type { TaskComponentProps, DraggableItem } from '../types';
import { checkSetMembership } from '../types';

interface FilterState {
  active: DraggableItem[];
  inactive: DraggableItem[];
}

const initialProductFilters: FilterState = {
  active: [{ id: 'pf-category', label: 'Category' }],
  inactive: [
    { id: 'pf-price', label: 'Price' },
    { id: 'pf-brand', label: 'Brand' },
    { id: 'pf-rating', label: 'Rating' },
  ],
};

const initialUserFilters: FilterState = {
  active: [{ id: 'uf-country', label: 'Country' }],
  inactive: [
    { id: 'uf-price', label: 'Price' },
    { id: 'uf-language', label: 'Language' },
  ],
};

const targetProductState = {
  'Inactive filters': ['Brand', 'Rating'],
  'Active filters': ['Category', 'Price'],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 0.5,
        py: 0.75,
        px: 1.5,
        bgcolor: 'background.paper',
        cursor: 'grab',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13 }} />
    </ListItem>
  );
}

function DroppableContainer({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 130,
        p: 1.5,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
        transition: 'all 0.2s',
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 12 }}>{title}</Typography>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List sx={{ minHeight: 80, p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Paper>
  );
}

function FilterSection({
  title,
  containers,
  setContainers,
  prefix,
  instanceId,
}: {
  title: string;
  containers: FilterState;
  setContainers: React.Dispatch<React.SetStateAction<FilterState>>;
  prefix: string;
  instanceId: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string): string | undefined => {
    if (id === `${prefix}-active` || id === `${prefix}-inactive`) {
      return id.replace(`${prefix}-`, '');
    }
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some((item: DraggableItem) => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    let overContainer = findContainer(over.id as string);
    if (!overContainer && (over.id as string).startsWith(prefix)) {
      overContainer = (over.id as string).replace(`${prefix}-`, '');
    }

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setContainers(prev => {
      const activeItems = [...prev[activeContainer as keyof FilterState]];
      const overItems = [...prev[overContainer as keyof FilterState]];
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
      const items = containers[activeContainer as keyof FilterState];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer as keyof FilterState], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId
    ? [...containers.active, ...containers.inactive].find((item: DraggableItem) => item.id === activeId)
    : null;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }} data-testid={`dnd-instance-${instanceId}`}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, fontSize: 14 }}>{title}</Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <DroppableContainer id={`${prefix}-active`} title="Active filters" items={containers.active} />
          <DroppableContainer id={`${prefix}-inactive`} title="Inactive filters" items={containers.inactive} />
        </div>
        <DragOverlay>
          {activeItem ? (
            <Paper elevation={4} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', borderColor: 'primary.main' }}>
              <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">{activeItem.label}</Typography>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [productFilters, setProductFilters] = useState<FilterState>(initialProductFilters);
  const [userFilters, setUserFilters] = useState<FilterState>(initialUserFilters);
  const successFired = useRef(false);

  // Check success condition (only Product Filters matters)
  useEffect(() => {
    if (successFired.current) return;
    
    const mappedContainers = {
      'Inactive filters': productFilters.inactive,
      'Active filters': productFilters.active,
    };
    
    if (checkSetMembership(mappedContainers, targetProductState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [productFilters, onSuccess]);

  return (
    <div style={{ width: 380 }}>
      <FilterSection
        title="Product Filters"
        containers={productFilters}
        setContainers={setProductFilters}
        prefix="product"
        instanceId="product-filters"
      />
      <FilterSection
        title="User Filters"
        containers={userFilters}
        setContainers={setUserFilters}
        prefix="user"
        instanceId="user-filters"
      />
    </div>
  );
}
