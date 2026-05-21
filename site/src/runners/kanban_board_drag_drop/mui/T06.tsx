'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T06
 * Task Name: Scroll within a long column to find and move a card
 *
 * Setup Description:
 * The board is shown in a centered card titled "Bug Backlog". Columns are "Backlog",
 * "To do", and "Done". The Backlog column is long (~12 cards) and rendered inside
 * a fixed-height scroll area.
 *
 * Initial state: "BUG-77 Slow search" is in Backlog near the bottom (off-screen).
 *
 * Success: Card BUG-77 is in "To do" column.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box } from '@mui/material';
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
  backlog: [
    { id: 'card_bug_70', title: 'BUG-70 Crash on save' },
    { id: 'card_bug_71', title: 'BUG-71 Memory leak' },
    { id: 'card_bug_72', title: 'BUG-72 Slow render' },
    { id: 'card_bug_73', title: 'BUG-73 Broken auth' },
    { id: 'card_bug_74', title: 'BUG-74 Bad redirect' },
    { id: 'card_bug_75', title: 'BUG-75 Missing icon' },
    { id: 'card_bug_76', title: 'BUG-76 Wrong color' },
    { id: 'card_bug_77', title: 'BUG-77 Slow search' },
    { id: 'card_bug_78', title: 'BUG-78 Form error' },
    { id: 'card_bug_79', title: 'BUG-79 Modal stuck' },
    { id: 'card_bug_80', title: 'BUG-80 API timeout' },
    { id: 'card_bug_81', title: 'BUG-81 CSS glitch' },
  ],
  todo: [{ id: 'card_bug_82', title: 'BUG-82 Fix tooltip' }],
  done: [{ id: 'card_bug_83', title: 'BUG-83 Fixed dropdown' }],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ mb: 1, cursor: 'grab', '&:hover': { boxShadow: 2 } }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" fontSize={13}>{card.title}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards, scrollable }: { column: { id: string; title: string }; cards: KanbanCard[]; scrollable?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 200,
        p: 1.5,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 1,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>{column.title}</Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 100, maxHeight: scrollable ? 250 : undefined, overflowY: scrollable ? 'auto' : undefined }}>
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
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
    if (isCardInColumn(boardState, 'card_bug_77', 'todo')) {
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
    <Paper elevation={2} sx={{ p: 3, width: 720 }} data-testid="kanban-board" data-board-id="bug_backlog">
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Bug Backlog</Typography>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <KanbanColumn column={columns[0]} cards={boardState.backlog || []} scrollable />
          <KanbanColumn column={columns[1]} cards={boardState.todo || []} />
          <KanbanColumn column={columns[2]} cards={boardState.done || []} />
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card sx={{ cursor: 'grabbing', boxShadow: 4, border: 1, borderColor: 'primary.main' }}>
              <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <Typography variant="body2" fontSize={13}>{activeCard.title}</Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
