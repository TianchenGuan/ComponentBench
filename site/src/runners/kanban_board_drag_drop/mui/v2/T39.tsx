'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-v2-T39
 * MUI: Highlighted cards must match the mini-board and save
 *
 * Setup: dashboard_panel, compact, high clutter. Card "Weekly priorities" holds a
 * non-interactive Reference mini-board (data-testid ref-mini-board-highlighted) and
 * the main Kanban. Highlighted: PM-2, QA-12, SEC-9. Save board commits.
 *
 * Success (require_confirm: Save board): Committed — PM-2 first in todo;
 * QA-12 in review; SEC-9 in done.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
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
import type { TaskComponentProps, KanbanCard, KanbanBoardState } from '../../types';
import { isCardAtIndex, isCardInColumn, serializeBoardState } from '../../types';

const HIGHLIGHT_IDS = new Set(['card_pm_2', 'card_qa_12', 'card_sec_9']);

const initialBoard: KanbanBoardState = {
  backlog: [
    { id: 'card_pm_2', title: 'PM-2 Draft Q2 roadmap' },
    { id: 'card_misc_a', title: 'OPS-1 Rotate logs' },
    { id: 'card_sec_9', title: 'SEC-9 Rotate API keys' },
  ],
  todo: [
    { id: 'card_misc_b', title: 'DEV-4 Patch deps' },
    { id: 'card_misc_c', title: 'DEV-5 Fix build' },
  ],
  review: [
    { id: 'card_qa_12', title: 'QA-12 Smoke test signup' },
    { id: 'card_misc_d', title: 'UX-3 Copy pass' },
  ],
  done: [{ id: 'card_misc_e', title: 'REL-1 Tag release' }],
};

/** Target layout for the static reference mini-board */
const referenceBoard: KanbanBoardState = {
  backlog: [{ id: 'ref_x', title: '…' }],
  todo: [
    { id: 'card_pm_2', title: 'PM-2 Draft Q2 roadmap' },
    { id: 'card_misc_b', title: 'DEV-4 Patch deps' },
  ],
  review: [
    { id: 'card_qa_12', title: 'QA-12 Smoke test signup' },
    { id: 'card_misc_d', title: 'UX-3 Copy pass' },
  ],
  done: [
    { id: 'card_sec_9', title: 'SEC-9 Rotate API keys' },
    { id: 'card_misc_e', title: 'REL-1 Tag release' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

function cloneBoard(s: KanbanBoardState): KanbanBoardState {
  return JSON.parse(JSON.stringify(s)) as KanbanBoardState;
}

function highlightSx(cardId: string) {
  return HIGHLIGHT_IDS.has(cardId)
    ? { border: 2, borderColor: 'warning.main', boxShadow: 1 }
    : {};
}

function RefMiniCard({ card }: { card: KanbanCard }) {
  return (
    <Card variant="outlined" sx={{ mb: 0.25, ...highlightSx(card.id) }}>
      <CardContent sx={{ py: 0.25, px: 0.5, '&:last-child': { pb: 0.25 } }}>
        <Typography variant="caption" fontSize={9} lineHeight={1.1} noWrap>
          {card.title}
        </Typography>
      </CardContent>
    </Card>
  );
}

function RefColumn({ col }: { col: { id: string; title: string } }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0, p: 0.25, bgcolor: 'grey.100', borderRadius: 0.5 }}>
      <Typography variant="caption" sx={{ fontSize: 8, fontWeight: 700, display: 'block', mb: 0.25 }}>
        {col.title}
      </Typography>
      {(referenceBoard[col.id] || []).map(c => <RefMiniCard key={c.id} card={c} />)}
    </Box>
  );
}

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        sx={{ mb: 0.35, cursor: 'grab', '&:hover': { boxShadow: 1 }, ...highlightSx(card.id) }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <CardContent sx={{ py: 0.35, px: 0.6, '&:last-child': { pb: 0.35 } }}>
          <Typography variant="caption" fontSize={10} display="block" lineHeight={1.2}>
            {card.title}
          </Typography>
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
        minWidth: 100,
        p: 0.5,
        bgcolor: isOver ? 'action.hover' : 'grey.50',
        borderRadius: 0.5,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.35, display: 'block', fontSize: 9 }}>
        {column.title}
      </Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 48 }}>{cards.map(card => <SortableCard key={card.id} card={card} />)}</Box>
      </SortableContext>
    </Box>
  );
}

