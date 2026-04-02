'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-v2-T01
 * AntD: Apply exact order in the correct list instance
 */

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Card, List, Switch, Typography, Button, Popover, Space } from 'antd';
import { HolderOutlined, MenuFoldOutlined } from '@ant-design/icons';
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

const initialPinned: SortableItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'funnels', label: 'Funnels' },
];

const initialSaved: SortableItem[] = [
  { id: 'sv-overview', label: 'Overview' },
  { id: 'sv-engagement', label: 'Engagement' },
  { id: 'sv-changelog', label: 'Changelog' },
  { id: 'sv-notes', label: 'Notes' },
  { id: 'sv-archive', label: 'Archive' },
];

const targetPinnedOrder = ['overview', 'engagement', 'revenue', 'conversion', 'funnels'];
const savedBaselineIds = initialSaved.map((i) => i.id);

function SortableRowPinned({ item }: { item: SortableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    background: isDragging ? 'rgba(0,0,0,0.04)' : 'transparent',
  };
  return (
    <List.Item ref={setNodeRef} style={style} data-testid={`pinned-sortable-item-${item.id}`}>
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
            color: '#999',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HolderOutlined />
        </button>
        <span style={{ fontSize: 13 }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

function SortableRowSaved({ item }: { item: SortableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    background: isDragging ? 'rgba(0,0,0,0.04)' : 'transparent',
  };
  return (
    <List.Item ref={setNodeRef} style={style} data-testid={`saved-sortable-item-${item.id}`}>
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
            color: '#999',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HolderOutlined />
        </button>
        <span style={{ fontSize: 13 }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [draftPinned, setDraftPinned] = useState<SortableItem[]>(initialPinned);
  const [draftSaved, setDraftSaved] = useState<SortableItem[]>(initialSaved);
  const [committedPinned, setCommittedPinned] = useState<SortableItem[]>(initialPinned);
  const [committedSaved, setCommittedSaved] = useState<SortableItem[]>(initialSaved);
  const [applyOpen, setApplyOpen] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    const p = committedPinned.map((i) => i.id);
    const s = committedSaved.map((i) => i.id);
    if (arraysEqual(p, targetPinnedOrder) && arraysEqual(s, savedBaselineIds)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedPinned, committedSaved, onSuccess]);

  const commitFromDraft = () => {
    setCommittedPinned([...draftPinned]);
    setCommittedSaved([...draftSaved]);
    setApplyOpen(false);
  };

  const onPinnedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDraftPinned((items) => {
        const oi = items.findIndex((i) => i.id === active.id);
        const ni = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oi, ni);
      });
    }
  };

  const onSavedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDraftSaved((items) => {
        const oi = items.findIndex((i) => i.id === active.id);
        const ni = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oi, ni);
      });
    }
  };

  const applyContent = (
    <Space direction="vertical" size="small" style={{ minWidth: 160 }}>
      <Text type="secondary" style={{ fontSize: 12 }}>
        Commit list order?
      </Text>
      <Space>
        <Button
          type="primary"
          size="small"
          onClick={commitFromDraft}
          data-testid="confirm-apply-order"
        >
          Confirm
        </Button>
        <Button size="small" onClick={() => setApplyOpen(false)}>
          Cancel
        </Button>
      </Space>
    </Space>
  );

  return (
    <Layout style={{ minHeight: 360, background: '#f5f5f5' }}>
      <Layout.Sider width={72} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: 8, textAlign: 'center' }}>
          <MenuFoldOutlined style={{ fontSize: 18, color: '#bbb' }} />
        </div>
      </Layout.Sider>
      <Layout.Content style={{ padding: '12px 16px' }}>
        <Space style={{ marginBottom: 10 }} align="center">
          <Text type="secondary" style={{ fontSize: 12 }}>
            Compact mode
          </Text>
          <Switch size="small" defaultChecked disabled />
          <Switch size="small" disabled />
        </Space>
        <Card
          size="small"
          title="Workspace layout"
          style={{ maxWidth: 440 }}
          data-testid="workspace-layout-card"
        >
          <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 12 }}>
            Pinned views
          </Text>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onPinnedDragEnd}>
            <SortableContext items={draftPinned.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <List
                size="small"
                bordered
                dataSource={draftPinned}
                renderItem={(item) => <SortableRowPinned key={item.id} item={item} />}
                data-testid="sortable-list-pinned-views"
                style={{ marginBottom: 14 }}
              />
            </SortableContext>
          </DndContext>

          <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 12 }}>
            Saved views
          </Text>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onSavedDragEnd}>
            <SortableContext items={draftSaved.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <List
                size="small"
                bordered
                dataSource={draftSaved}
                renderItem={(item) => <SortableRowSaved key={item.id} item={item} />}
                data-testid="sortable-list-saved-views"
              />
            </SortableContext>
          </DndContext>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <Popover
              open={applyOpen}
              onOpenChange={setApplyOpen}
              content={applyContent}
              trigger="click"
              placement="topRight"
            >
              <Button type="primary" size="small" data-testid="apply-order-button">
                Apply order
              </Button>
            </Popover>
          </div>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
