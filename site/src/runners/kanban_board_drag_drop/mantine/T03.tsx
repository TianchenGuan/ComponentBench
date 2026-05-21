'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T03
 * Task Name: Restore the default board layout
 *
 * Setup Description:
 * The page shows a Kanban board inside a Mantine Paper titled "Household board".
 * The board is currently in a non-default state.
 * In the board header: "Restore defaults" button and "About" link (distractor).
 *
 * Clicking "Restore defaults" resets the board and shows a Mantine notification.
 *
 * Success: Board equals default snapshot "mantine_default_state_v1"
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, Button, Group, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
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
import { boardStatesEqual } from '../types';

// Default (target) state
const defaultState: KanbanBoardState = {
  todo: [
    { id: 'card_clean_1', title: 'CLEAN-1 Vacuum' },
    { id: 'card_clean_2', title: 'CLEAN-2 Dishes' },
  ],
  in_progress: [{ id: 'card_clean_3', title: 'CLEAN-3 Laundry' }],
  done: [{ id: 'card_clean_4', title: 'CLEAN-4 Trash' }],
};

// Modified initial state
const initialState: KanbanBoardState = {
  todo: [{ id: 'card_clean_4', title: 'CLEAN-4 Trash' }],
  in_progress: [
    { id: 'card_clean_1', title: 'CLEAN-1 Vacuum' },
    { id: 'card_clean_2', title: 'CLEAN-2 Dishes' },
  ],
  done: [{ id: 'card_clean_3', title: 'CLEAN-3 Laundry' }],
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

export default function T03({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (boardStatesEqual(boardState, defaultState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [boardState, onSuccess]);

  const handleReset = () => {
    setBoardState(JSON.parse(JSON.stringify(defaultState)));
    notifications.show({ message: 'Defaults restored', color: 'green' });
  };

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
    <Paper shadow="sm" p="lg" style={{ width: 720 }} data-testid="kanban-board" data-board-id="household_board">
      <Group justify="space-between" mb="md">
        <Title order={4}>Household board</Title>
        <Group gap="sm">
          <Button onClick={handleReset} data-testid="restore-defaults-btn">Restore defaults</Button>
          <Anchor size="sm">About</Anchor>
        </Group>
      </Group>

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
