'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-v2-T40
 * MUI: Modal board with hidden card in a long column
 *
 * Setup: modal_flow, compact. "Open project board" opens Dialog "Project board".
 * To do column is scrollable; BUG-9 Fix notifications starts near the bottom.
 * Save board commits and closes the modal (overlay_open: false for success).
 *
 * Success (require_confirm: Save board): Committed state has card_bug_9 in
 * in_progress; modal closed.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
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
import { isCardInColumn, serializeBoardState } from '../../types';

function makeTodoCards(): KanbanCard[] {
  const cards: KanbanCard[] = [];
  for (let i = 1; i <= 18; i++) {
    if (i === 9) {
      cards.push({ id: 'card_bug_9', title: 'BUG-9 Fix notifications' });
    } else {
      cards.push({ id: `card_bug_${i}`, title: `BUG-${i} Placeholder task` });
    }
  }
  return cards;
}

const initialBoard: KanbanBoardState = {
  todo: makeTodoCards(),
  in_progress: [{ id: 'card_bug_20', title: 'BUG-20 In progress item' }],
  review: [{ id: 'card_bug_21', title: 'BUG-21 Review item' }],
  done: [{ id: 'card_bug_22', title: 'BUG-22 Done item' }],
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
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ mb: 0.4, cursor: isDragging ? 'grabbing' : 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <CardContent sx={{ py: 0.4, px: 0.75, '&:last-child': { pb: 0.4 } }}>
          <Typography variant="caption" fontSize={10}>{card.title}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({
  column,
  cards,
  scrollable,
}: {
  column: { id: string; title: string };
  cards: KanbanCard[];
  scrollable?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 108,
        p: 0.5,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
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
        <Box
          sx={{
            minHeight: 56,
            maxHeight: scrollable ? 200 : undefined,
            overflowY: scrollable ? 'auto' : undefined,
          }}
        >
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T40({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftBoard, setDraftBoard] = useState<KanbanBoardState>(() => cloneBoard(initialBoard));
  const [committedBoard, setCommittedBoard] = useState<KanbanBoardState>(() => cloneBoard(initialBoard));
  const successFired = useRef(false);

  const dirty = modalOpen && serializeBoardState(draftBoard) !== serializeBoardState(committedBoard);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    if (!modalOpen && isCardInColumn(committedBoard, 'card_bug_9', 'in_progress')) {
      successFired.current = true;
      onSuccess();
    }
  }, [modalOpen, committedBoard, onSuccess]);

  const openModal = () => {
    setDraftBoard(cloneBoard(committedBoard));
    setModalOpen(true);
  };

  const findContainer = useCallback((id: string, state: KanbanBoardState): string | undefined => {
    if (columns.some(c => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(state)) {
      if (cards.some(card => card.id === id)) return columnId;
    }
    return undefined;
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

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
    setModalOpen(false);
  };

  const handleDialogClose = () => {
    setModalOpen(false);
    setActiveId(null);
    setDraftBoard(cloneBoard(committedBoard));
  };

  const activeCard =
    activeId == null
      ? null
      : (Object.values(draftBoard).flat().find(c => c.id === activeId) ?? null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Paper elevation={0} sx={{ p: 2, maxWidth: 480 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Project hub
        </Typography>
        <Button variant="contained" onClick={openModal} data-testid="open-project-board-btn">
          Open project board
        </Button>

        <Dialog open={modalOpen} onClose={handleDialogClose} maxWidth="md" fullWidth data-testid="project-board-dialog">
          <DialogTitle>Project board</DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 1 }}
              data-testid="kanban-board"
              data-board-id="project_board_modal"
              data-instance-label="Project board (modal)"
            >
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <KanbanColumn column={columns[0]} cards={draftBoard.todo || []} scrollable />
                <KanbanColumn column={columns[1]} cards={draftBoard.in_progress || []} />
                <KanbanColumn column={columns[2]} cards={draftBoard.review || []} />
                <KanbanColumn column={columns[3]} cards={draftBoard.done || []} />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ flexWrap: 'wrap', gap: 1, px: 3, pb: 2 }}>
            {dirty ? (
              <Typography variant="caption" color="warning.main" sx={{ mr: 'auto' }}>
                Unsaved changes
              </Typography>
            ) : null}
            <Button onClick={handleDialogClose}>Close</Button>
            <Button variant="contained" onClick={handleSave} disabled={!dirty} data-testid="save-board-btn">
              Save board
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      <DragOverlay>
        {activeCard ? (
          <Card sx={{ cursor: 'grabbing', boxShadow: 4 }}>
            <CardContent sx={{ py: 0.4, px: 0.75, '&:last-child': { pb: 0.4 } }}>
              <Typography variant="caption" fontSize={10}>{activeCard.title}</Typography>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
