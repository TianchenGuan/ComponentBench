import type { TaskSpec } from '@/types';

/**
 * Common props for all kanban board drag-drop task components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * A single card item in a Kanban column
 */
export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

/**
 * A column in a Kanban board
 */
export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

/**
 * State of a Kanban board
 */
export interface KanbanBoardState {
  [columnId: string]: KanbanCard[];
}

/**
 * Check if a card is in a specific column
 */
export function isCardInColumn(
  boardState: KanbanBoardState,
  cardId: string,
  columnId: string
): boolean {
  const column = boardState[columnId];
  if (!column) return false;
  return column.some(card => card.id === cardId);
}

/**
 * Get the column ID where a card is located
 */
export function findCardColumn(
  boardState: KanbanBoardState,
  cardId: string
): string | null {
  for (const [columnId, cards] of Object.entries(boardState)) {
    if (cards.some(card => card.id === cardId)) {
      return columnId;
    }
  }
  return null;
}

/**
 * Get the index of a card within its column
 */
export function getCardIndex(
  boardState: KanbanBoardState,
  columnId: string,
  cardId: string
): number {
  const column = boardState[columnId];
  if (!column) return -1;
  return column.findIndex(card => card.id === cardId);
}

/**
 * Check if card A is directly above card B in the same column
 */
export function isCardDirectlyAbove(
  boardState: KanbanBoardState,
  columnId: string,
  upperCardId: string,
  lowerCardId: string
): boolean {
  const column = boardState[columnId];
  if (!column) return false;
  const upperIndex = column.findIndex(card => card.id === upperCardId);
  const lowerIndex = column.findIndex(card => card.id === lowerCardId);
  return upperIndex !== -1 && lowerIndex !== -1 && lowerIndex === upperIndex + 1;
}

/**
 * Check if a card is at a specific index in a column
 */
export function isCardAtIndex(
  boardState: KanbanBoardState,
  columnId: string,
  cardId: string,
  index: number
): boolean {
  const column = boardState[columnId];
  if (!column || !column[index]) return false;
  return column[index].id === cardId;
}

/**
 * Check if cards are in specific order (by card IDs) in a column
 */
export function checkColumnOrder(
  boardState: KanbanBoardState,
  columnId: string,
  expectedOrder: string[]
): boolean {
  const column = boardState[columnId];
  if (!column) return false;
  const cardIds = column.map(card => card.id);
  if (cardIds.length !== expectedOrder.length) return false;
  return expectedOrder.every((id, i) => cardIds[i] === id);
}

/**
 * Check top N cards in a column match expected IDs
 */
export function checkTopCards(
  boardState: KanbanBoardState,
  columnId: string,
  expectedTopIds: string[]
): boolean {
  const column = boardState[columnId];
  if (!column || column.length < expectedTopIds.length) return false;
  return expectedTopIds.every((id, i) => column[i].id === id);
}

/**
 * Check if a card is between two other cards in a column (card A, target, card B order)
 */
export function isCardBetween(
  boardState: KanbanBoardState,
  columnId: string,
  cardId: string,
  aboveCardId: string,
  belowCardId: string
): boolean {
  const column = boardState[columnId];
  if (!column) return false;
  const aboveIndex = column.findIndex(card => card.id === aboveCardId);
  const cardIndex = column.findIndex(card => card.id === cardId);
  const belowIndex = column.findIndex(card => card.id === belowCardId);
  return aboveIndex !== -1 && cardIndex !== -1 && belowIndex !== -1 &&
         cardIndex === aboveIndex + 1 && belowIndex === cardIndex + 1;
}

/**
 * Move a card within or between columns
 */
export function moveCard(
  boardState: KanbanBoardState,
  cardId: string,
  toColumnId: string,
  toIndex?: number
): KanbanBoardState {
  const newState: KanbanBoardState = {};
  let cardToMove: KanbanCard | null = null;

  // First pass: remove card from its current column
  for (const [columnId, cards] of Object.entries(boardState)) {
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      cardToMove = cards[cardIndex];
      newState[columnId] = [...cards.slice(0, cardIndex), ...cards.slice(cardIndex + 1)];
    } else {
      newState[columnId] = [...cards];
    }
  }

  // Second pass: add card to target column
  if (cardToMove && newState[toColumnId]) {
    if (toIndex !== undefined && toIndex >= 0) {
      newState[toColumnId] = [
        ...newState[toColumnId].slice(0, toIndex),
        cardToMove,
        ...newState[toColumnId].slice(toIndex),
      ];
    } else {
      newState[toColumnId] = [...newState[toColumnId], cardToMove];
    }
  }

  return newState;
}

/**
 * Serialize board state for comparison (deep equality check)
 */
export function serializeBoardState(boardState: KanbanBoardState): string {
  const sorted = Object.keys(boardState).sort().reduce((acc, key) => {
    acc[key] = boardState[key].map(card => card.id);
    return acc;
  }, {} as Record<string, string[]>);
  return JSON.stringify(sorted);
}

/**
 * Compare two board states
 */
export function boardStatesEqual(a: KanbanBoardState, b: KanbanBoardState): boolean {
  return serializeBoardState(a) === serializeBoardState(b);
}
