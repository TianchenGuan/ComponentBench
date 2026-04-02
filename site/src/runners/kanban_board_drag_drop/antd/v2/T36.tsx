'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-v2-T36
 * AntD: Gateway row board only with row save
 *
 * Table-style rows: Gateway and Billing mini-kanban. Move GW-7 to top of Review on Gateway row;
 * save via save-gateway-row. Billing card_bill_5 stays in Review on committed state.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Typography, Button, Table, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
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
import type { TaskComponentProps, KanbanCard, KanbanBoardState } from '../../types';
import { isCardAtIndex, isCardInColumn, serializeBoardState } from '../../types';

const { Text } = Typography;

const G_INITIAL: KanbanBoardState = {
  todo: [
    { id: 'card_gw_7', title: 'GW-7 Rotate cert' },
    { id: 'card_gw_8', title: 'GW-8 TLS probe' },
  ],
  review: [
    { id: 'card_gw_9', title: 'GW-9 Rate limits' },
    { id: 'card_gw_10', title: 'GW-10 WAF rules' },
  ],
  done: [{ id: 'card_gw_11', title: 'GW-11 Health checks' }],
};

const B_INITIAL: KanbanBoardState = {
  todo: [
    { id: 'card_bill_1', title: 'BIL-1 Invoice PDF' },
    { id: 'card_bill_2', title: 'BIL-2 Dunning' },
  ],
  review: [
    { id: 'card_bill_5', title: 'BIL-5 Tax report' },
    { id: 'card_bill_6', title: 'BIL-6 Proration' },
  ],
  done: [{ id: 'card_bill_7', title: 'BIL-7 Ledger sync' }],
};

