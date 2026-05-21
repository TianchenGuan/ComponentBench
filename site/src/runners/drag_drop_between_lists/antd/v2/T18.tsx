'use client';

/**
 * Task ID: drag_drop_between_lists-antd-v2-T18
 * Two workspace section selectors; only Secondary is editable; Apply secondary sections commits exact order.
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
import { checkExactOrder, getItemLabels } from '../../types';

const { Text } = Typography;

const PREFIX = 'sec';

type SecState = { available: DraggableItem[]; enabled: DraggableItem[] };

const primaryFrozen: SecState = {
  enabled: [
    { id: 'pri-overview', label: 'Overview' },
    { id: 'pri-billing', label: 'Billing' },
    { id: 'pri-alerts', label: 'Alerts' },
  ],
  available: [
    { id: 'pri-audit', label: 'Audit' },
    { id: 'pri-notes', label: 'Notes' },
  ],
};

const initialSecondaryDraft: SecState = {
  enabled: [
    { id: 'sec-overview', label: 'Overview' },
    { id: 'sec-alerts', label: 'Alerts' },
  ],
  available: [
    { id: 'sec-billing', label: 'Billing' },
    { id: 'sec-audit', label: 'Audit' },
    { id: 'sec-notes', label: 'Notes' },
  ],
};

const targetSecondary: Record<string, string[]> = {
  'Available sections': ['Notes'],
  'Enabled sections': ['Overview', 'Alerts', 'Billing', 'Audit'],
};

const primaryRemain: Record<string, string[]> = {
  'Primary workspace sections__Enabled': ['Overview', 'Billing', 'Alerts'],
  'Primary workspace sections__Available': ['Audit', 'Notes'],
};

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

function ReadOnlyColumn({ title, items }: { title: string; items: DraggableItem[] }) {
  return (
    <div
      style={{
        flex: 1,
        border: '1px dashed #d9d9d9',
        borderRadius: 4,
        padding: 6,
        minHeight: 120,
        background: '#fafafa',
      }}
    >
      <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
        {title}
      </Text>
      <List
        size="small"
        dataSource={items}
        renderItem={(item) => (
          <List.Item key={item.id} style={{ fontSize: 12, padding: '4px 8px' }}>
            {item.label}
          </List.Item>
        )}
      />
    </div>
  );
}

function SecondaryDroppable({
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
        minHeight: 120,
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

export default function T18({ onSuccess }: TaskComponentProps) {
  const [draft, setDraft] = useState<SecState>(initialSecondaryDraft);
  const [committed, setCommitted] = useState<SecState>(initialSecondaryDraft);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: UniqueIdentifier): keyof SecState | undefined => {
    const sid = String(id);
    if (sid === `${PREFIX}-available`) return 'available';
    if (sid === `${PREFIX}-enabled`) return 'enabled';
    if (draft.available.some((i) => i.id === sid)) return 'available';
    if (draft.enabled.some((i) => i.id === sid)) return 'enabled';
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
      if (r === 'available' || r === 'enabled') oc = r;
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
    ? [...draft.available, ...draft.enabled].find((i) => i.id === activeId)
    : null;

  useEffect(() => {
    if (successFired.current) return;

    const primaryOk =
      checkExactOrder(
        {
          'Primary workspace sections__Enabled': primaryFrozen.enabled,
          'Primary workspace sections__Available': primaryFrozen.available,
        },
        primaryRemain
      );

    const secondaryOk = checkExactOrder(
      {
        'Available sections': committed.available,
        'Enabled sections': committed.enabled,
      },
      targetSecondary
    );

    if (primaryOk && secondaryOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const applySecondary = () => {
    setCommitted({
      available: draft.available.map((i) => ({ ...i })),
      enabled: draft.enabled.map((i) => ({ ...i })),
    });
  };

  return (
    <div style={{ padding: 12, maxWidth: 520 }} data-testid="dnd-instance-Secondary workspace sections">
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Card
          size="small"
          title="Primary workspace sections"
          data-testid="dnd-instance-Primary workspace sections"
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <ReadOnlyColumn title="Available sections" items={primaryFrozen.available} />
            <ReadOnlyColumn title="Enabled sections" items={primaryFrozen.enabled} />
          </div>
          <Button size="small" style={{ marginTop: 8 }} disabled>
            Apply primary sections
          </Button>
        </Card>

        <Card size="small" title="Secondary workspace sections">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryDroppable id={`${PREFIX}-available`} title="Available sections" items={draft.available} />
              <SecondaryDroppable id={`${PREFIX}-enabled`} title="Enabled sections" items={draft.enabled} />
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
          <Button
            type="primary"
            size="small"
            style={{ marginTop: 8, width: '100%' }}
            onClick={applySecondary}
            data-testid="apply-secondary-sections"
          >
            Apply secondary sections
          </Button>
        </Card>

        <input
          type="hidden"
          data-testid="secondary-committed-json"
          value={JSON.stringify({
            available: getItemLabels(committed.available),
            enabled: getItemLabels(committed.enabled),
          })}
        />
      </Space>
    </div>
  );
}