export default function T39({ onSuccess }: TaskComponentProps) {
  const [draftBoard, setDraftBoard] = useState<KanbanBoardState>(() => cloneBoard(initialBoard));
  const [committedBoard, setCommittedBoard] = useState<KanbanBoardState>(() => cloneBoard(initialBoard));
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const dirty = serializeBoardState(draftBoard) !== serializeBoardState(committedBoard);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    const ok =
      isCardAtIndex(committedBoard, 'todo', 'card_pm_2', 0) &&
      isCardInColumn(committedBoard, 'card_qa_12', 'review') &&
      isCardInColumn(committedBoard, 'card_sec_9', 'done');
    if (ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedBoard, onSuccess]);

  const findContainer = useCallback((id: string, state: KanbanBoardState): string | undefined => {
    if (columns.some(c => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(state)) {
      if (cards.some(card => card.id === id)) return columnId;
    }
    return undefined;
  }, []);

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeContainer = findContainer(active.id as string, draftBoard);
    const overContainer = findContainer(over.id as string, draftBoard) || (over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setDraftBoard(prev => {
      const activeCards = [...prev[activeContainer]];
      const overCards = [...prev[overContainer]];
      const activeIndex = activeCards.findIndex(card => card.id === active.id);
      const activeCardMoved = activeCards[activeIndex];
      activeCards.splice(activeIndex, 1);
      const overIndex = overCards.findIndex(card => card.id === over.id);
      if (overIndex === -1) overCards.push(activeCardMoved);
      else overCards.splice(overIndex, 0, activeCardMoved);
      return { ...prev, [activeContainer]: activeCards, [overContainer]: overCards };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    setDraftBoard(prev => {
      const activeContainer = findContainer(active.id as string, prev);
      const overContainer = findContainer(over.id as string, prev);
      if (!activeContainer || !overContainer) return prev;
      if (activeContainer === overContainer) {
        const cards = prev[activeContainer];
        const oldIndex = cards.findIndex(card => card.id === active.id);
        const newIndex = cards.findIndex(card => card.id === over.id);
        if (oldIndex !== newIndex) {
          return { ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) };
        }
      }
      return prev;
    });
  };

  const handleSave = () => {
    setCommittedBoard(cloneBoard(draftBoard));
  };

  const activeCard = activeId ? Object.values(draftBoard).flat().find(card => card.id === activeId) : null;

  return (
    <Box sx={{ width: '100%', maxWidth: 920 }}>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {[1, 2, 3].map(i => (
          <Grid item xs={4} key={i}>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Widget {i}
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                <Chip size="small" label={`KPI ${i}a`} sx={{ height: 20, fontSize: 10 }} />
                <Chip size="small" label={`KPI ${i}b`} sx={{ height: 20, fontSize: 10 }} />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Card variant="outlined" sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Weekly priorities
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Reference
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 0.75, mb: 1.5, bgcolor: 'grey.50' }}
          data-testid="ref-mini-board-highlighted"
          data-reference-id="ref-mini-board-highlighted"
        >
          <Box sx={{ display: 'flex', gap: 0.35 }}>
            {columns.map(c => (
              <RefColumn key={c.id} col={c} />
            ))}
          </Box>
        </Paper>

        <Box data-testid="kanban-board" data-board-id="weekly_priorities" data-instance-label="Weekly priorities">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {columns.map(column => (
                <KanbanColumn key={column.id} column={column} cards={draftBoard[column.id] || []} />
              ))}
            </Box>
            <DragOverlay>
              {activeCard ? (
                <Card sx={{ cursor: 'grabbing', boxShadow: 3, ...highlightSx(activeCard.id) }}>
                  <CardContent sx={{ py: 0.35, px: 0.6, '&:last-child': { pb: 0.35 } }}>
                    <Typography variant="caption" fontSize={10}>{activeCard.title}</Typography>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>

        {dirty ? (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Unsaved changes
            </Typography>
            <Button size="small" variant="contained" onClick={handleSave} data-testid="save-board-btn">
              Save board
            </Button>
          </Box>
        ) : null}
      </Card>
    </Box>
  );
}
