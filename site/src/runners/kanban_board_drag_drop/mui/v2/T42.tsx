'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-v2-T42
 * MUI: Drawer board exact destination plus confirm
 *
 * Setup: drawer_flow. "Open Docs board" opens left Drawer with four-column board.
 * DOC-11 in To do; DOC-9 in Review. Save changes opens confirm dialog (Confirm / Cancel).
 * Confirm commits, closes drawer.
 *
 * Success (require_confirm: Confirm): Committed state has card_doc_11 directly above
 * card_doc_9 in Review; drawer closed.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
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
import { isCardDirectlyAbove, serializeBoardState } from '../../types';

const initialBoard: KanbanBoardState = {
  backlog: [{ id: 'card_doc_8', title: 'DOC-8 Outline' }],
  todo: [
    { id: 'card_doc_11', title: 'DOC-11 Update API docs' },
    { id: 'card_doc_12', title: 'DOC-12 Write guide' },
  ],
  review: [
    { id: 'card_doc_9', title: 'DOC-9 Check links' },
    { id: 'card_doc_13', title: 'DOC-13 Review changelog' },
  ],
  done: [{ id: 'card_doc_14', title: 'DOC-14 Fix typos' }],
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

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ mb: 0.5, cursor: isDragging ? 'grabbing' : 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <CardContent sx={{ py: 0.5, px: 1, '&:last-child': { pb: 0.5 } }}>
          <Typography variant="caption" fontSize={11}>{card.title}</Typography>
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
        p: 0.6,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 0.5,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: 'block', fontSize: 10 }}>
        {column.title}
      </Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 64 }}>{cards.map(card => <SortableCard key={card.id} card={card} />)}</Box>
      </SortableContext>
    </Box>
  );
}

export default function T42({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftBoard, setDraftBoard] = useState<KanbanBoardState>(() => cloneBoard(initialBoard));
  const [committedBoard, setCommittedBoard] = useState<KanbanBoardState>(() => cloneBoard(initialBoard));
  const successFired = useRef(false);

  const dirty = drawerOpen && serializeBoardState(draftBoard) !== serializeBoardState(committedBoard);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    if (
      !drawerOpen &&
      isCardDirectlyAbove(committedBoard, 'review', 'card_doc_11', 'card_doc_9')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [drawerOpen, committedBoard, onSuccess]);

  const openDrawer = () => {
    setDraftBoard(cloneBoard(committedBoard));
    setDrawerOpen(true);
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

  const handleSaveChangesClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmCommit = () => {
    setCommittedBoard(cloneBoard(draftBoard));
    setConfirmOpen(false);
    setDrawerOpen(false);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
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
      <Box sx={{ width: '100%', maxWidth: 520 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Documentation
        </Typography>
        <Button variant="contained" onClick={openDrawer} data-testid="open-docs-board-btn">
          Open Docs board
        </Button>

        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose} data-testid="docs-board-drawer">
          <Box sx={{ width: 560, maxWidth: '100vw', p: 2 }} role="presentation">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Docs board
            </Typography>

            <Box
              data-testid="kanban-board"
              data-board-id="docs_board_drawer"
              data-instance-label="Docs board (drawer)"
            >
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                {columns.map(column => (
                  <KanbanColumn key={column.id} column={column} cards={draftBoard[column.id] || []} />
                ))}
              </Box>
            </Box>

            {dirty ? (
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="warning.main" sx={{ width: '100%' }}>
                  Unsaved changes
                </Typography>
                <Button variant="contained" onClick={handleSaveChangesClick} data-testid="save-changes-btn">
                  Save changes
                </Button>
              </Box>
            ) : null}
          </Box>
        </Drawer>

        <Dialog open={confirmOpen} onClose={handleCancelConfirm} data-testid="save-confirm-dialog">
          <DialogTitle>Save changes?</DialogTitle>
          <DialogContent>
            <DialogContentText>Commit updates to the Docs board and close the drawer.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelConfirm}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirmCommit} data-testid="confirm-save-btn">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <DragOverlay>
        {activeCard ? (
          <Card sx={{ cursor: 'grabbing', boxShadow: 4 }}>
            <CardContent sx={{ py: 0.4, px: 0.75, '&:last-child': { pb: 0.4 } }}>
              <Typography variant="caption" fontSize={11}>{activeCard.title}</Typography>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
