'use client';

/**
 * Task ID: drag_drop_between_lists-antd-v2-T17
 * Modal reviewer assignment: exact destination order + Done commit; committed chips on base page.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, List, Modal, Space, Tag, Typography } from 'antd';
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
import { checkExactOrder, getItemLabels } from '../../types';

const { Text } = Typography;

const PREFIX = 'modal';

type PairState = { available: DraggableItem[]; assigned: DraggableItem[] };

const initialDraft: PairState = {
  available: [
    { id: 'jordan', label: 'Jordan Lee' },
    { id: 'kai', label: 'Kai Nguyen' },
  ],
  assigned: [
    { id: 'avery', label: 'Avery Patel' },
    { id: 'riley', label: 'Riley Chen' },
  ],
};

const targetState: Record<string, string[]> = {
  'Available reviewers': ['Kai Nguyen'],
  'Assigned reviewers': ['Avery Patel', 'Jordan Lee', 'Riley Chen'],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    background: isDragging ? '#e6f7ff' : undefined,
    border: isDragging ? '1px solid #1890ff' : undefined,
    borderRadius: isDragging ? 4 : undefined,
    boxShadow: isDragging ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
    zIndex: isDragging ? 10 : undefined,
    position: 'relative',
  };

  return (
    <List.Item ref={setNodeRef} style={style} {...attributes} data-testid={`dnd-item-${item.id}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <span
          ref={setActivatorNodeRef}
          {...listeners}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none', color: '#999', display: 'inline-flex' }}
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
        minHeight: 140,
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

export default function T17({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PairState>(initialDraft);
  const [committed, setCommitted] = useState<PairState>(initialDraft);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: UniqueIdentifier): keyof PairState | undefined => {
    const sid = String(id);
    if (sid === `${PREFIX}-available`) return 'available';
    if (sid === `${PREFIX}-assigned`) return 'assigned';
    if (draft.available.some((i) => i.id === sid)) return 'available';
    if (draft.assigned.some((i) => i.id === sid)) return 'assigned';
    return undefined;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeContainer = findContainer(active.id);
    let overContainer = findContainer(over.id);
    if (!overContainer && String(over.id).startsWith(PREFIX)) {
      const raw = String(over.id).replace(`${PREFIX}-`, '');
      if (raw === 'available' || raw === 'assigned') overContainer = raw;
    }
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setDraft((prev) => {
      const aItems = [...prev[activeContainer]];
      const oItems = [...prev[overContainer]];
      const ai = aItems.findIndex((i) => i.id === active.id);
      if (ai === -1) return prev;
      const [moved] = aItems.splice(ai, 1);
      const oi = oItems.findIndex((i) => i.id === over.id);
      if (oi === -1) oItems.push(moved);
      else oItems.splice(oi, 0, moved);
      return { ...prev, [activeContainer]: aItems, [overContainer]: oItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const ac = findContainer(active.id);
    const oc = findContainer(over.id);
    if (!ac || !oc || ac !== oc) return;
    const items = [...draft[ac]];
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setDraft((prev) => ({ ...prev, [ac]: arrayMove(items, oldIndex, newIndex) }));
    }
  };

  useEffect(() => {
    if (successFired.current || open) return;
    const containers = {
      'Available reviewers': committed.available,
      'Assigned reviewers': committed.assigned,
    };
    if (checkExactOrder(containers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, open, onSuccess]);

  const commit = () => {
    setCommitted({
      available: draft.available.map((i) => ({ ...i })),
      assigned: draft.assigned.map((i) => ({ ...i })),
    });
    setOpen(false);
  };

  return (
    <div style={{ padding: 12, maxWidth: 720 }}>
      <Card size="small" title="Review settings" style={{ marginBottom: 12 }}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Reviewers apply to the next release sign-off.
          </Text>
          <div>
            <Text strong style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
              Committed reviewers
            </Text>
            <div style={{ fontSize: 11, marginBottom: 4 }}>Available</div>
            <Space size={[4, 4]} wrap>
              {getItemLabels(committed.available).map((l) => (
                <Tag key={l}>{l}</Tag>
              ))}
            </Space>
            <div style={{ fontSize: 11, marginTop: 8, marginBottom: 4 }}>Assigned</div>
            <Space size={[4, 4]} wrap data-testid="committed-assigned-reviewers">
              {getItemLabels(committed.assigned).map((l) => (
                <Tag key={l} color="blue">
                  {l}
                </Tag>
              ))}
            </Space>
          </div>
          <Button
            type="primary"
            onClick={() => {
              setDraft({
                available: committed.available.map((i) => ({ ...i })),
                assigned: committed.assigned.map((i) => ({ ...i })),
              });
              setOpen(true);
            }}
            data-testid="edit-reviewers-open"
          >
            Edit reviewers
          </Button>
        </Space>
      </Card>

      <Modal
        title="Assign reviewers"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="c" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="d" type="primary" onClick={commit} data-testid="assign-reviewers-done">
            Done
          </Button>,
        ]}
        width={560}
        destroyOnClose={false}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 10, fontSize: 12 }}>
          Draft updates apply after Done.
        </Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <DroppableColumn id={`${PREFIX}-available`} title="Available reviewers" items={draft.available} />
            <DroppableColumn id={`${PREFIX}-assigned`} title="Assigned reviewers" items={draft.assigned} />
          </div>
        </DndContext>
      </Modal>
    </div>
  );
}
