'use client';

/**
 * Task ID: drag_drop_between_lists-antd-T10
 * Task Name: Match a visual widget layout in the correct instance and save
 *
 * Setup Description:
 * Scene has TWO separate cards side-by-side, each with a drag-and-drop between-lists component.
 * Card 1: 'Homepage Layout' (distractor)
 * Card 2: 'Dashboard Layout' (target)
 *
 * Each card has: 'Available widgets' (left), 'Visible widgets' (right), a visual Preview,
 * and a 'Save layout' button.
 *
 * Initial state for Dashboard Layout (target):
 * - Available widgets: Revenue, Sessions, Top pages
 * - Visible widgets: Sales, Traffic
 * Target Visible widgets order: Revenue, Sales, Sessions
 *
 * Success: In Dashboard Layout, match Visible widgets to preview and click Save layout
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center, Instances: 2
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
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
import { arraysEqual, getItemLabels } from '../types';

const { Text } = Typography;

interface LayoutInstanceState {
  available: DraggableItem[];
  visible: DraggableItem[];
}

// Homepage Layout (distractor)
const initialHomepageLayout: LayoutInstanceState = {
  available: [
    { id: 'hp-banner', label: 'Banner' },
    { id: 'hp-promo', label: 'Promo' },
  ],
  visible: [
    { id: 'hp-hero', label: 'Hero' },
    { id: 'hp-features', label: 'Features' },
  ],
};

// Dashboard Layout (target)
const initialDashboardLayout: LayoutInstanceState = {
  available: [
    { id: 'db-revenue', label: 'Revenue' },
    { id: 'db-sessions', label: 'Sessions' },
    { id: 'db-top-pages', label: 'Top pages' },
  ],
  visible: [
    { id: 'db-sales', label: 'Sales' },
    { id: 'db-traffic', label: 'Traffic' },
  ],
};

const targetDashboardState = {
  'Available widgets': ['Top pages', 'Traffic'],
  'Visible widgets': ['Revenue', 'Sales', 'Sessions'],
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

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: '8px 12px',
    background: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'grab',
    fontSize: 12,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <HolderOutlined style={{ color: '#999', fontSize: 10 }} />
      <Text style={{ fontSize: 12 }}>{item.label}</Text>
    </div>
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
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 100,
        padding: 8,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 4,
        border: `1px dashed ${isOver ? '#1890ff' : '#d9d9d9'}`,
        transition: 'all 0.2s',
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>{title}</Text>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 60 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function LayoutCard({
  title,
  containers,
  setContainers,
  prefix,
  previewItems,
  onSave,
  instanceId,
}: {
  title: string;
  containers: LayoutInstanceState;
  setContainers: React.Dispatch<React.SetStateAction<LayoutInstanceState>>;
  prefix: string;
  previewItems: string[];
  onSave: () => void;
  instanceId: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string): string | undefined => {
    if (id === `${prefix}-available` || id === `${prefix}-visible`) {
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
      const activeItems = [...prev[activeContainer as keyof LayoutInstanceState]];
      const overItems = [...prev[overContainer as keyof LayoutInstanceState]];
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
      const items = containers[activeContainer as keyof LayoutInstanceState];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      if (oldIndex !== newIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer as keyof LayoutInstanceState], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId
    ? [...containers.available, ...containers.visible].find(item => item.id === activeId)
    : null;

  return (
    <Card
      title={title}
      size="small"
      style={{ width: 300 }}
      bodyStyle={{ padding: 12 }}
      data-testid={`dnd-instance-${instanceId}`}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            <DroppableContainer
              id={`${prefix}-available`}
              title="Available widgets"
              items={containers.available}
            />
            <DroppableContainer
              id={`${prefix}-visible`}
              title="Visible widgets"
              items={containers.visible}
            />
          </div>

          <DragOverlay>
            {activeItem ? (
              <div
                style={{
                  padding: '8px 12px',
                  background: '#fff',
                  border: '1px solid #1890ff',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: 12,
                }}
              >
                <HolderOutlined style={{ color: '#999', fontSize: 10 }} />
                <Text style={{ fontSize: 12 }}>{activeItem.label}</Text>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Preview */}
      <div
        style={{
          padding: 8,
          background: '#f6ffed',
          borderRadius: 4,
          border: '1px solid #b7eb8f',
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 10, color: '#52c41a', fontWeight: 600 }}>Preview</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
          {previewItems.map((item: string) => (
            <span
              key={item}
              style={{
                fontSize: 10,
                background: '#52c41a',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: 2,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <Button
        type="primary"
        size="small"
        onClick={onSave}
        style={{ width: '100%' }}
        data-testid={`save-layout-${instanceId}`}
      >
        Save layout
      </Button>
    </Card>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [homepageLayout, setHomepageLayout] = useState<LayoutInstanceState>(initialHomepageLayout);
  const [dashboardLayout, setDashboardLayout] = useState<LayoutInstanceState>(initialDashboardLayout);
  const [committedDashboard, setCommittedDashboard] = useState<LayoutInstanceState>(initialDashboardLayout);
  const successFired = useRef(false);

  // Check success condition (only Dashboard Layout committed state matters)
  useEffect(() => {
    if (successFired.current) return;
    
    const visibleLabels = getItemLabels(committedDashboard.visible);
    const availableLabels = getItemLabels(committedDashboard.available);
    const targetVisible = targetDashboardState['Visible widgets'];
    const targetAvailable = targetDashboardState['Available widgets'];

    const visibleMatch = arraysEqual(visibleLabels, targetVisible);
    const availableMatch =
      availableLabels.length === targetAvailable.length &&
      targetAvailable.every(l => availableLabels.includes(l));

    if (visibleMatch && availableMatch) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedDashboard, onSuccess]);

  const handleSaveHomepage = () => {
    // Homepage save does nothing for success
  };

  const handleSaveDashboard = () => {
    setCommittedDashboard({
      available: [...dashboardLayout.available],
      visible: [...dashboardLayout.visible],
    });
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <LayoutCard
        title="Homepage Layout"
        containers={homepageLayout}
        setContainers={setHomepageLayout}
        prefix="homepage"
        previewItems={['Hero', 'Features']}
        onSave={handleSaveHomepage}
        instanceId="homepage-layout"
      />
      <LayoutCard
        title="Dashboard Layout"
        containers={dashboardLayout}
        setContainers={setDashboardLayout}
        prefix="dashboard"
        previewItems={['Revenue', 'Sales', 'Sessions']}
        onSave={handleSaveDashboard}
        instanceId="dashboard-layout"
      />

      {/* Hidden field for checker */}
      <input
        type="hidden"
        data-testid="dashboard-committed-json"
        value={JSON.stringify({
          available: getItemLabels(committedDashboard.available),
          visible: getItemLabels(committedDashboard.visible),
        })}
      />
    </div>
  );
}
