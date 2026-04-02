'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-v2-T37
 * AntD: Discard a real kanban draft from the release modal
 *
 * Open Release board, drag REL-4 to In progress (dirty), close modal, confirm Discard changes.
 * success_trigger: card_rel_4 in backlog, discarded via confirm, overlay_open false.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Typography, Button, Modal, Alert } from 'antd';
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
import { isCardInColumn, serializeBoardState } from '../../types';

const { Text } = Typography;

/** Committed baseline (never persisted to a Save control in this task). */
const INITIAL: KanbanBoardState = {
  backlog: [
    { id: 'card_rel_4', title: 'REL-4 Update changelog' },
    { id: 'card_rel_1', title: 'REL-1 Version bump' },
    { id: 'card_rel_2', title: 'REL-2 Branch cut' },
  ],
  todo: [{ id: 'card_rel_5', title: 'REL-5 QA checklist' }],
  in_progress: [
    { id: 'card_rel_3', title: 'REL-3 Build artifacts' },
    { id: 'card_rel_6', title: 'REL-6 Staging deploy' },
  ],
  done: [{ id: 'card_rel_7', title: 'REL-7 Tag release' }],
};

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
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
        style={{
          marginBottom: 6,
          cursor: isDragging ? 'grabbing' : 'grab',
          border: '1px solid #f0f0f0',
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
        bodyStyle={{ padding: 8 }}
      >
        <Text strong style={{ fontSize: 12 }}>
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
        flex: '0 0 150px',
        minWidth: 150,
        padding: 8,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#1890ff' : '#e8e8e8'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 72 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function T37({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<KanbanBoardState>(() => structuredClone(INITIAL));
  const discardedAfterDirtyRef = useRef(false);
  const successFired = useRef(false);

  const dirty = serializeBoardState(draft) !== serializeBoardState(INITIAL);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (successFired.current) return;
    if (
      !open &&
      discardedAfterDirtyRef.current &&
      isCardInColumn(draft, 'card_rel_4', 'backlog')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, draft, onSuccess]);

  const findContainer = useCallback(
    (id: string, state: KanbanBoardState): string | undefined => {
      if (COLUMNS.some((c) => c.id === id)) return id;
      for (const [columnId, cards] of Object.entries(state)) {
        if (cards.some((card) => card.id === id)) return columnId;
      }
      return undefined;
    },
    [],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    setDraft((prev) => {
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    setDraft((prev) => {
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
  };

  const tryCloseModal = () => {
    if (!dirty) {
      setOpen(false);
      return;
    }
    Modal.confirm({
      title: 'Unsaved changes',
      content: 'You have unsaved changes on the release board.',
      okText: 'Discard changes',
      cancelText: 'Keep editing',
      okButtonProps: { 'data-testid': 'discard-changes' } as { 'data-testid': string },
      onOk: () => {
        setDraft(structuredClone(INITIAL));
        discardedAfterDirtyRef.current = true;
        setOpen(false);
      },
    });
  };

  let activeCard: KanbanCard | null = null;
  if (activeId) {
    for (const col of COLUMNS) {
      const found = (draft[col.id] || []).find((c) => c.id === activeId);
      if (found) {
        activeCard = found;
        break;
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ padding: 8, maxWidth: 900 }}>
        <Card size="small" style={{ marginBottom: 10 }} bordered={false}>
          <Text strong>Release checklist</Text>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 6 }}>
            Train deployment · comms draft · rollback owner assigned
          </Text>
        </Card>
        <Button type="primary" size="small" onClick={() => setOpen(true)} data-testid="open-release-board-btn">
          Open release board
        </Button>

        <Modal
          title="Release board"
          open={open}
          onCancel={tryCloseModal}
          footer={null}
          width={780}
          destroyOnClose={false}
          data-testid="release-board-modal"
          maskClosable={false}
        >
          {dirty ? (
            <Alert type="warning" showIcon style={{ marginBottom: 8 }} message="Unsaved changes" />
          ) : null}
          <div
            data-testid="kanban-board"
            data-board-id="release_board_modal"
            data-instance-label="Release board (modal)"
          >
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {COLUMNS.map((col) => (
                <KanbanColumn key={col.id} column={col} cards={draft[col.id] || []} />
              ))}
            </div>
          </div>
        </Modal>
      </div>

      <DragOverlay>
        {activeCard ? (
          <Card size="small" style={{ cursor: 'grabbing', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <Text strong style={{ fontSize: 12 }}>
              {activeCard.title}
            </Text>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
