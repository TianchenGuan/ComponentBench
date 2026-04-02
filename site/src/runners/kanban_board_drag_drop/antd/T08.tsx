'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T08
 * Task Name: Precise reorder with small cards in compact mode
 *
 * Setup Description:
 * The board is rendered in compact spacing with small-scale cards. The Kanban is inside
 * a centered card titled "UI Bug Triage".
 * Columns are "To do", "In progress", "Review", "Done". The "In progress" column contains
 * seven cards with similar "BUG-###" prefixes.
 *
 * Drag affordance: cards are draggable ONLY by a small "grip" (⋮⋮) drag handle icon
 * on the left edge. The rest of the card is clickable but not draggable.
 *
 * Initial state: "BUG-210 Fix footer overflow" is in "In progress" but not in correct position.
 *
 * Success: BUG-210 is between BUG-205 and BUG-212 (in that order: 205, 210, 212).
 * Theme: light, Spacing: COMPACT, Layout: isolated_card, Placement: center, Scale: SMALL
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography } from 'antd';
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
import { isCardBetween } from '../types';

const { Text } = Typography;

const initialState: KanbanBoardState = {
  todo: [
    { id: 'card_bug_201', title: 'BUG-201 Fix header' },
  ],
  in_progress: [
    { id: 'card_bug_202', title: 'BUG-202 Fix sidebar' },
    { id: 'card_bug_205', title: 'BUG-205 Fix navbar' },
    { id: 'card_bug_208', title: 'BUG-208 Fix modal' },
    { id: 'card_bug_212', title: 'BUG-212 Fix dropdown' },
    { id: 'card_bug_210', title: 'BUG-210 Fix footer overflow' },
    { id: 'card_bug_215', title: 'BUG-215 Fix tooltip' },
    { id: 'card_bug_218', title: 'BUG-218 Fix scroll' },
  ],
  review: [
    { id: 'card_bug_220', title: 'BUG-220 Fix animation' },
  ],
  done: [
    { id: 'card_bug_199', title: 'BUG-199 Fix button' },
  ],
};

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
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
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 6px',
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 4,
          marginBottom: 4,
          fontSize: 11,
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        {/* Drag handle only */}
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            color: '#999',
            fontSize: 10,
            padding: '2px 2px',
            display: 'flex',
            alignItems: 'center',
          }}
          data-testid={`handle-${card.id}`}
        >
          <HolderOutlined />
        </span>
        <Text
          style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {card.title}
        </Text>
      </div>
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
        flex: 1,
        minWidth: 130,
        padding: 6,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 4,
        border: `1px solid ${isOver ? '#1890ff' : '#e8e8e8'}`,
        transition: 'all 0.2s',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 60 }}>
          {cards.map(card => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: BUG-210 is between BUG-205 (above) and BUG-212 (below)
  useEffect(() => {
    if (successFired.current) return;
    if (isCardBetween(boardState, 'in_progress', 'card_bug_210', 'card_bug_205', 'card_bug_212')) {
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
    <Card
      title="UI Bug Triage"
      size="small"
      style={{ width: 620 }}
      bodyStyle={{ padding: 8 }}
      data-testid="kanban-board"
      data-board-id="ui_bug_triage"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 6 }}>
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
            <div
              style={{
                padding: '4px 6px',
                background: '#fff',
                border: '1px solid #1890ff',
                borderRadius: 4,
                fontSize: 11,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <HolderOutlined style={{ color: '#999', fontSize: 10 }} />
              <Text style={{ fontSize: 11 }}>{activeCard.title}</Text>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
