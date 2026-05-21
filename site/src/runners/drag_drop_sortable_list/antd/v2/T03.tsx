'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-v2-T03
 * AntD: Compact table row reorder with exact full order
 */

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Table, Card, Checkbox, Button, Typography, Space, Tag, Alert } from 'antd';
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

const initialItems: SortableItem[] = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
  { id: 'blocked', label: 'Blocked' },
];

const targetOrder = ['blocked', 'review', 'in-progress', 'todo', 'done'];

const laneBlurbs: Record<string, string> = {
  todo: 'New intake items',
  'in-progress': 'Active work',
  review: 'Needs eyes',
  done: 'Shipped',
  blocked: 'Waiting on dependency',
};

type RowCtx = { listeners: Record<string, unknown>; attributes: Record<string, unknown> };
const SortableRowContext = createContext<RowCtx | null>(null);

function DragHandleCell() {
  const ctx = useContext(SortableRowContext);
  if (!ctx) return null;
  return (
    <button
      type="button"
      aria-label="Drag handle"
      {...(ctx.listeners as any)}
      {...(ctx.attributes as any)}
      style={{
        border: 'none',
        background: 'transparent',
        padding: 2,
        cursor: 'grab',
        color: '#999',
        lineHeight: 1,
      }}
    >
      <HolderOutlined style={{ fontSize: 12 }} />
    </button>
  );
}

const DraggableBodyRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = (props) => {
  const id = (props as { 'data-row-key'?: string })['data-row-key'] ?? '';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
  };
  return (
    <SortableRowContext.Provider value={{ listeners, attributes } as unknown as RowCtx}>
      <tr ref={setNodeRef} style={style} {...props} />
    </SortableRowContext.Provider>
  );
};

export default function T03({ onSuccess }: TaskComponentProps) {
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
    if (arraysEqual(order, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

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

  const columns = [
    {
      title: '',
      key: 'handle',
      width: 36,
      render: () => <DragHandleCell />,
    },
    {
      title: 'Lane',
      dataIndex: 'label',
      key: 'label',
      width: 120,
      render: (label: string) => <Text style={{ fontSize: 12 }}>{label}</Text>,
    },
    {
      title: 'Description',
      key: 'desc',
      render: (_: unknown, row: SortableItem) => (
        <Text type="secondary" style={{ fontSize: 11 }}>
          {laneBlurbs[row.id]}
        </Text>
      ),
    },
    {
      title: 'Notify',
      key: 'notify',
      width: 72,
      render: () => <Checkbox disabled />,
    },
  ];

  return (
    <div style={{ padding: 12, minHeight: 380 }}>
      <Alert
        type="info"
        showIcon
        message="Incident settings"
        description="Review routing rules before changing lane priority."
        style={{ marginBottom: 10 }}
      />
      <Space wrap style={{ marginBottom: 10 }}>
        <Tag>SEV-2</Tag>
        <Tag color="orange">Active</Tag>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Owner: Infra
        </Text>
      </Space>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Card
          size="small"
          title="Lane priority"
          style={{ width: 420 }}
          data-testid="lane-priority-card"
          styles={{ body: { padding: 8 } }}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draftItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <Table<SortableItem>
                size="small"
                pagination={false}
                rowKey="id"
                dataSource={draftItems}
                columns={columns}
                components={{ body: { row: DraggableBodyRow } }}
                data-testid="lane-priority-table"
              />
            </SortableContext>
          </DndContext>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button size="small">Cancel</Button>
            <Button
              type="primary"
              size="small"
              onClick={() => setCommittedItems([...draftItems])}
              data-testid="lane-priority-apply"
            >
              Apply
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
