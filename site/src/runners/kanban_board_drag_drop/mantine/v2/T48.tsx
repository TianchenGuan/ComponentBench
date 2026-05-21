'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-v2-T48
 * Review board modal: reorder Review to match Reference panel; Save order → Confirm commits.
 * Success: committed order card_pr_12, card_pr_17, card_pr_19; overlay closed; confirm_control Confirm.
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
import { checkColumnOrder } from '../../types';

const initialCommitted: KanbanBoardState = {
  todo: [{ id: 'card_pr_t1', title: 'PR-T1 Update CI', category: 'Infra' }],
  review: [
    { id: 'card_pr_17', title: 'PR-17 Refactor date utils', category: 'Tech debt' },
    { id: 'card_pr_12', title: 'PR-12 Add loading skeleton', category: 'UX' },
    { id: 'card_pr_19', title: 'PR-19 Remove dead code', category: 'Cleanup' },
  ],
  done: [{ id: 'card_pr_d1', title: 'PR-D1 Ship hotfix', category: 'Release' }],
};

const referenceOrder: KanbanCard[] = [
  { id: 'card_pr_12', title: 'PR-12 Add loading skeleton', category: 'UX' },
  { id: 'card_pr_17', title: 'PR-17 Refactor date utils', category: 'Tech debt' },
  { id: 'card_pr_19', title: 'PR-19 Remove dead code', category: 'Cleanup' },
];

const expectedReviewIds = ['card_pr_12', 'card_pr_17', 'card_pr_19'];

function StaticLane({ title, columnId, cards }: { title: string; columnId: string; cards: KanbanCard[] }) {
  return (
    <Box
      style={{
        flex: 1,
        minWidth: 160,
        padding: 8,
        background: '#f8f9fa',
        borderRadius: 6,
        border: '1px solid #dee2e6',
      }}
      data-testid={`column-${columnId}`}
      data-column-id={columnId}
    >
      <Text fw={600} size="xs" mb="sm">
        {title}
      </Text>
      <Box>
        {cards.map((card) => (
          <Card key={card.id} shadow="xs" p="xs" mb={6} data-testid={`card-${card.id}`} data-card-id={card.id}>
            <Text fw={500} size="sm">
              {card.title}
            </Text>
          </Card>
        ))}
      </Box>
    </Box>
  );
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
      <Card shadow="xs" p="xs" mb={6} style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text fw={500} size="sm">
          {card.title}
        </Text>
      </Card>
    </div>
  );
}

function ReviewLane({ cards }: { cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'review' });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 160,
        padding: 8,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid="column-review"
      data-column-id="review"
    >
      <Text fw={600} size="xs" mb="sm">
        Review
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

export default function T48({ onSuccess }: TaskComponentProps) {
  const [mainOpen, setMainOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [committed, setCommitted] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initialCommitted)));
  const [pending, setPending] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initialCommitted)));
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const isDirty = pending.review.map((c) => c.id).join(',') !== committed.review.map((c) => c.id).join(',');

  useEffect(() => {
    if (successFired.current) return;
    if (
      !mainOpen &&
      !confirmOpen &&
      checkColumnOrder(committed, 'review', expectedReviewIds)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [mainOpen, confirmOpen, committed, onSuccess]);

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const overId = over.id as string;
    setPending((prev) => {
      if (!prev.review.some((c) => c.id === active.id)) return prev;
      const col = [...prev.review];
      const oldIndex = col.findIndex((c) => c.id === active.id);
      if (oldIndex === -1) return prev;
      let newIndex: number;
      if (overId === 'review') {
        newIndex = col.length - 1;
      } else {
        newIndex = col.findIndex((c) => c.id === overId);
      }
      if (newIndex === -1 || oldIndex === newIndex) return prev;
      return { ...prev, review: arrayMove(col, oldIndex, newIndex) };
    });
  };

  const handleSaveOrderClick = () => setConfirmOpen(true);

  const handleConfirmCommit = () => {
    setCommitted(JSON.parse(JSON.stringify(pending)));
    setConfirmOpen(false);
    setMainOpen(false);
  };

  const handleConfirmCancel = () => setConfirmOpen(false);

  const handleMainClose = () => {
    setPending(JSON.parse(JSON.stringify(committed)));
    setMainOpen(false);
  };

  const activeCard = activeId ? pending.review.find((c) => c.id === activeId) ?? null : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box p="xs">
        <Button size="compact-sm" onClick={() => setMainOpen(true)}>
          Open Review board
        </Button>

        <Modal opened={mainOpen} onClose={handleMainClose} title="Review board" size="xl" padding="lg">
          <Box data-testid="kanban-board" data-board-id="review_modal" data-board-instance="Review board (modal)">
            <Text size="xs" c="dimmed" mb="md">
              Match the Review column to Reference (Review), then save and confirm.
            </Text>

            <Group align="stretch" gap="md" wrap="nowrap" style={{ overflowX: 'auto' }}>
              <Box style={{ display: 'flex', gap: 12, flex: 1, minWidth: 0, alignItems: 'stretch' }}>
                <StaticLane title="To do" columnId="todo" cards={pending.todo} />
                <ReviewLane cards={pending.review} />
                <StaticLane title="Done" columnId="done" cards={pending.done} />
              </Box>

              <Box
                p="md"
                style={{
                  flex: '0 0 200px',
                  border: '1px dashed #868e96',
                  borderRadius: 8,
                  background: '#fff',
                }}
                data-reference-id="ref-review-order"
              >
                <Text fw={700} size="sm" mb="sm">
                  Reference (Review)
                </Text>
                {referenceOrder.map((card, i) => (
                  <Card key={card.id} shadow="xs" p="xs" mb={8} withBorder>
                    <Text size="xs" c="dimmed" mb={4}>
                      {i + 1}.
                    </Text>
                    <Text size="sm" fw={500}>
                      {card.title}
                    </Text>
                  </Card>
                ))}
              </Box>
            </Group>

            {isDirty && (
              <Group mt="lg" justify="flex-end">
                <Button onClick={handleSaveOrderClick} data-testid="save-order-btn">
                  Save order
                </Button>
              </Group>
            )}
          </Box>
        </Modal>

        <Modal opened={confirmOpen} onClose={handleConfirmCancel} title="Apply order?" size="sm" centered>
          <Text size="sm" mb="md">
            Commit the new Review order?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={handleConfirmCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCommit} data-testid="confirm-commit-btn">
              Confirm
            </Button>
          </Group>
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
