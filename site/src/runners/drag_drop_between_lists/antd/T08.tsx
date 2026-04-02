'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T08
 * Task Name: Move an item with small drag handles (compact mode)
 *
 * Setup Description:
 * Scene uses compact spacing and small component scale. Card title is 'Automation Rules'.
 * Two narrow list containers: 'Inactive rules' (left) and 'Active rules' (right).
 * Dense rows with reduced padding. Dragging is handle-only.
 *
 * Initial state:
 * - Inactive rules: High priority routing, After-hours auto-reply
 * - Active rules: Spam filter
 *
 * Success Trigger:
 * Move 'High priority routing' from Inactive rules to Active rules. Order doesn't matter.
 *
 * Theme: light, Spacing: compact, Layout: isolated_card, Placement: center, Scale: small
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
import { checkSetMembership } from '../types';

const { Text } = Typography;

const initialContainers: ContainerState = {
  inactive: [
    { id: 'high-priority-routing', label: 'High priority routing' },
    { id: 'after-hours-auto-reply', label: 'After-hours auto-reply' },
  ],
  active: [
    { id: 'spam-filter', label: 'Spam filter' },
  ],
};

const targetState: Record<string, string[]> = {
  inactive: ['After-hours auto-reply'],
  active: ['Spam filter', 'High priority routing'],
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
    padding: '4px 8px',
    borderBottom: '1px solid #f0f0f0',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`dnd-item-${item.id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', padding: 4 }}
          data-testid={`dnd-handle-${item.id}`}
        >
          <HolderOutlined style={{ color: '#999', fontSize: 12 }} />
        </span>
        <span style={{ fontSize: 12 }}>{item.label}</span>
      </div>
    </div>
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
      <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>{title}</Text>
      <div style={{ 
        border: '1px solid #d9d9d9', 
        borderRadius: 4, 
        minHeight: 120,
        background: '#fafafa',
      }}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.length === 0 ? (
            <div style={{ padding: 8, textAlign: 'center', color: '#999', fontSize: 11 }}>
              Drop items here
            </div>
          ) : (
            items.map((item) => (
              <SortableItem key={item.id} item={item} containerId={id} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!successFired.current && checkSetMembership(containers, targetState)) {
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
    <Card 
      title="Automation Rules" 
      style={{ width: 400 }} 
      size="small"
      data-testid="automation-rules-card"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <DroppableContainer id="inactive" items={containers.inactive} title="Inactive rules" />
          <DroppableContainer id="active" items={containers.active} title="Active rules" />
        </div>
        <DragOverlay>
          {activeItem ? (
            <div style={{ 
              padding: '4px 8px', 
              background: '#fff', 
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
            }}>
              <HolderOutlined style={{ color: '#999', fontSize: 12 }} />
              <span>{activeItem.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
