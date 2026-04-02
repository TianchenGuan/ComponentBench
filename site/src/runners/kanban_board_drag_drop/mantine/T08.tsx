'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T08
 * Task Name: Move a card and explicitly save changes
 *
 * Setup Description:
 * The board is shown inside a Mantine Card titled "Ops checklist".
 * Columns are "To do", "In progress", and "Done".
 *
 * Initial state: "OPS-2 Rotate secrets" is in "In progress".
 *
 * Feedback behavior: dragging creates a "pending" state with a footer showing
 * "Save changes" (primary) and "Discard" buttons.
 * The board does NOT commit until "Save changes" is pressed.
 *
 * Success: OPS-2 is in "Done" AND committed (not dirty).
 * Theme: light, Spacing: COMPACT, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, Button, Group, Alert } from '@mantine/core';
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
  todo: [{ id: 'card_ops_1', title: 'OPS-1 Update configs' }],
  in_progress: [
    { id: 'card_ops_2', title: 'OPS-2 Rotate secrets' },
    { id: 'card_ops_3', title: 'OPS-3 Check backups' },
  ],
  done: [{ id: 'card_ops_4', title: 'OPS-4 Deploy fix' }],
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
      <Card shadow="xs" p="xs" mb={4} style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
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
        minWidth: 180,
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

export default function T08({ onSuccess }: TaskComponentProps) {
  const [committedState, setCommittedState] = useState<KanbanBoardState>(JSON.parse(JSON.stringify(initialState)));
  const [pendingState, setPendingState] = useState<KanbanBoardState>(JSON.parse(JSON.stringify(initialState)));
  const [isDirty, setIsDirty] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Check success: OPS-2 in "Done" AND committed (not dirty)
  useEffect(() => {
    if (successFired.current) return;
    if (!isDirty && isCardInColumn(committedState, 'card_ops_2', 'done')) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedState, isDirty, onSuccess]);

  const handleSave = () => {
    setCommittedState(JSON.parse(JSON.stringify(pendingState)));
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setPendingState(JSON.parse(JSON.stringify(committedState)));
    setIsDirty(false);
  };

  const findContainer = (id: string): string | undefined => {
    if (columns.some(c => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(pendingState)) {
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

    setPendingState(prev => {
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
    setIsDirty(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) {
      const cards = pendingState[activeContainer];
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);
      if (oldIndex !== newIndex) {
        setPendingState(prev => ({ ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) }));
        setIsDirty(true);
      }
    }
  };

  const activeCard = activeId ? Object.values(pendingState).flat().find(card => card.id === activeId) : null;

  return (
    <Paper shadow="sm" p="md" style={{ width: 650 }} data-testid="kanban-board" data-board-id="ops_checklist">
      <Title order={5} mb="sm">Ops checklist</Title>

      {isDirty && (
        <Alert color="yellow" mb="sm" data-testid="unsaved-banner">
          Unsaved changes
        </Alert>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box style={{ display: 'flex', gap: 8 }}>
          {columns.map(column => <KanbanColumn key={column.id} column={column} cards={pendingState[column.id] || []} />)}
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card shadow="md" p="xs" style={{ cursor: 'grabbing', border: '1px solid #228be6' }}>
              <Text size="xs">{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {isDirty && (
        <Group mt="md" style={{ borderTop: '1px solid #dee2e6', paddingTop: 12 }}>
          <Button onClick={handleSave} data-testid="save-changes-btn">Save changes</Button>
          <Button variant="outline" onClick={handleDiscard} data-testid="discard-btn">Discard</Button>
        </Group>
      )}
    </Paper>
  );
}
