'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-v2-T38
 * MUI: Dense handle-only adjacency plus Apply
 *
 * Setup: Dark theme, compact spacing, small scale, inline_surface, off_center.
 * Board "Accessibility fixes" — dense cards, drag only via IconButton handles.
 * In progress has eight BUG-3xx cards; BUG-320 is not directly below BUG-314 initially.
 * Unsaved footer: "Apply changes" / "Cancel". Only Apply commits.
 *
 * Success (require_confirm: Apply changes): Committed state has card_bug_314 directly
 * above card_bug_320 in column in_progress.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material';
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
import type { TaskComponentProps, KanbanCard, KanbanBoardState } from '../../types';
import { isCardDirectlyAbove, serializeBoardState } from '../../types';

const darkTheme = createTheme({
  palette: { mode: 'dark' },
  typography: { fontSize: 12 },
});

const initialBoard: KanbanBoardState = {
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

function cloneBoard(s: KanbanBoardState): KanbanBoardState {
  return JSON.parse(JSON.stringify(s)) as KanbanBoardState;
}

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        sx={{ mb: 0.35, bgcolor: 'grey.900', display: 'flex', alignItems: 'stretch', minHeight: 28 }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <IconButton
          size="small"
          sx={{ cursor: 'grab', p: 0.25, color: 'grey.500', borderRadius: 0 }}
          {...attributes}
          {...listeners}
          data-testid={`handle-${card.id}`}
        >
          <DragIndicatorIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <CardContent sx={{ py: 0.25, px: 0.5, flex: 1, '&:last-child': { pb: 0.25 } }}>
          <Typography variant="body2" fontSize={10} lineHeight={1.2}>
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
        minWidth: 112,
        p: 0.5,
        bgcolor: isOver ? 'grey.800' : 'grey.900',
        borderRadius: 0.5,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.700',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.25, display: 'block', color: 'grey.400', fontSize: 9 }}>
        {column.title}
      </Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 40 }}>{cards.map(card => <SortableCard key={card.id} card={card} />)}</Box>
      </SortableContext>
    </Box>
  );
}

export default function T38({ onSuccess }: TaskComponentProps) {
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
    if (isCardDirectlyAbove(committedBoard, 'in_progress', 'card_bug_314', 'card_bug_320')) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedBoard, onSuccess]);

  const findContainer = useCallback(
    (id: string, state: KanbanBoardState): string | undefined => {
      if (columns.some(c => c.id === id)) return id;
      for (const [columnId, cards] of Object.entries(state)) {
        if (cards.some(card => card.id === id)) return columnId;
      }
      return undefined;
    },
    []
  );

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

  const handleApply = () => {
    setCommittedBoard(cloneBoard(draftBoard));
  };

  const handleCancel = () => {
    setDraftBoard(cloneBoard(committedBoard));
  };

  const activeCard = activeId ? Object.values(draftBoard).flat().find(card => card.id === activeId) : null;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
        <Paper
          elevation={1}
          sx={{ p: 1, width: 600, maxWidth: '100%', bgcolor: 'grey.900', border: 1, borderColor: 'grey.700' }}
          data-testid="kanban-board"
          data-board-id="accessibility_fixes"
          data-instance-label="Accessibility fixes"
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.75, color: 'grey.100' }}>
            Accessibility fixes
          </Typography>

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
                <Card sx={{ cursor: 'grabbing', boxShadow: 4, border: 1, borderColor: 'primary.main', bgcolor: 'grey.800', display: 'flex' }}>
                  <IconButton size="small" sx={{ p: 0.25, color: 'grey.500' }}>
                    <DragIndicatorIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <CardContent sx={{ py: 0.25, px: 0.5, '&:last-child': { pb: 0.25 } }}>
                    <Typography variant="body2" fontSize={10}>{activeCard.title}</Typography>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>

          {dirty ? (
            <Box
              sx={{
                mt: 1,
                pt: 1,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Typography variant="caption" color="warning.light">
                Unsaved changes
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" color="inherit" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="small" variant="contained" onClick={handleApply} data-testid="apply-changes-btn">
                  Apply changes
                </Button>
              </Box>
            </Box>
          ) : null}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
