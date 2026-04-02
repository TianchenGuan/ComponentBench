'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T06
 * Task Name: Scroll within a column to locate a card, then move it
 *
 * Setup Description:
 * The board appears inside a centered Mantine Card titled "Sprint queue".
 * Columns are "To do", "In progress", and "Done".
 * The To do column contains many cards and is rendered inside a Mantine ScrollArea.
 *
 * Initial state: "BUG-9 Fix notifications" is in To do near the bottom.
 *
 * Success: Card BUG-9 is in "In progress" column.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, ScrollArea } from '@mantine/core';
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

const initialState: KanbanBoardState = {
  todo: [
    { id: 'card_bug_1', title: 'BUG-1 Fix login' },
    { id: 'card_bug_2', title: 'BUG-2 Fix signup' },
    { id: 'card_bug_3', title: 'BUG-3 Fix logout' },
    { id: 'card_bug_4', title: 'BUG-4 Fix password' },
    { id: 'card_bug_5', title: 'BUG-5 Fix email' },
    { id: 'card_bug_6', title: 'BUG-6 Fix profile' },
    { id: 'card_bug_7', title: 'BUG-7 Fix settings' },
    { id: 'card_bug_8', title: 'BUG-8 Fix dashboard' },
    { id: 'card_bug_9', title: 'BUG-9 Fix notifications' },
    { id: 'card_bug_10', title: 'BUG-10 Fix search' },
  ],
  in_progress: [{ id: 'card_bug_11', title: 'BUG-11 Fix filter' }],
  done: [{ id: 'card_bug_12', title: 'BUG-12 Fix sort' }],
};

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card shadow="xs" p="xs" mb="xs" style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text size="sm">{card.title}</Text>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards, scrollable }: { column: { id: string; title: string }; cards: KanbanCard[]; scrollable?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const content = (
    <Box style={{ minHeight: 100 }}>
      {cards.map(card => <SortableCard key={card.id} card={card} />)}
    </Box>
  );

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 200,
        padding: 12,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 8,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="sm" mb="md">{column.title}</Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {scrollable ? (
          <ScrollArea h={200} data-testid="scroll-area">
            {content}
          </ScrollArea>
        ) : content}
      </SortableContext>
    </Box>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState, 'card_bug_9', 'in_progress')) {
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

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

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
      if (overIndex === -1) overCards.push(activeCard);
      else overCards.splice(overIndex, 0, activeCard);
      return { ...prev, [activeContainer]: activeCards, [overContainer]: overCards };
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
        setBoardState(prev => ({ ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) }));
      }
    }
  };

  const activeCard = activeId ? Object.values(boardState).flat().find(card => card.id === activeId) : null;

  return (
    <Paper shadow="sm" p="lg" style={{ width: 720 }} data-testid="kanban-board" data-board-id="sprint_queue">
      <Title order={4} mb="md">Sprint queue</Title>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box style={{ display: 'flex', gap: 12 }}>
          <KanbanColumn column={columns[0]} cards={boardState.todo || []} scrollable />
          <KanbanColumn column={columns[1]} cards={boardState.in_progress || []} />
          <KanbanColumn column={columns[2]} cards={boardState.done || []} />
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card shadow="md" p="xs" style={{ cursor: 'grabbing', border: '1px solid #228be6' }}>
              <Text size="sm">{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
