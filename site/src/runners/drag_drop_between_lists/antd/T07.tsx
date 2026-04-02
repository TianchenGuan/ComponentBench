'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T07
 * Task Name: Match Sprint list to a reference preview
 *
 * Setup Description:
 * Card titled 'Sprint Planning'. Drag-and-drop between 'Backlog' and 'Sprint'.
 * A small side panel titled 'Sprint Preview' shows the target Sprint tasks.
 *
 * Initial state:
 * - Backlog: Bugfix: login, UI polish, Refactor billing
 * - Sprint: API auth, Docs update
 *
 * Target (according to preview):
 * - Sprint: API auth, Bugfix: login, UI polish
 * - Backlog: Refactor billing, Docs update
 *
 * Success Trigger:
 * Match Sprint to the preview (move items so membership matches). Order doesn't matter.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Typography, Tag } from 'antd';
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
  backlog: [
    { id: 'bugfix-login', label: 'Bugfix: login' },
    { id: 'ui-polish', label: 'UI polish' },
    { id: 'refactor-billing', label: 'Refactor billing' },
  ],
  sprint: [
    { id: 'api-auth', label: 'API auth' },
    { id: 'docs-update', label: 'Docs update' },
  ],
};

const targetState: Record<string, string[]> = {
  backlog: ['Refactor billing', 'Docs update'],
  sprint: ['API auth', 'Bugfix: login', 'UI polish'],
};

const previewItems = ['API auth', 'Bugfix: login', 'UI polish'];

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

export default function T07({ onSuccess }: TaskComponentProps) {
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
    <Card title="Sprint Planning" style={{ width: 700 }} data-testid="sprint-planning-card">
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 2 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Match Sprint to the preview
          </Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <DroppableContainer id="backlog" items={containers.backlog} title="Backlog" />
              <DroppableContainer id="sprint" items={containers.sprint} title="Sprint" />
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
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid #f0f0f0', paddingLeft: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Sprint Preview</Text>
          <div style={{ 
            background: '#f5f5f5', 
            borderRadius: 4, 
            padding: 12,
          }}>
            {previewItems.map((item, index) => (
              <Tag key={index} style={{ marginBottom: 8, display: 'block', width: 'fit-content' }}>
                {item}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
