'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T10
 * Task Name: Find an off-screen column and move a card
 *
 * Setup Description:
 * The Kanban board is placed in the BOTTOM-RIGHT area of the viewport inside an
 * Ant Design Card titled "Operations Queue".
 *
 * The board has five columns: "Backlog", "To do", "In progress", "Review", "Blocked".
 * Because the board is wider than the container, the board region scrolls horizontally.
 *
 * Initial state: the card "OPS-33 Investigate outage" is in the far-right "Blocked" column,
 * which may be off-screen initially.
 *
 * Success: Card OPS-33 is in "Backlog" column.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: BOTTOM_RIGHT
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography } from 'antd';
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
import type { TaskComponentProps, KanbanCard, KanbanBoardState } from '../types';
import { isCardInColumn } from '../types';

const { Text } = Typography;

const initialState: KanbanBoardState = {
  backlog: [
    { id: 'card_ops_30', title: 'OPS-30 Setup monitoring' },
  ],
  todo: [
    { id: 'card_ops_31', title: 'OPS-31 Configure alerts' },
  ],
  in_progress: [
    { id: 'card_ops_32', title: 'OPS-32 Deploy hotfix' },
  ],
  review: [
    { id: 'card_ops_34', title: 'OPS-34 Check metrics' },
    { id: 'card_ops_35', title: 'OPS-35 Update runbook' },
  ],
  blocked: [
    { id: 'card_ops_33', title: 'OPS-33 Investigate outage' },
    { id: 'card_ops_36', title: 'OPS-36 Waiting on vendor' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
  { id: 'blocked', title: 'Blocked' },
];

function SortableCard({ card }: { card: KanbanCard }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

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
          marginBottom: 8,
          cursor: 'grab',
          border: '1px solid #f0f0f0',
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <Text strong style={{ fontSize: 13 }}>{card.title}</Text>
      </Card>
    </div>
  );
}

function KanbanColumn({
  column,
  cards,
}: {
  column: { id: string; title: string };
  cards: KanbanCard[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: '0 0 180px',
        padding: 12,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 8,
        border: `1px solid ${isOver ? '#1890ff' : '#e8e8e8'}`,
        transition: 'all 0.2s',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 100 }}>
          {cards.map(card => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: OPS-33 in "Backlog"
  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState, 'card_ops_33', 'backlog')) {
      successFired.current = true;
      onSuccess();
    }
  }, [boardState, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (columns.some(c => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(boardState)) {
      if (cards.some(card => card.id === id)) return columnId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setBoardState(prev => {
      const activeCards = [...prev[activeContainer]];
      const overCards = [...prev[overContainer]];
      const activeIndex = activeCards.findIndex(card => card.id === active.id);
      const activeCard = activeCards[activeIndex];

      activeCards.splice(activeIndex, 1);

      const overIndex = overCards.findIndex(card => card.id === over.id);
      if (overIndex === -1) {
        overCards.push(activeCard);
      } else {
        overCards.splice(overIndex, 0, activeCard);
      }

      return {
        ...prev,
        [activeContainer]: activeCards,
        [overContainer]: overCards,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const cards = boardState[activeContainer];
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);

      if (oldIndex !== newIndex) {
        setBoardState(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeCard = activeId
    ? Object.values(boardState).flat().find(card => card.id === activeId)
    : null;

  return (
    <div>
      {/* Legend (distractor) */}
      <div
        style={{
          background: '#f9f9f9',
          border: '1px solid #e8e8e8',
          borderRadius: 6,
          padding: '8px 12px',
          marginBottom: 12,
          fontSize: 11,
        }}
      >
        <Text type="secondary">Legend: Blocked = awaiting external dependency</Text>
      </div>

      <Card
        title="Operations Queue"
        style={{ width: 600 }}
        bodyStyle={{ padding: 12 }}
        data-testid="kanban-board"
        data-board-id="operations_queue"
      >
        <div
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: 8,
          }}
          data-testid="scroll-container"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: 'flex', gap: 12, width: 'max-content' }}>
              {columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={boardState[column.id] || []}
                />
              ))}
            </div>

            <DragOverlay>
              {activeCard ? (
                <Card
                  size="small"
                  style={{
                    cursor: 'grabbing',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid #1890ff',
                  }}
                >
                  <Text strong style={{ fontSize: 13 }}>{activeCard.title}</Text>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </Card>
    </div>
  );
}
