'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T04
 * Task Name: Move a member in the correct list instance
 *
 * Setup Description:
 * Scene has two separate sections stacked vertically: 'Team A Members' and 'Team B Members'.
 * Each section contains its own instance of the drag-and-drop between-lists component.
 *
 * Initial state:
 * Team A: Unassigned: Sam Rivera, Priya Shah | Assigned: Alex Chen
 * Team B: Unassigned: Sam Rivera, Morgan Lee | Assigned: Taylor Kim
 *
 * Success Trigger:
 * In Team A, move 'Sam Rivera' from Unassigned to Assigned. Order doesn't matter.
 * ONLY Team A is evaluated.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
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

const initialTeamA: ContainerState = {
  unassigned: [
    { id: 'teamA-sam', label: 'Sam Rivera' },
    { id: 'teamA-priya', label: 'Priya Shah' },
  ],
  assigned: [
    { id: 'teamA-alex', label: 'Alex Chen' },
  ],
};

const initialTeamB: ContainerState = {
  unassigned: [
    { id: 'teamB-sam', label: 'Sam Rivera' },
    { id: 'teamB-morgan', label: 'Morgan Lee' },
  ],
  assigned: [
    { id: 'teamB-taylor', label: 'Taylor Kim' },
  ],
};

const targetStateTeamA: Record<string, string[]> = {
  unassigned: ['Priya Shah'],
  assigned: ['Alex Chen', 'Sam Rivera'],
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
        minHeight: 150,
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

interface TeamSectionProps {
  title: string;
  containers: ContainerState;
  setContainers: React.Dispatch<React.SetStateAction<ContainerState>>;
  testId: string;
}

function TeamSection({ title, containers, setContainers, testId }: TeamSectionProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
    <Card title={title} style={{ marginBottom: 16 }} data-testid={testId}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <DroppableContainer id="unassigned" items={containers.unassigned} title="Unassigned" />
          <DroppableContainer id="assigned" items={containers.assigned} title="Assigned" />
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

export default function T04({ onSuccess }: TaskComponentProps) {
  const [teamAContainers, setTeamAContainers] = useState<ContainerState>(initialTeamA);
  const [teamBContainers, setTeamBContainers] = useState<ContainerState>(initialTeamB);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && checkSetMembership(teamAContainers, targetStateTeamA)) {
      successFired.current = true;
      onSuccess();
    }
  }, [teamAContainers, onSuccess]);

  return (
    <div style={{ maxWidth: 600 }}>
      <TeamSection 
        title="Team A Members" 
        containers={teamAContainers} 
        setContainers={setTeamAContainers}
        testId="dnd-instance-team-a"
      />
      <TeamSection 
        title="Team B Members" 
        containers={teamBContainers} 
        setContainers={setTeamBContainers}
        testId="dnd-instance-team-b"
      />
    </div>
  );
}
