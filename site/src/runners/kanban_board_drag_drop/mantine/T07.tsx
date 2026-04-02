'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T07
 * Task Name: Dense reorder in dark theme
 *
 * Setup Description:
 * The page is in DARK theme. The Kanban board is inside a Mantine Paper titled
 * "Release follow-ups". Columns are "To do", "In progress", "Review", "Done".
 * The Done column contains many release-related cards (~9).
 *
 * Each card includes a small ActionIcon "grip" handle; dragging is enabled ONLY
 * via this handle (not the full card body).
 *
 * Success: In column "Done", REL-12 appears immediately above REL-13 (adjacent).
 * Theme: DARK, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, ActionIcon, MantineProvider } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
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
import { isCardDirectlyAbove } from '../types';

const initialState: KanbanBoardState = {
  todo: [{ id: 'card_rel_10', title: 'REL-10 Draft notes' }],
  in_progress: [{ id: 'card_rel_11', title: 'REL-11 Update version' }],
  review: [{ id: 'card_rel_14', title: 'REL-14 Review changelog' }],
  done: [
    { id: 'card_rel_15', title: 'REL-15 Cut branch' },
    { id: 'card_rel_16', title: 'REL-16 Build artifacts' },
    { id: 'card_rel_12', title: 'REL-12 Ship hotfix' },
    { id: 'card_rel_17', title: 'REL-17 Deploy docs' },
    { id: 'card_rel_18', title: 'REL-18 Notify users' },
    { id: 'card_rel_13', title: 'REL-13 Write postmortem' },
    { id: 'card_rel_19', title: 'REL-19 Archive release' },
    { id: 'card_rel_20', title: 'REL-20 Update roadmap' },
    { id: 'card_rel_21', title: 'REL-21 Sprint retro' },
  ],
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
    <div ref={setNodeRef} style={style}>
      <Card p="xs" mb={4} style={{ display: 'flex', alignItems: 'center', gap: 4 }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <ActionIcon variant="subtle" size="xs" style={{ cursor: 'grab' }} {...attributes} {...listeners} data-testid={`handle-${card.id}`}>
          <IconGripVertical size={14} />
        </ActionIcon>
        <Text size="xs">{card.title}</Text>
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
        minWidth: 150,
        padding: 8,
        background: isOver ? '#1e3a5f' : '#25262b',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#228be6' : '#373a40'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb="sm" c="dimmed">{column.title}</Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 60 }}>
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Check success: REL-12 is directly above REL-13 in Done
  useEffect(() => {
    if (successFired.current) return;
    if (isCardDirectlyAbove(boardState, 'done', 'card_rel_12', 'card_rel_13')) {
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
    <MantineProvider forceColorScheme="dark">
      <Paper shadow="sm" p="md" style={{ width: 700, background: '#1a1b1e' }} data-testid="kanban-board" data-board-id="release_follow_ups">
        <Title order={5} mb="md" c="white">Release follow-ups</Title>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <Box style={{ display: 'flex', gap: 8 }}>
            {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
          </Box>
          <DragOverlay>
            {activeCard ? (
              <Card p="xs" style={{ cursor: 'grabbing', border: '1px solid #228be6', display: 'flex', alignItems: 'center', gap: 4 }}>
                <IconGripVertical size={14} />
                <Text size="xs">{activeCard.title}</Text>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Paper>
    </MantineProvider>
  );
}
