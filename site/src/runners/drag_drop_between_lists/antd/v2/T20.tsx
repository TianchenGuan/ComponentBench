'use client';

/**
 * Task ID: drag_drop_between_lists-antd-v2-T20
 * Quick actions: match Reference preview (ref-quick-actions), exact list order, Save actions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, List, Space, Typography } from 'antd';
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
import type { TaskComponentProps, DraggableItem } from '../../types';
import { checkExactOrder } from '../../types';

const { Text } = Typography;

const PREFIX = 'qa';

type PairState = { available: DraggableItem[]; pinned: DraggableItem[] };

const initialDraft: PairState = {
  available: [
    { id: 'qa-export', label: 'Export' },
    { id: 'qa-compare', label: 'Compare' },
    { id: 'qa-share', label: 'Share' },
    { id: 'qa-archive', label: 'Archive' },
  ],
  pinned: [
    { id: 'qa-open', label: 'Open' },
    { id: 'qa-edit', label: 'Edit' },
  ],
};

const targetState: Record<string, string[]> = {
  'Pinned actions': ['Open', 'Share', 'Compare'],
};

const referenceOrder = ['Open', 'Share', 'Compare'];

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <List.Item ref={setNodeRef} style={style} {...attributes} data-testid={`dnd-item-${item.id}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <span
          ref={setActivatorNodeRef}
          {...listeners}
          style={{ cursor: 'grab', touchAction: 'none', color: '#999', display: 'inline-flex' }}
        >
          <HolderOutlined />
        </span>
        <span style={{ fontSize: 12 }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

function DroppableColumn({
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
        border: `1px dashed ${isOver ? '#1890ff' : '#d9d9d9'}`,
        borderRadius: 4,
        padding: 6,
        minHeight: 130,
        background: isOver ? '#e6f7ff' : '#fafafa',
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
        {title}
      </Text>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <List
          size="small"
          dataSource={items}
          locale={{ emptyText: 'Drop here' }}
          renderItem={(item) => <SortableItem key={item.id} item={item} />}
        />
      </SortableContext>
    </div>
  );
}

export default function T20({ onSuccess }: TaskComponentProps) {
  const [draft, setDraft] = useState<PairState>(initialDraft);
  const [committed, setCommitted] = useState<PairState>(initialDraft);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: UniqueIdentifier): keyof PairState | undefined => {
    const sid = String(id);
    if (sid === `${PREFIX}-available`) return 'available';
    if (sid === `${PREFIX}-pinned`) return 'pinned';
    if (draft.available.some((i) => i.id === sid)) return 'available';
    if (draft.pinned.some((i) => i.id === sid)) return 'pinned';
    return undefined;
  };

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const ac = findContainer(active.id);
    let oc = findContainer(over.id);
    if (!oc && String(over.id).startsWith(PREFIX)) {
      const r = String(over.id).replace(`${PREFIX}-`, '');
      if (r === 'available' || r === 'pinned') oc = r;
    }
    if (!ac || !oc || ac === oc) return;

    setDraft((prev) => {
      const aItems = [...prev[ac]];
      const oItems = [...prev[oc]];
      const ai = aItems.findIndex((i) => i.id === active.id);
      if (ai === -1) return prev;
      const [moved] = aItems.splice(ai, 1);
      const oi = oItems.findIndex((i) => i.id === over.id);
      if (oi === -1) oItems.push(moved);
      else oItems.splice(oi, 0, moved);
      return { ...prev, [ac]: aItems, [oc]: oItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const ac = findContainer(active.id);
    const oc = findContainer(over.id);
    if (!ac || !oc || ac !== oc) return;
    const items = [...draft[ac]];
    const oi = items.findIndex((i) => i.id === active.id);
    const ni = items.findIndex((i) => i.id === over.id);
    if (oi !== -1 && ni !== -1 && oi !== ni) {
      setDraft((prev) => ({ ...prev, [ac]: arrayMove(items, oi, ni) }));
    }
  };

  const activeItem = activeId
    ? [...draft.available, ...draft.pinned].find((i) => i.id === activeId)
    : null;

  useEffect(() => {
    if (successFired.current) return;
    const containers = {
      'Available actions': committed.available,
      'Pinned actions': committed.pinned,
    };
    if (checkExactOrder(containers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const save = () => {
    setCommitted({
      available: draft.available.map((i) => ({ ...i })),
      pinned: draft.pinned.map((i) => ({ ...i })),
    });
  };

  return (
    <div style={{ padding: 12, maxWidth: 640 }}>
      <Card
        size="small"
        title="Quick actions"
        extra={<Text type="secondary" style={{ fontSize: 11 }}>Dashboard</Text>}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <DroppableColumn id={`${PREFIX}-available`} title="Available actions" items={draft.available} />
            <DroppableColumn id={`${PREFIX}-pinned`} title="Pinned actions" items={draft.pinned} />
          </div>
          <DragOverlay>
            {activeItem ? (
              <div
                style={{
                  padding: '6px 10px',
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              >
                <HolderOutlined style={{ color: '#999' }} />
                {activeItem.label}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div
          id="ref-quick-actions"
          data-testid="ref-quick-actions"
          style={{
            padding: 10,
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 4,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 11, color: '#389e0d', fontWeight: 600 }}>Reference preview</Text>
          <Space size={[6, 6]} wrap style={{ marginTop: 8 }}>
            {referenceOrder.map((label) => (
              <span
                key={label}
                style={{
                  fontSize: 11,
                  background: '#52c41a',
                  color: '#fff',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                {label}
              </span>
            ))}
          </Space>
        </div>

        <Button type="primary" block onClick={save} data-testid="save-actions">
          Save actions
        </Button>
      </Card>
    </div>
  );
}
