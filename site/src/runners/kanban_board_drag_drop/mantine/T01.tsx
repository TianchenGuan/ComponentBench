'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T01
 * Task Name: Move a card to Done
 *
 * Setup Description:
 * The page shows one centered Mantine Paper titled "Personal Tasks". Inside is a
 * Kanban board with columns "To do", "In progress", and "Done".
 *
 * Each task card is a Mantine Card with a small Badge (category) and a bold title
 * that includes an ID like "HOME-3".
 *
 * Initial state: "HOME-3 Call plumber" is in "In progress" column.
 *
 * Success: Card HOME-3 is in "Done" column.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Badge, Group, Box, Title } from '@mantine/core';
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

interface ExtendedKanbanCard extends KanbanCard {
  category?: string;
}

const initialState: Record<string, ExtendedKanbanCard[]> = {
  todo: [
    { id: 'card_home_1', title: 'HOME-1 Buy groceries', category: 'Shopping' },
    { id: 'card_home_2', title: 'HOME-2 Pay bills', category: 'Finance' },
  ],
  in_progress: [
    { id: 'card_home_3', title: 'HOME-3 Call plumber', category: 'Home' },
  ],
  done: [
    { id: 'card_home_4', title: 'HOME-4 Book flight', category: 'Travel' },
  ],
};

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card }: { card: ExtendedKanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card shadow="xs" p="sm" mb="xs" style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Group gap="xs" mb={4}>
          {card.category && <Badge size="xs" variant="light">{card.category}</Badge>}
        </Group>
        <Text fw={500} size="sm">{card.title}</Text>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: ExtendedKanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

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
        transition: 'all 0.2s',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="sm" mb="md">{column.title}</Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 100 }}>
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<Record<string, ExtendedKanbanCard[]>>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState as KanbanBoardState, 'card_home_3', 'done')) {
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
    <Paper shadow="sm" p="lg" style={{ width: 720 }} data-testid="kanban-board" data-board-id="personal_tasks">
      <Title order={4} mb="md">Personal Tasks</Title>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Group gap="md" align="stretch">
          {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
        </Group>
        <DragOverlay>
          {activeCard ? (
            <Card shadow="md" p="sm" style={{ cursor: 'grabbing', border: '1px solid #228be6' }}>
              <Text fw={500} size="sm">{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
