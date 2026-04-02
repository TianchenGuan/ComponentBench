'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T09
 * Task Name: Search then grant a permission in dark mode
 *
 * Setup Description:
 * Scene uses dark theme. Centered isolated Card titled 'Permissions'.
 * Left panel: 'Available permissions' with search input. Right panel: 'Granted permissions'.
 * Typing in search filters the Available list.
 *
 * Initial state:
 * - Granted permissions: View dashboard, Read analytics
 * - Available permissions: Create reports, Delete reports, Edit reports, Import data,
 *   Manage API keys, Manage users, Schedule reports, Share reports, View audit log, Export reports
 *
 * Success: Move 'Export reports' to Granted permissions (use search to find it)
 * Theme: dark, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Typography, Input } from 'antd';
import { HolderOutlined, SearchOutlined } from '@ant-design/icons';
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
import { checkSetMembership } from '../types';

const { Text } = Typography;

const availablePermissions = [
  'Create reports', 'Delete reports', 'Edit reports', 'Import data',
  'Manage API keys', 'Manage users', 'Schedule reports', 'Share reports',
  'View audit log', 'Export reports'
];

const initialContainers: ContainerState = {
  available: availablePermissions.map(p => ({ id: p.toLowerCase().replace(/\s+/g, '-'), label: p })),
  granted: [
    { id: 'view-dashboard', label: 'View dashboard' },
    { id: 'read-analytics', label: 'Read analytics' },
  ],
};

const targetState = {
  'Granted permissions': ['View dashboard', 'Read analytics', 'Export reports'],
};

function SortableItem({ item, isDark }: { item: DraggableItem; isDark?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: '10px 14px',
    background: isDark ? '#2a2a2a' : '#fff',
    border: `1px solid ${isDark ? '#404040' : '#f0f0f0'}`,
    borderRadius: 6,
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <HolderOutlined style={{ color: isDark ? '#666' : '#999', fontSize: 12 }} />
      <Text style={{ fontSize: 13, color: isDark ? '#e0e0e0' : undefined }}>{item.label}</Text>
    </div>
  );
}

function DroppableContainer({
  id,
  title,
  items,
  isDark,
  searchInput,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  isDark?: boolean;
  searchInput?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 180,
        padding: 12,
        background: isOver ? (isDark ? '#1a3a4a' : '#e6f7ff') : (isDark ? '#1f1f1f' : '#fafafa'),
        borderRadius: 6,
        border: `2px dashed ${isOver ? '#1890ff' : (isDark ? '#404040' : '#d9d9d9')}`,
        transition: 'all 0.2s',
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13, color: isDark ? '#e0e0e0' : undefined }}>
        {title}
      </Text>
      {searchInput}
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 100, maxHeight: 200, overflowY: 'auto' }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} isDark={isDark} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter available items by search
  const filteredAvailable = useMemo(() => {
    if (!searchText) return containers.available;
    return containers.available.filter(item =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [containers.available, searchText]);

  // Check success condition
  useEffect(() => {
    if (successFired.current) return;
    
    const grantedLabels = containers.granted.map(i => i.label);
    const hasRequired = ['View dashboard', 'Read analytics', 'Export reports'].every(
      label => grantedLabels.includes(label)
    );
    
    if (hasRequired) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id === 'available' || id === 'granted') return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
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
    const overContainer = findContainer(over.id as string) || (over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setContainers(prev => {
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

  const activeItem = activeId
    ? [...containers.available, ...containers.granted].find(item => item.id === activeId)
    : null;

  return (
    <Card
      title={<span style={{ color: '#e0e0e0' }}>Permissions</span>}
      style={{ width: 520, background: '#1f1f1f', borderColor: '#404040' }}
      headStyle={{ background: '#2a2a2a', borderColor: '#404040' }}
      bodyStyle={{ background: '#1f1f1f' }}
      data-testid="permissions-card"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <DroppableContainer
            id="available"
            title="Available permissions"
            items={filteredAvailable}
            isDark
            searchInput={
              <Input
                placeholder="Search permissions"
                prefix={<SearchOutlined style={{ color: '#666' }} />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ marginBottom: 8, background: '#2a2a2a', borderColor: '#404040' }}
                data-testid="permissions-search"
              />
            }
          />
          <DroppableContainer
            id="granted"
            title="Granted permissions"
            items={containers.granted}
            isDark
          />
        </div>

        <DragOverlay>
          {activeItem ? (
            <div
              style={{
                padding: '10px 14px',
                background: '#2a2a2a',
                border: '1px solid #1890ff',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <HolderOutlined style={{ color: '#666', fontSize: 12 }} />
              <Text style={{ fontSize: 13, color: '#e0e0e0' }}>{activeItem.label}</Text>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
