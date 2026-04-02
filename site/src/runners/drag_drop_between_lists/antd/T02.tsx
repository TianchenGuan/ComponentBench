'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T02
 * Task Name: Pin a widget and place it first
 *
 * Setup Description:
 * Scene is a single isolated Card anchored near the top-right of the viewport.
 * Card title is 'Widget Pinning'. Two vertical lists are shown side-by-side:
 * 'Available widgets' on the left and 'Pinned widgets' on the right.
 *
 * Initial state:
 * - Available widgets: Revenue, Sessions, Q2 report
 * - Pinned widgets: Sales
 *
 * Success Trigger:
 * Move 'Q2 report' to Pinned widgets and place it at the TOP (before Sales).
 * Order MATTERS.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: top_right
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Typography } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, DraggableItem, ContainerState } from '../types';
import { checkExactOrder } from '../types';

const { Text } = Typography;

const initialContainers: ContainerState = {
  available: [
    { id: 'revenue', label: 'Revenue' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'q2-report', label: 'Q2 report' },
  ],
  pinned: [
    { id: 'sales', label: 'Sales' },
  ],
};

const targetState: Record<string, string[]> = {
  available: ['Revenue', 'Sessions'],
  pinned: ['Q2 report', 'Sales'],
};

function SortableItem({ item, containerId }: { item: DraggableItem; containerId: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data: { containerId } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <List.Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'grab', width: '100%' }}>
        <HolderOutlined style={{ color: '#999' }} />
        <span>{item.label}</span>
      </div>
    </List.Item>
  );
}

function DroppableContainer({ 
  id, 
  items, 
  title 
}: { 
  id: string; 
  items: DraggableItem[]; 
  title: string;
}) {
  return (
    <div style={{ flex: 1 }} data-testid={`dnd-container-${id}`}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>{title}</Text>
      <div style={{ 
        border: '1px solid #d9d9d9', 
        borderRadius: 4, 
        minHeight: 200,
        background: '#fafafa',
        padding: 8,
      }}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <List
            dataSource={items}
            renderItem={(item) => <SortableItem key={item.id} item={item} containerId={id} />}
            locale={{ emptyText: 'Drop items here' }}
          />
        </SortableContext>
      </div>
    </div>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!successFired.current && checkExactOrder(containers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, onSuccess]);

  const findContainer = (id: UniqueIdentifier): string | undefined => {
    if (id in containers) return id as string;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex(item => item.id === active.id);
      const activeItem = activeItems[activeIndex];

      activeItems.splice(activeIndex, 1);
      
      const overIndex = overItems.findIndex(item => item.id === over.id);
      if (overIndex === -1) {
        overItems.push(activeItem);
      } else {
        overItems.splice(overIndex, 0, activeItem);
      }

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = [...containers[activeContainer]];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      if (oldIndex !== newIndex) {
        const [removed] = items.splice(oldIndex, 1);
        items.splice(newIndex, 0, removed);
        setContainers(prev => ({ ...prev, [activeContainer]: items }));
      }
    }
  };

  const activeItem = activeId 
    ? Object.values(containers).flat().find(item => item.id === activeId) 
    : null;

  return (
    <Card title="Widget Pinning" style={{ width: 500 }} data-testid="widget-pinning-card">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <DroppableContainer id="available" items={containers.available} title="Available widgets" />
          <DroppableContainer id="pinned" items={containers.pinned} title="Pinned widgets" />
        </div>
        <DragOverlay>
          {activeItem ? (
            <div style={{ 
              padding: '8px 16px', 
              background: '#fff', 
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <HolderOutlined style={{ color: '#999' }} />
              <span>{activeItem.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
