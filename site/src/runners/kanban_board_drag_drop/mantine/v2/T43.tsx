'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-v2-T43
 * Modal "Project board": move PROJ-2 to top of Review, Save board, modal closes.
 * Success: committed Review top = card_proj_2, overlay closed, require_confirm Save board.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Box, Title, Group, Modal } from '@mantine/core';
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
import { checkTopCards } from '../../types';

const initialState: KanbanBoardState = {
  todo: [
    { id: 'card_proj_0', title: 'PROJ-0 Kickoff notes', category: 'Docs' },
  ],
  in_progress: [
    { id: 'card_proj_2', title: 'PROJ-2 Draft proposal', category: 'Product' },
    { id: 'card_proj_4', title: 'PROJ-4 Sync stakeholders', category: 'Meetings' },
  ],
  review: [
    { id: 'card_proj_1', title: 'PROJ-1 Spec outline', category: 'Design' },
    { id: 'card_proj_5', title: 'PROJ-5 Risk list', category: 'Ops' },
  ],
  done: [{ id: 'card_proj_3', title: 'PROJ-3 Budget sheet', category: 'Finance' }],
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
      <Card shadow="xs" p="xs" mb={6} style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Group gap={6} mb={4}>
          {card.category && (
            <Text size="xs" c="dimmed">
              {card.category}
            </Text>
          )}
        </Group>
        <Text fw={500} size="sm">
          {card.title}
        </Text>
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
        minWidth: 168,
        padding: 8,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb="sm">
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 72 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T43({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [committed, setCommitted] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initialState)));
  const [pending, setPending] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initialState)));
  const [isDirty, setIsDirty] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (!modalOpen && !isDirty && checkTopCards(committed, 'review', ['card_proj_2'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [modalOpen, isDirty, committed, onSuccess]);

  const findContainer = (id: string, state: KanbanBoardState): string | undefined => {
    if (columns.some((c) => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(state)) {
      if (cards.some((card) => card.id === id)) return columnId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeContainer = findContainer(active.id as string, pending);
    const overContainer = findContainer(over.id as string, pending) || (over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setPending((prev) => {
      const activeCards = [...prev[activeContainer]];
      const overCards = [...prev[overContainer]];
      const activeIndex = activeCards.findIndex((card) => card.id === active.id);
      const activeCard = activeCards[activeIndex];
      activeCards.splice(activeIndex, 1);
      const overIndex = overCards.findIndex((card) => card.id === over.id);
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
    const activeContainer = findContainer(active.id as string, pending);
    const overContainer = findContainer(over.id as string, pending);
    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) {
      const cards = pending[activeContainer];
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      if (oldIndex !== newIndex) {
        setPending((prev) => ({ ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) }));
        setIsDirty(true);
      }
    }
  };

  const handleSave = () => {
    setCommitted(JSON.parse(JSON.stringify(pending)));
    setIsDirty(false);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setPending(JSON.parse(JSON.stringify(committed)));
    setIsDirty(false);
  };

  const handleModalClose = () => {
    setPending(JSON.parse(JSON.stringify(committed)));
    setIsDirty(false);
    setModalOpen(false);
  };

  const activeCard = activeId ? Object.values(pending).flat().find((card) => card.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box p="xs" style={{ maxWidth: 720, margin: '0 auto' }}>
        <Text size="xs" c="dimmed" mb="sm">
          Layout: modal flow · medium clutter
        </Text>
        <Group gap="sm" mb="md" wrap="wrap">
          <Button size="xs" variant="light">
            Workspace
          </Button>
          <Button size="xs" variant="light">
            Reports
          </Button>
          <Button size="compact-sm" onClick={() => setModalOpen(true)}>
            Open Project board
          </Button>
        </Group>

        <Modal opened={modalOpen} onClose={handleModalClose} title="Project board" size="xl" padding="md">
          <Box
            data-testid="kanban-board"
            data-board-id="project_board_modal"
            data-board-instance="Project board (modal)"
          >
            <Title order={5} mb="xs">
              Project board
            </Title>
            <Text size="xs" c="dimmed" mb="md">
              Staged edits — save to apply.
            </Text>

            <Group gap="sm" align="stretch" wrap="nowrap" style={{ overflowX: 'auto' }}>
              {columns.map((column) => (
                <KanbanColumn key={column.id} column={column} cards={pending[column.id] || []} />
              ))}
            </Group>

            {isDirty && (
              <Group mt="md" pt="md" style={{ borderTop: '1px solid #dee2e6' }} justify="flex-end">
                <Button variant="default" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} data-testid="save-board-btn">
                  Save board
                </Button>
              </Group>
            )}
          </Box>
        </Modal>
      </Box>

      <DragOverlay>
        {activeCard ? (
          <Card shadow="md" p="xs" style={{ cursor: 'grabbing', border: '1px solid #228be6' }}>
            <Text fw={500} size="sm">
              {activeCard.title}
            </Text>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
