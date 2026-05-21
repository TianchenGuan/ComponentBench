'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T08
 * Task Name: Handle-only drag in dark compact mode
 *
 * Setup Description:
 * The page is in DARK theme with COMPACT spacing. The Kanban board is inside a
 * MUI Paper titled "Accessibility fixes". Columns are "To do", "In progress",
 * "Review", "Done". The In progress column contains eight cards with similar
 * "BUG-3xx" titles.
 *
 * Important: cards are draggable ONLY by the drag-handle icon; grabbing the card
 * body selects text but does not start a drag.
 *
 * Success: BUG-320 appears immediately below BUG-314 in "In progress".
 * Theme: DARK, Spacing: COMPACT, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box, IconButton, ThemeProvider, createTheme } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
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

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const initialState: KanbanBoardState = {
  todo: [{ id: 'card_bug_310', title: 'BUG-310 Fix focus' }],
  in_progress: [
    { id: 'card_bug_311', title: 'BUG-311 Fix aria' },
    { id: 'card_bug_312', title: 'BUG-312 Fix tab order' },
    { id: 'card_bug_314', title: 'BUG-314 Fix tooltip' },
    { id: 'card_bug_315', title: 'BUG-315 Fix contrast' },
    { id: 'card_bug_316', title: 'BUG-316 Fix hover' },
    { id: 'card_bug_320', title: 'BUG-320 Fix modal focus' },
    { id: 'card_bug_321', title: 'BUG-321 Fix skip link' },
    { id: 'card_bug_322', title: 'BUG-322 Fix label' },
  ],
  review: [{ id: 'card_bug_323', title: 'BUG-323 Fix alt text' }],
  done: [{ id: 'card_bug_324', title: 'BUG-324 Fix role' }],
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
      <Card sx={{ mb: 0.5, bgcolor: 'grey.900', display: 'flex', alignItems: 'center' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <IconButton size="small" sx={{ cursor: 'grab', p: 0.5, color: 'grey.500' }} {...attributes} {...listeners} data-testid={`handle-${card.id}`}>
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
        <CardContent sx={{ py: 0.5, px: 1, '&:last-child': { pb: 0.5 } }}>
          <Typography variant="body2" fontSize={11}>{card.title}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 140,
        p: 0.75,
        bgcolor: isOver ? 'grey.800' : 'grey.900',
        borderRadius: 0.5,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.700',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: 'block', color: 'grey.300' }}>{column.title}</Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 60 }}>{cards.map(card => <SortableCard key={card.id} card={card} />)}</Box>
      </SortableContext>
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Check success: BUG-314 is directly above BUG-320
  useEffect(() => {
    if (successFired.current) return;
    if (isCardDirectlyAbove(boardState, 'in_progress', 'card_bug_314', 'card_bug_320')) {
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
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={2} sx={{ p: 1.5, width: 650, bgcolor: 'grey.900' }} data-testid="kanban-board" data-board-id="accessibility_fixes">
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: 'grey.100' }}>Accessibility fixes</Typography>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
          </Box>
          <DragOverlay>
            {activeCard ? (
              <Card sx={{ cursor: 'grabbing', boxShadow: 4, border: 1, borderColor: 'primary.main', bgcolor: 'grey.800', display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" sx={{ p: 0.5, color: 'grey.500' }}>
                  <DragIndicatorIcon fontSize="small" />
                </IconButton>
                <CardContent sx={{ py: 0.5, px: 1, '&:last-child': { pb: 0.5 } }}>
                  <Typography variant="body2" fontSize={11}>{activeCard.title}</Typography>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Paper>
    </ThemeProvider>
  );
}
