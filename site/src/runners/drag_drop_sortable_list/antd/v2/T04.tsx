'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-v2-T04
 * AntD: Analytics list only in a three-list dashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Button, Typography, Space, Tag } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, SortableItem } from '../../types';
import { arraysEqual } from '../../types';

const { Text } = Typography;

const initialHome: SortableItem[] = [
  { id: 'h-overview', label: 'Overview' },
  { id: 'h-tasks', label: 'Tasks' },
  { id: 'h-notes', label: 'Notes' },
  { id: 'h-alerts', label: 'Alerts' },
  { id: 'h-calendar', label: 'Calendar' },
];

const initialAnalytics: SortableItem[] = [
  { id: 'a-overview', label: 'Overview' },
  { id: 'a-revenue', label: 'Revenue' },
  { id: 'a-retention', label: 'Retention' },
  { id: 'a-funnels', label: 'Funnels' },
  { id: 'a-notes', label: 'Notes' },
];

const initialOps: SortableItem[] = [
  { id: 'o-alerts', label: 'Alerts' },
  { id: 'o-overview', label: 'Overview' },
  { id: 'o-owners', label: 'Owners' },
  { id: 'o-incidents', label: 'Incidents' },
  { id: 'o-notes', label: 'Notes' },
];

const homeBaseline = initialHome.map((i) => i.id);
const opsBaseline = initialOps.map((i) => i.id);
const targetAnalyticsOrder = ['a-overview', 'a-revenue', 'a-funnels', 'a-retention', 'a-notes'];

function SortableRow({ item }: { item: SortableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    background: isDragging ? 'rgba(0,0,0,0.04)' : 'transparent',
  };
  return (
    <List.Item ref={setNodeRef} style={style} data-testid={`widget-item-${item.id}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
        <button
          type="button"
          aria-label="Drag handle"
          {...attributes}
          {...listeners}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'grab',
            color: '#999',
            display: 'flex',
          }}
        >
          <HolderOutlined style={{ fontSize: 11 }} />
        </button>
        <span style={{ fontSize: 12 }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [draftHome, setDraftHome] = useState(initialHome);
  const [draftAnalytics, setDraftAnalytics] = useState(initialAnalytics);
  const [draftOps, setDraftOps] = useState(initialOps);
  const [committedHome, setCommittedHome] = useState(initialHome);
  const [committedAnalytics, setCommittedAnalytics] = useState(initialAnalytics);
  const [committedOps, setCommittedOps] = useState(initialOps);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    const a = committedAnalytics.map((i) => i.id);
    const h = committedHome.map((i) => i.id);
    const o = committedOps.map((i) => i.id);
    if (arraysEqual(a, targetAnalyticsOrder) && arraysEqual(h, homeBaseline) && arraysEqual(o, opsBaseline)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedAnalytics, committedHome, committedOps, onSuccess]);

  const makeDragEnd =
    (setter: React.Dispatch<React.SetStateAction<SortableItem[]>>) => (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setter((items) => {
          const oi = items.findIndex((i) => i.id === active.id);
          const ni = items.findIndex((i) => i.id === over.id);
          return arrayMove(items, oi, ni);
        });
      }
    };

  const card = (
    title: string,
    testId: string,
    items: SortableItem[],
    onDragEnd: (e: DragEndEvent) => void,
    onSave: () => void,
    saveTestId: string
  ) => (
    <Card
      size="small"
      title={title}
      style={{ flex: 1, minWidth: 160 }}
      data-testid={testId}
      styles={{ body: { padding: 8 } }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <List
            size="small"
            bordered
            dataSource={items}
            renderItem={(item) => <SortableRow key={item.id} item={item} />}
          />
        </SortableContext>
      </DndContext>
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <Button type="primary" size="small" onClick={onSave} data-testid={saveTestId}>
          Save dashboard
        </Button>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 10 }} data-testid="widget-dashboard">
      <Space wrap style={{ marginBottom: 8 }}>
        <Tag color="blue">Live</Tag>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Last sync 2m ago
        </Text>
      </Space>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
        {card(
          'Home widgets',
          'card-home-widgets',
          draftHome,
          makeDragEnd(setDraftHome),
          () => setCommittedHome([...draftHome]),
          'save-dashboard-home-widgets'
        )}
        {card(
          'Analytics widgets',
          'card-analytics-widgets',
          draftAnalytics,
          makeDragEnd(setDraftAnalytics),
          () => setCommittedAnalytics([...draftAnalytics]),
          'save-dashboard-analytics-widgets'
        )}
        {card(
          'Ops widgets',
          'card-ops-widgets',
          draftOps,
          makeDragEnd(setDraftOps),
          () => setCommittedOps([...draftOps]),
          'save-dashboard-ops-widgets'
        )}
      </div>
    </div>
  );
}
