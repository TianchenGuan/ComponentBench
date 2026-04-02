'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T02
 * Task Name: Reorder within a column (top position)
 *
 * Setup Description:
 * One Kanban board is displayed inside a Mantine Card. Columns are "To do",
 * "In progress", and "Done".
 * The To do column contains three cards:
 *   1) "PAY-2 Pay electricity bill"
 *   2) "SHOP-1 Buy groceries" (target)
 *   3) "MAIL-4 Return package"
 *
 * Success: In column "To do", SHOP-1 is the first card.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title } from '@mantine/core';
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
import { isCardAtIndex } from '../types';

const initialState: KanbanBoardState = {
  todo: [
    { id: 'card_pay_2', title: 'PAY-2 Pay electricity bill' },
    { id: 'card_shop_1', title: 'SHOP-1 Buy groceries' },
    { id: 'card_mail_4', title: 'MAIL-4 Return package' },
  ],
  in_progress: [{ id: 'card_task_1', title: 'TASK-1 Call bank' }],
  done: [{ id: 'card_task_2', title: 'TASK-2 File taxes' }],
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
      <Card shadow="xs" p="sm" mb="xs" style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text fw={500} size="sm">{card.title}</Text>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
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

export default function T02({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (isCardAtIndex(boardState, 'todo', 'card_shop_1', 0)) {
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
    <Paper shadow="sm" p="lg" style={{ width: 720 }} data-testid="kanban-board" data-board-id="primary">
      <Title order={4} mb="md">Task Board</Title>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box style={{ display: 'flex', gap: 12 }}>
          {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
        </Box>
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
