'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T09
 * Task Name: Scroll a long list to feature a product
 *
 * Setup Description:
 * Scene is an isolated Paper card titled 'Featured Products'. Dual-list drag-and-drop:
 * - Left: 'Available products' is fixed-height, scrollable (virtualized)
 * - Right: 'Featured products' accepts drops
 *
 * Initial state:
 * - Featured products: Phone Case
 * - Available products: Bluetooth Speaker, Desk Lamp, HDMI Adapter, Laptop Stand,
 *   Noise-canceling Headphones, Portable SSD, Screen Protector, Smartwatch Band,
 *   USB-C Cable, Webcam, Wireless Charger
 * 'Wireless Charger' starts near the bottom and requires scrolling.
 *
 * Success: Move 'Wireless Charger' to Featured products
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
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
import type { TaskComponentProps, DraggableItem, ContainerState } from '../types';

const availableProductsList = [
  'Bluetooth Speaker', 'Desk Lamp', 'HDMI Adapter', 'Laptop Stand',
  'Noise-canceling Headphones', 'Portable SSD', 'Screen Protector',
  'Smartwatch Band', 'USB-C Cable', 'Webcam', 'Wireless Charger'
];

const initialContainers: ContainerState = {
  available: availableProductsList.map(p => ({ id: p.toLowerCase().replace(/\s+/g, '-'), label: p })),
  featured: [{ id: 'phone-case', label: 'Phone Case' }],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 0.5,
        py: 0.75,
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

function DroppableContainer({ id, title, items, scrollable }: { id: string; title: string; items: DraggableItem[]; scrollable?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 180,
        p: 1.5,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 12 }}>{title}</Typography>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List sx={{ minHeight: 100, maxHeight: scrollable ? 240 : undefined, overflowY: scrollable ? 'auto' : undefined, p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Paper>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Check success condition
  useEffect(() => {
    if (successFired.current) return;
    const featuredLabels = containers.featured.map(i => i.label);
    if (featuredLabels.includes('Phone Case') && featuredLabels.includes('Wireless Charger')) {
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

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Paper elevation={2} sx={{ width: 480, p: 2 }} data-testid="featured-products-card">
      <Typography variant="h6" sx={{ mb: 2, fontSize: 16 }}>Featured Products</Typography>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <DroppableContainer id="available" title="Available products" items={containers.available} scrollable />
          <DroppableContainer id="featured" title="Featured products" items={containers.featured} />
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
