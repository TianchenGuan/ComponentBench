'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-v2-T33
 * AntD: Modal board move plus destination reorder and save
 *
 * Open Sprint Board modal. Move DEP-7 above REL-2 in Review, then Save board (modal closes).
 * success_trigger: adjacency card_dep_7 above card_rel_2 in review, saved, overlay_open false.
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
import { isCardDirectlyAbove, serializeBoardState } from '../../types';

const { Text } = Typography;

const INITIAL: KanbanBoardState = {
  backlog: [
    { id: 'card_dep_5', title: 'DEP-5 Configure staging' },
    { id: 'card_dep_6', title: 'DEP-6 Setup secrets' },
  ],
  todo: [
    { id: 'card_dep_7', title: 'DEP-7 Deploy to staging' },
    { id: 'card_dep_8', title: 'DEP-8 Run smoke tests' },
  ],
  review: [
    { id: 'card_rel_2', title: 'REL-2 Update docs' },
    { id: 'card_rel_3', title: 'REL-3 Publish notes' },
  ],
  done: [
    { id: 'card_dep_10', title: 'DEP-10 Notify team' },
  ],
};

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
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

export default function T33({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<KanbanBoardState>(() => structuredClone(INITIAL));
  const [committed, setCommitted] = useState<KanbanBoardState>(() => structuredClone(INITIAL));
  const successFired = useRef(false);

  const dirty = serializeBoardState(draft) !== serializeBoardState(committed);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (successFired.current) return;
    if (
      !open &&
      isCardDirectlyAbove(committed, 'review', 'card_dep_7', 'card_rel_2')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, committed, onSuccess]);

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

  const openModal = () => {
    setDraft(structuredClone(committed));
    setOpen(true);
  };

  const cancelDraft = () => {
    setDraft(structuredClone(committed));
  };

  const saveBoard = () => {
    setCommitted(structuredClone(draft));
    setOpen(false);
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
      <div style={{ padding: 8, maxWidth: 920 }}>
        <Card size="small" style={{ marginBottom: 10 }} bordered={false}>
          <Text strong>Release 42.3 summary</Text>
          <div style={{ marginTop: 6 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Staging freeze tonight · QA sign-off pending · Rollback plan attached
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
            Risk: dependency bumps in billing service · Owner: platform
          </Text>
        </Card>
        <Button type="primary" size="small" onClick={openModal} data-testid="open-sprint-board-btn">
          Open Sprint Board
        </Button>

        <Modal
          title="Sprint Board"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          width={780}
          destroyOnClose={false}
          data-testid="sprint-board-modal"
        >
          {dirty ? (
            <Alert type="warning" showIcon style={{ marginBottom: 8 }} message="Unsaved board changes" />
          ) : null}
          <div
            data-testid="kanban-board"
            data-board-id="sprint_board_modal"
            data-instance-label="Sprint Board (modal)"
          >
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {COLUMNS.map((col) => (
                <KanbanColumn key={col.id} column={col} cards={draft[col.id] || []} />
              ))}
            </div>
          </div>
          {dirty ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <Button onClick={cancelDraft}>Cancel</Button>
              <Button type="primary" onClick={saveBoard} data-testid="save-board">
                Save board
              </Button>
            </div>
          ) : null}
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
