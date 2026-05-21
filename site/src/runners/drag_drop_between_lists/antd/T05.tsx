'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T05
 * Task Name: Reset a column chooser and apply
 *
 * Setup Description:
 * Card titled 'Table Columns' contains a dual-list drag-and-drop component with
 * 'Reset to defaults' link and 'Apply' button. Uses staged changes.
 *
 * Initial state (non-default):
 * - Visible columns: Name, Owner
 * - Hidden columns: Status, Tags, Notes
 *
 * Default state (after reset):
 * - Visible columns: Name, Status, Owner
 * - Hidden columns: Tags, Notes
 *
 * Success Trigger:
 * Click 'Reset to defaults', then click 'Apply'. Order MATTERS.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Typography, Button, Badge, Space } from 'antd';
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
  visible: [
    { id: 'name', label: 'Name' },
    { id: 'owner', label: 'Owner' },
  ],
  hidden: [
    { id: 'status', label: 'Status' },
    { id: 'tags', label: 'Tags' },
    { id: 'notes', label: 'Notes' },
  ],
};

const defaultContainers: ContainerState = {
  visible: [
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
    { id: 'owner', label: 'Owner' },
  ],
  hidden: [
    { id: 'tags', label: 'Tags' },
    { id: 'notes', label: 'Notes' },
  ],
};

const targetState: Record<string, string[]> = {
  visible: ['Name', 'Status', 'Owner'],
  hidden: ['Tags', 'Notes'],
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
        minHeight: 180,
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

export default function T05({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committedContainers, setCommittedContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!successFired.current && checkExactOrder(committedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedContainers, onSuccess]);

  useEffect(() => {
    const draftJSON = JSON.stringify(containers);
    const committedJSON = JSON.stringify(committedContainers);
    setHasUnappliedChanges(draftJSON !== committedJSON);
  }, [containers, committedContainers]);

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

  const handleReset = () => {
    setContainers(JSON.parse(JSON.stringify(defaultContainers)));
  };

  const handleApply = () => {
    setCommittedContainers(JSON.parse(JSON.stringify(containers)));
  };

  const activeItem = activeId 
    ? Object.values(containers).flat().find(item => item.id === activeId) 
    : null;

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Table Columns</span>
          <Button type="link" onClick={handleReset} data-testid="reset-button">
            Reset to defaults
          </Button>
        </div>
      }
      style={{ width: 550 }} 
      data-testid="table-columns-card"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <DroppableContainer id="visible" items={containers.visible} title="Visible columns" />
          <DroppableContainer id="hidden" items={containers.hidden} title="Hidden columns" />
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          {hasUnappliedChanges && (
            <Badge status="warning" text="Not applied" />
          )}
        </Space>
        <Button type="primary" onClick={handleApply} data-testid="apply-button">
          Apply
        </Button>
      </div>
    </Card>
  );
}