const MINI_COLS = [
  { id: 'todo', title: 'To do' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
] as const;

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        style={{ marginBottom: 4, cursor: 'grab', border: '1px solid #f0f0f0' }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
        bodyStyle={{ padding: 6 }}
      >
        <Text strong style={{ fontSize: 11 }}>
          {card.title}
        </Text>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        flex: '0 0 108px',
        minWidth: 108,
        padding: 4,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 4,
        border: `1px solid ${isOver ? '#1890ff' : '#e8e8e8'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 10 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 48 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function RowMiniBoard({
  dndId,
  title,
  boardKey,
  state,
  sensors,
  onDragStart,
  onDragOver,
  onDragEnd,
  activeId,
}: {
  dndId: string;
  title: string;
  boardKey: string;
  state: KanbanBoardState;
  sensors: ReturnType<typeof useSensors>;
  onDragStart: (e: DragStartEvent) => void;
  onDragOver: (e: DragOverEvent) => void;
  onDragEnd: (e: DragEndEvent) => void;
  activeId: string | null;
}) {
  const activeCard = activeId ? Object.values(state).flat().find((c) => c.id === activeId) : null;
  return (
    <div
      data-testid={`kanban-board-${boardKey}`}
      data-board-id={boardKey}
      data-instance-label={title}
    >
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {MINI_COLS.map((col) => (
            <KanbanColumn key={`${dndId}-${col.id}`} column={col} cards={state[col.id] || []} />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <Card size="small" bodyStyle={{ padding: 6 }}>
              <Text strong style={{ fontSize: 11 }}>
                {activeCard.title}
              </Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

type RowKey = 'gateway' | 'billing';

export default function T36({ onSuccess }: TaskComponentProps) {
  const [gDraft, setGDraft] = useState<KanbanBoardState>(() => structuredClone(G_INITIAL));
  const [bDraft, setBDraft] = useState<KanbanBoardState>(() => structuredClone(B_INITIAL));
  const [gCommitted, setGCommitted] = useState<KanbanBoardState>(() => structuredClone(G_INITIAL));
  const [bCommitted, setBCommitted] = useState<KanbanBoardState>(() => structuredClone(B_INITIAL));
  const [gActiveId, setGActiveId] = useState<string | null>(null);
  const [bActiveId, setBActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const gDirty = serializeBoardState(gDraft) !== serializeBoardState(gCommitted);
  const bDirty = serializeBoardState(bDraft) !== serializeBoardState(bCommitted);

  useEffect(() => {
    if (successFired.current) return;
    if (
      isCardAtIndex(gCommitted, 'review', 'card_gw_7', 0) &&
      isCardInColumn(bCommitted, 'card_bill_5', 'review')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [gCommitted, bCommitted, onSuccess]);

  const findContainer = useCallback((id: string, state: KanbanBoardState): string | undefined => {
    if (MINI_COLS.some((c) => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(state)) {
      if (cards.some((card) => card.id === id)) return columnId;
    }
    return undefined;
  }, []);

  const makeHandlers = (
    setState: React.Dispatch<React.SetStateAction<KanbanBoardState>>,
    setActive: React.Dispatch<React.SetStateAction<string | null>>,
  ) => ({
    onDragStart: (e: DragStartEvent) => setActive(e.active.id as string),
    onDragOver: (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;
      setState((prev) => {
        const activeContainer = findContainer(active.id as string, prev);
        const overContainer = findContainer(over.id as string, prev) || (over.id as string);
        if (!activeContainer || !overContainer || activeContainer === overContainer) return prev;
        const activeCards = [...prev[activeContainer]];
        const overCards = [...prev[overContainer]];
        const activeIndex = activeCards.findIndex((card) => card.id === active.id);
        const activeCard = activeCards[activeIndex];
        activeCards.splice(activeIndex, 1);
        const overIndex = overCards.findIndex((card) => card.id === over.id);
        if (overIndex === -1) overCards.push(activeCard);
        else overCards.splice(overIndex, 0, activeCard);
        return { ...prev, [activeContainer]: activeCards, [overContainer]: overCards };
      });
    },
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      setActive(null);
      if (!over) return;
      setState((prev) => {
        const activeContainer = findContainer(active.id as string, prev);
        const overContainer = findContainer(over.id as string, prev);
        if (!activeContainer || !overContainer) return prev;
        if (activeContainer === overContainer) {
          const cards = prev[activeContainer];
          const oldIndex = cards.findIndex((card) => card.id === active.id);
          const newIndex = cards.findIndex((card) => card.id === over.id);
          if (oldIndex !== newIndex) {
            return { ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) };
          }
        }
        return prev;
      });
    },
  });

  const gh = makeHandlers(setGDraft, setGActiveId);
  const bh = makeHandlers(setBDraft, setBActiveId);

  type RowRecord = { key: RowKey; name: string };

  const columns: ColumnsType<RowRecord> = [
    {
      title: 'Service',
      dataIndex: 'name',
      width: 100,
      render: (name: string) => <Text strong style={{ fontSize: 12 }}>{name}</Text>,
    },
    {
      title: 'Sprint slice',
      key: 'board',
      render: (_, record) =>
        record.key === 'gateway' ? (
          <RowMiniBoard
            dndId="row-gateway"
            title="Gateway"
            boardKey="gateway"
            state={gDraft}
            sensors={sensors}
            onDragStart={gh.onDragStart}
            onDragOver={gh.onDragOver}
            onDragEnd={gh.onDragEnd}
            activeId={gActiveId}
          />
        ) : (
          <RowMiniBoard
            dndId="row-billing"
            title="Billing"
            boardKey="billing"
            state={bDraft}
            sensors={sensors}
            onDragStart={bh.onDragStart}
            onDragOver={bh.onDragOver}
            onDragEnd={bh.onDragEnd}
            activeId={bActiveId}
          />
        ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'right',
      render: (_, record) =>
        record.key === 'gateway' ? (
          <Button
            type="primary"
            size="small"
            disabled={!gDirty}
            onClick={() => setGCommitted(structuredClone(gDraft))}
            data-testid="save-gateway-row"
          >
            Save
          </Button>
        ) : (
          <Button size="small" disabled={!bDirty} onClick={() => setBCommitted(structuredClone(bDraft))}>
            Save
          </Button>
        ),
    },
  ];

  const data: RowRecord[] = [
    { key: 'gateway', name: 'Gateway' },
    { key: 'billing', name: 'Billing' },
  ];

  return (
    <div style={{ padding: 8, maxWidth: 820 }}>
      <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
        Service table
      </Text>
      {(gDirty || bDirty) && (
        <Alert type="info" showIcon style={{ marginBottom: 8, fontSize: 12 }} message="Row boards have local drafts" />
      )}
      <Table<RowRecord>
        size="small"
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey="key"
        bordered
      />
    </div>
  );
}
