'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T03
 * Task Name: Enable a notification channel in a settings form
 *
 * Setup Description:
 * Scene is a form section labeled 'Notification Settings' with several common controls
 * above and below the target component. Contains a sub-card titled 'Notification Channels'.
 *
 * Initial state:
 * - Enabled channels: Email, Push
 * - Disabled channels: SMS, Webhook
 *
 * Success Trigger:
 * Move 'SMS' from Disabled channels to Enabled channels. Order doesn't matter.
 *
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Typography, Input, Switch, Form } from 'antd';
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

const { Text, Title } = Typography;

const initialContainers: ContainerState = {
  enabled: [
    { id: 'email', label: 'Email' },
    { id: 'push', label: 'Push' },
  ],
  disabled: [
    { id: 'sms', label: 'SMS' },
    { id: 'webhook', label: 'Webhook' },
  ],
};

const targetState: Record<string, string[]> = {
  enabled: ['Email', 'Push', 'SMS'],
  disabled: ['Webhook'],
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
        <div>
          <div>{item.label}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {item.label === 'Email' && 'Receive email notifications'}
            {item.label === 'Push' && 'Browser push notifications'}
            {item.label === 'SMS' && 'Text message alerts'}
            {item.label === 'Webhook' && 'HTTP webhook callbacks'}
          </Text>
        </div>
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

export default function T03({ onSuccess }: TaskComponentProps) {
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
    <div style={{ maxWidth: 700 }}>
      <Title level={4}>Notification Settings</Title>
      
      <Form layout="vertical" style={{ marginBottom: 24 }}>
        <Form.Item label="Sender name">
          <Input placeholder="Enter sender name" defaultValue="My App" />
        </Form.Item>
        <Form.Item label="Send weekly summary">
          <Switch defaultChecked />
        </Form.Item>
      </Form>

      <Card title="Notification Channels" size="small" data-testid="notification-channels-card">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <DroppableContainer id="enabled" items={containers.enabled} title="Enabled channels" />
            <DroppableContainer id="disabled" items={containers.disabled} title="Disabled channels" />
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
    </div>
  );
}
