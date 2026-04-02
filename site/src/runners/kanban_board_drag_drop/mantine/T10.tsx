'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T10
 * Task Name: Move a card in a mini-board inside a table row
 *
 * Setup Description:
 * The page is a table_cell layout: a Mantine Table lists three projects
 * ("Project Atlas", "Project Beacon", "Project Cascade"). Each row contains
 * a compact mini Kanban board in the "Board" column.
 *
 * Target instance: the mini-board in the row labeled "Project Atlas".
 *
 * Initial state: "ATLAS-7 Fix billing export" is in "In progress" column.
 *
 * Success: Within Project Atlas mini-board, ATLAS-7 is in "Done" column.
 * Theme: light, Spacing: comfortable, Layout: table_cell, Placement: center, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, Table, Button } from '@mantine/core';
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

const atlasInitialState: KanbanBoardState = {
  todo: [{ id: 'card_atlas_5', title: 'ATLAS-5 Setup' }],
  in_progress: [
    { id: 'card_atlas_6', title: 'ATLAS-6 Config' },
    { id: 'card_atlas_7', title: 'ATLAS-7 Fix billing export' },
  ],
  done: [{ id: 'card_atlas_8', title: 'ATLAS-8 Deploy' }],
};

const beaconInitialState: KanbanBoardState = {
  todo: [{ id: 'card_beacon_1', title: 'BEACON-1 Init' }],
  in_progress: [{ id: 'card_beacon_2', title: 'BEACON-2 Build' }],
  done: [{ id: 'card_beacon_3', title: 'BEACON-3 Test' }],
};

const cascadeInitialState: KanbanBoardState = {
  todo: [{ id: 'card_cascade_1', title: 'CASCADE-1 Plan' }],
  in_progress: [{ id: 'card_cascade_2', title: 'CASCADE-2 Dev' }],
  done: [{ id: 'card_cascade_3', title: 'CASCADE-3 QA' }],
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
      <Card shadow="xs" p={4} mb={2} style={{ cursor: 'grab', fontSize: 10 }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text size="xs" style={{ fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {card.title}
        </Text>
      </Card>
    </div>
  );
}

function MiniKanbanColumn({ column, cards, boardId }: { column: { id: string; title: string }; cards: KanbanCard[]; boardId: string }) {
  const droppableId = `${boardId}-${column.id}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 60,
        padding: 4,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 4,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`${boardId}-column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb={4} style={{ fontSize: 9 }}>{column.title}</Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 40 }}>
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
      </SortableContext>
    </Box>
  );
}

interface MiniBoardProps {
  boardId: string;
  projectName: string;
  boardState: KanbanBoardState;
  setBoardState: React.Dispatch<React.SetStateAction<KanbanBoardState>>;
}

function MiniKanbanBoard({ boardId, projectName, boardState, setBoardState }: MiniBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const findContainer = (id: string): string | undefined => {
    const match = (id as string).match(new RegExp(`^${boardId}-(.+)$`));
    if (match) return match[1];
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
    let overContainer = findContainer(over.id as string);
    const overIdStr = over.id as string;
    if (overIdStr.startsWith(`${boardId}-`)) overContainer = overIdStr.replace(`${boardId}-`, '');
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
    <Box data-testid={`kanban-board-${boardId}`} data-board-id={boardId} data-project={projectName.toLowerCase().replace(/\s+/g, '_')}>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box style={{ display: 'flex', gap: 4 }}>
          {columns.map(column => <MiniKanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} boardId={boardId} />)}
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card shadow="md" p={4} style={{ cursor: 'grabbing', border: '1px solid #228be6', fontSize: 10 }}>
              <Text size="xs" style={{ fontSize: 10 }}>{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [atlasState, setAtlasState] = useState<KanbanBoardState>(atlasInitialState);
  const [beaconState, setBeaconState] = useState<KanbanBoardState>(beaconInitialState);
  const [cascadeState, setCascadeState] = useState<KanbanBoardState>(cascadeInitialState);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(atlasState, 'card_atlas_7', 'done')) {
      successFired.current = true;
      onSuccess();
    }
  }, [atlasState, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" style={{ width: 700 }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title order={4}>Projects Overview</Title>
        <Button variant="outline" size="xs">Download CSV</Button>
      </Box>

      <Table striped withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 140 }}>Project</Table.Th>
            <Table.Th style={{ width: 80 }}>Status</Table.Th>
            <Table.Th>Board</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr data-project="atlas">
            <Table.Td>Project Atlas</Table.Td>
            <Table.Td><Text size="xs" c="green">Active</Text></Table.Td>
            <Table.Td>
              <MiniKanbanBoard boardId="atlas" projectName="Project Atlas" boardState={atlasState} setBoardState={setAtlasState} />
            </Table.Td>
          </Table.Tr>
          <Table.Tr data-project="beacon">
            <Table.Td>Project Beacon</Table.Td>
            <Table.Td><Text size="xs" c="yellow">Planning</Text></Table.Td>
            <Table.Td>
              <MiniKanbanBoard boardId="beacon" projectName="Project Beacon" boardState={beaconState} setBoardState={setBeaconState} />
            </Table.Td>
          </Table.Tr>
          <Table.Tr data-project="cascade">
            <Table.Td>Project Cascade</Table.Td>
            <Table.Td><Text size="xs" c="blue">Dev</Text></Table.Td>
            <Table.Td>
              <MiniKanbanBoard boardId="cascade" projectName="Project Cascade" boardState={cascadeState} setBoardState={setCascadeState} />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
