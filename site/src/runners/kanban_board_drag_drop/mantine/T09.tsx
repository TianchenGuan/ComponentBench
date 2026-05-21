'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T09
 * Task Name: Visual reference matching with non-center placement
 *
 * Setup Description:
 * The Kanban board is placed near the TOP-RIGHT of the viewport inside a Mantine
 * Card titled "Sprint board".
 * A visual reference preview is shown above the board.
 *
 * Four highlighted cards must be arranged:
 *   - "FEAT-4 Add dark mode" → "In progress"
 *   - "BUG-88 Fix sync issue" → "Done"
 *   - "CHORE-1 Update dependencies" → first in "To do"
 *   - "DOC-6 Write release notes" → second in "To do"
 *
 * Success: All four conditions met.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: TOP_RIGHT
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, Divider } from '@mantine/core';
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
import { isCardInColumn, isCardAtIndex } from '../types';

const HIGHLIGHTED_CARDS = ['card_feat_4', 'card_bug_88', 'card_chore_1', 'card_doc_6'];

const initialState: KanbanBoardState = {
  backlog: [{ id: 'card_feat_5', title: 'FEAT-5 Add export' }],
  todo: [
    { id: 'card_feat_4', title: 'FEAT-4 Add dark mode' }, // Should go to in_progress
    { id: 'card_bug_88', title: 'BUG-88 Fix sync issue' }, // Should go to done
    { id: 'card_doc_6', title: 'DOC-6 Write release notes' }, // Should be 2nd in todo
    { id: 'card_chore_1', title: 'CHORE-1 Update dependencies' }, // Should be 1st in todo
  ],
  in_progress: [{ id: 'card_feat_6', title: 'FEAT-6 Add search' }],
  done: [{ id: 'card_bug_87', title: 'BUG-87 Fix login' }],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card, highlighted }: { card: KanbanCard; highlighted: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        shadow="xs"
        p="xs"
        mb="xs"
        style={{
          cursor: 'grab',
          border: highlighted ? '2px solid #fd7e14' : '1px solid #dee2e6',
          background: highlighted ? '#fff4e6' : undefined,
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
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
        minWidth: 150,
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
          {cards.map(card => (
            <SortableCard key={card.id} card={card} highlighted={HIGHLIGHTED_CARDS.includes(card.id)} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Check success:
  // - FEAT-4 in "In progress"
  // - BUG-88 in "Done"
  // - CHORE-1 is first in "To do"
  // - DOC-6 is second in "To do"
  useEffect(() => {
    if (successFired.current) return;
    const feat4Ok = isCardInColumn(boardState, 'card_feat_4', 'in_progress');
    const bug88Ok = isCardInColumn(boardState, 'card_bug_88', 'done');
    const chore1First = isCardAtIndex(boardState, 'todo', 'card_chore_1', 0);
    const doc6Second = isCardAtIndex(boardState, 'todo', 'card_doc_6', 1);
    if (feat4Ok && bug88Ok && chore1First && doc6Second) {
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
    <Paper shadow="sm" p="lg" style={{ width: 750 }} data-testid="kanban-board" data-board-id="sprint_board">
      <Title order={4} mb="sm">Sprint board</Title>

      {/* Reference preview */}
      <Box
        style={{ background: '#e7f5ff', border: '1px solid #74c0fc', borderRadius: 8, padding: 12, marginBottom: 16 }}
        data-testid="reference-miniboard"
        data-ref-id="ref_miniboard_mantine_v1"
      >
        <Text fw={600} size="xs" mb="xs">Reference — Match highlighted cards:</Text>
        <Box style={{ display: 'flex', gap: 16, fontSize: 11 }}>
          <Box>
            <Text size="xs" c="dimmed">In progress:</Text>
            <Box style={{ padding: '4px 8px', background: '#fff4e6', border: '1px solid #fd7e14', borderRadius: 4, marginTop: 4 }}>
              FEAT-4 Add dark mode
            </Box>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">Done:</Text>
            <Box style={{ padding: '4px 8px', background: '#fff4e6', border: '1px solid #fd7e14', borderRadius: 4, marginTop: 4 }}>
              BUG-88 Fix sync issue
            </Box>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">To do (top 2):</Text>
            <Box style={{ padding: '4px 8px', background: '#fff4e6', border: '1px solid #fd7e14', borderRadius: 4, marginTop: 4 }}>
              1. CHORE-1<br/>2. DOC-6
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider mb="md" />

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box style={{ display: 'flex', gap: 12 }}>
          {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card
              shadow="md"
              p="xs"
              style={{
                cursor: 'grabbing',
                border: HIGHLIGHTED_CARDS.includes(activeCard.id) ? '2px solid #fd7e14' : '1px solid #228be6',
                background: HIGHLIGHTED_CARDS.includes(activeCard.id) ? '#fff4e6' : undefined,
              }}
            >
              <Text size="sm">{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
