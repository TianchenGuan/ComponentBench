'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T05
 * Task Name: Open a modal and move a card inside the modal board
 *
 * Setup Description:
 * The page contains a primary Mantine Button labeled "Open Project board".
 * Clicking it opens a panel titled "Project board".
 * The Kanban board is inside the panel.
 *
 * Initial state: "PROJ-2 Draft proposal" is in "In progress" column.
 *
 * Success: Within the panel Kanban instance, PROJ-2 is in "Review" column.
 * Theme: light, Spacing: comfortable, Layout: modal_flow, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, Button, Group, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
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
  todo: [{ id: 'card_proj_1', title: 'PROJ-1 Research' }],
  in_progress: [
    { id: 'card_proj_2', title: 'PROJ-2 Draft proposal' },
    { id: 'card_proj_3', title: 'PROJ-3 Design mockups' },
  ],
  review: [{ id: 'card_proj_4', title: 'PROJ-4 Budget review' }],
  done: [{ id: 'card_proj_5', title: 'PROJ-5 Kickoff meeting' }],
};

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
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

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 140,
        padding: 8,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb="sm">{column.title}</Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 80 }}>
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState, 'card_proj_2', 'review')) {
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
      if (activeIndex === -1) return prev;
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
    <Box style={{ width: 700 }}>
      {!panelOpen ? (
        <Paper shadow="xs" p="xl" style={{ width: 400, textAlign: 'center' }}>
          <Title order={4} mb="md">Project Dashboard</Title>
          <Text size="sm" c="dimmed" mb="lg">Click the button to manage project tasks</Text>
          <Button onClick={() => setPanelOpen(true)} data-testid="open-project-board-btn">
            Open Project board
          </Button>
        </Paper>
      ) : (
        <Paper
          shadow="xl"
          p="md"
          radius="md"
          style={{ width: 680, backgroundColor: '#fff' }}
          data-testid="project-board-modal"
        >
          <Group justify="space-between" mb="md">
            <Text fw={600} size="lg">Project board</Text>
            <ActionIcon variant="subtle" onClick={() => setPanelOpen(false)}>
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <Box data-testid="kanban-board" data-board-id="project_board_modal">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <Box style={{ display: 'flex', gap: 8 }}>
                {columns.map(column => (
                  <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />
                ))}
              </Box>
              <DragOverlay>
                {activeCard ? (
                  <Card shadow="md" p="xs" style={{ cursor: 'grabbing', border: '1px solid #228be6' }}>
                    <Text size="sm">{activeCard.title}</Text>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
