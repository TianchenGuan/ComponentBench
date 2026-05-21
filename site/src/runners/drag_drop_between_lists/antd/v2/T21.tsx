'use client';

/**
 * Task ID: drag_drop_between_lists-antd-v2-T21
 * Draft transfer Critical alerts → Enabled, close drawer, Discard changes; success = original membership + discard confirm.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, Drawer, List, Modal, Typography } from 'antd';
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
import { checkSetMembership } from '../../types';

const { Text } = Typography;

const PREFIX = 'notif';

const CRITICAL_ID = 'ch-critical';

type PairState = { enabled: DraggableItem[]; disabled: DraggableItem[] };

const initialState: PairState = {
  enabled: [
    { id: 'ch-email', label: 'Email' },
    { id: 'ch-push', label: 'Push' },
  ],
  disabled: [
    { id: CRITICAL_ID, label: 'Critical alerts' },
    { id: 'ch-digest', label: 'Digest' },
    { id: 'ch-sms', label: 'SMS' },
  ],
};

const targetMembership: Record<string, string[]> = {
  Enabled: ['Email', 'Push'],
  Disabled: ['Critical alerts', 'Digest', 'SMS'],
};

function listsEqualAsSets(a: DraggableItem[], b: DraggableItem[]): boolean {
  const la = a.map((i) => i.label).sort().join('\0');
  const lb = b.map((i) => i.label).sort().join('\0');
  return la === lb;
}

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

export default function T21({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PairState>(initialState);
  const successFired = useRef(false);
  const sawCriticalInEnabled = useRef(false);
  const [discardCompleted, setDiscardCompleted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const dirty = !listsEqualAsSets(draft.enabled, initialState.enabled) || !listsEqualAsSets(draft.disabled, initialState.disabled);

  useEffect(() => {
    if (draft.enabled.some((i) => i.id === CRITICAL_ID)) {
      sawCriticalInEnabled.current = true;
    }
  }, [draft]);

  const findContainer = (id: UniqueIdentifier): keyof PairState | undefined => {
    const sid = String(id);
    if (sid === `${PREFIX}-enabled`) return 'enabled';
    if (sid === `${PREFIX}-disabled`) return 'disabled';
    if (draft.enabled.some((i) => i.id === sid)) return 'enabled';
    if (draft.disabled.some((i) => i.id === sid)) return 'disabled';
    return undefined;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const ac = findContainer(active.id);
    let oc = findContainer(over.id);
    if (!oc && String(over.id).startsWith(PREFIX)) {
      const r = String(over.id).replace(`${PREFIX}-`, '');
      if (r === 'enabled' || r === 'disabled') oc = r;
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

  useEffect(() => {
    if (successFired.current) return;
    if (!discardCompleted || open) return;
    if (!sawCriticalInEnabled.current) return;

    const containers = {
      Enabled: draft.enabled,
      Disabled: draft.disabled,
    };
    if (checkSetMembership(containers, targetMembership)) {
      successFired.current = true;
      onSuccess();
    }
  }, [draft, open, discardCompleted, onSuccess]);

  const requestClose = () => {
    if (!dirty) {
      setOpen(false);
      return;
    }
    Modal.confirm({
      title: 'Unsaved changes',
      content: 'You have unsaved changes to notification channels.',
      okText: 'Discard changes',
      cancelText: 'Keep editing',
      onOk: () => {
        setDraft({
          enabled: initialState.enabled.map((i) => ({ ...i })),
          disabled: initialState.disabled.map((i) => ({ ...i })),
        });
        setDiscardCompleted(true);
        setOpen(false);
      },
    });
  };

  return (
    <div style={{ padding: 12 }}>
      <Button
        type="primary"
        onClick={() => {
          setDraft({
            enabled: initialState.enabled.map((i) => ({ ...i })),
            disabled: initialState.disabled.map((i) => ({ ...i })),
          });
          setOpen(true);
        }}
        data-testid="edit-notification-channels"
      >
        Edit notification channels
      </Button>

      <Drawer
        title="Notification channels"
        placement="right"
        width={520}
        open={open}
        onClose={requestClose}
        maskClosable={false}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={requestClose}>Cancel</Button>
          </div>
        }
      >
        {dirty ? (
          <Alert
            type="warning"
            showIcon
            message="Unsaved changes"
            style={{ marginBottom: 12 }}
            data-testid="unsaved-banner"
          />
        ) : null}
        <Text type="secondary" style={{ display: 'block', marginBottom: 10, fontSize: 12 }}>
          Drag channels between Enabled and Disabled. Close the drawer to discard drafts.
        </Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <DroppableColumn id={`${PREFIX}-enabled`} title="Enabled" items={draft.enabled} />
            <DroppableColumn id={`${PREFIX}-disabled`} title="Disabled" items={draft.disabled} />
          </div>
        </DndContext>
      </Drawer>
    </div>
  );
}
