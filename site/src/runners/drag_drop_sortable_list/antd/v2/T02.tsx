'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-v2-T02
 * AntD: Long drawer list with hidden target and save
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, List, Card, Typography, Space, Statistic, Timeline } from 'antd';
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

const { Text, Title } = Typography;

const initialItems: SortableItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'health', label: 'Health' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'funnels', label: 'Funnels' },
  { id: 'risks', label: 'Risks' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'owners', label: 'Owners' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'rollout', label: 'Rollout' },
  { id: 'support', label: 'Support' },
  { id: 'postmortem', label: 'Postmortem' },
];

const targetOrder = [
  'postmortem',
  'overview',
  'health',
  'revenue',
  'conversion',
  'funnels',
  'risks',
  'incidents',
  'owners',
  'dependencies',
  'rollout',
  'support',
];

function SortableRow({ item }: { item: SortableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    background: isDragging ? 'rgba(255,255,255,0.08)' : 'transparent',
  };
  return (
    <List.Item ref={setNodeRef} style={style} data-testid={`board-section-item-${item.id}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <button
          type="button"
          aria-label="Drag handle"
          {...attributes}
          {...listeners}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 2,
            cursor: 'grab',
            color: '#888',
            display: 'flex',
          }}
        >
          <HolderOutlined />
        </button>
        <span style={{ fontSize: 12 }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    const order = committedItems.map((i) => i.id);
    if (!drawerOpen && arraysEqual(order, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, drawerOpen, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDraftItems((items) => {
        const oi = items.findIndex((i) => i.id === active.id);
        const ni = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oi, ni);
      });
    }
  };

  const saveLayout = () => {
    setCommittedItems([...draftItems]);
    setDrawerOpen(false);
  };

  return (
    <div style={{ padding: 12 }}>
      <Space wrap style={{ marginBottom: 12 }}>
        <Card size="small" styles={{ body: { padding: 8 } }}>
          <Statistic title="Uptime" value={99.97} suffix="%" valueStyle={{ fontSize: 16 }} />
        </Card>
        <Card size="small" styles={{ body: { padding: 8 } }}>
          <Statistic title="Rollouts" value={12} valueStyle={{ fontSize: 16 }} />
        </Card>
      </Space>
      <Title level={5} style={{ marginTop: 0 }}>
        Release dashboard
      </Title>
      <Timeline
        style={{ marginBottom: 16, maxWidth: 480 }}
        items={[
          { children: 'v2.4 tagged' },
          { children: 'Staging soak complete' },
          { children: 'Canary at 10%' },
        ]}
      />
      <Button
        type="primary"
        onClick={() => {
          setDraftItems([...committedItems]);
          setDrawerOpen(true);
        }}
        data-testid="edit-board-sections"
      >
        Edit board sections
      </Button>

      <Drawer
        title="Board sections"
        placement="right"
        width={320}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="board-sections-drawer"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={saveLayout} data-testid="save-layout-button">
              Save layout
            </Button>
          </div>
        }
      >
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
          Drag handles to reorder. Scroll to reach lower sections.
        </Text>
        <div
          style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid #303030', borderRadius: 6 }}
          data-testid="board-sections-scroll-region"
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draftItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <List
                size="small"
                dataSource={draftItems}
                renderItem={(item) => <SortableRow key={item.id} item={item} />}
                data-testid="sortable-list-board-sections"
              />
            </SortableContext>
          </DndContext>
        </div>
      </Drawer>
    </div>
  );
}
