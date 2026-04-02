'use client';

/**
 * table_static-mantine-T08: Horizontal scroll then select a specific metric cell
 *
 * A read-only Experiment Results table (Mantine Table) is displayed in an isolated card anchored at the
 * top-left of the viewport. The table is wide with multiple metric columns (Accuracy, Precision, Recall, F1 score, AUC).
 * Only the first few columns are visible initially. Scale is small (reduced font size/row height), and the table container
 * provides a horizontal scrollbar for overflow. Clicking a body cell sets an active cell highlight (cell outline). The target
 * column "F1 score" is off-screen to the right until the user scrolls horizontally. Initial state: no active cell; F1 score
 * not visible.
 */

import React, { useState } from 'react';
import { Table, Card, Text, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface ExperimentData {
  key: string;
  experiment: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1Score: string;
  auc: string;
  trainTime: string;
}

const experimentsData: ExperimentData[] = [
  { key: 'EXP-15', experiment: 'EXP-15', accuracy: '0.921', precision: '0.918', recall: '0.925', f1Score: '0.921', auc: '0.956', trainTime: '45m' },
  { key: 'EXP-16', experiment: 'EXP-16', accuracy: '0.934', precision: '0.931', recall: '0.938', f1Score: '0.934', auc: '0.968', trainTime: '52m' },
  { key: 'EXP-17', experiment: 'EXP-17', accuracy: '0.942', precision: '0.939', recall: '0.946', f1Score: '0.942', auc: '0.975', trainTime: '61m' },
  { key: 'EXP-18', experiment: 'EXP-18', accuracy: '0.928', precision: '0.925', recall: '0.932', f1Score: '0.928', auc: '0.962', trainTime: '48m' },
  { key: 'EXP-19', experiment: 'EXP-19', accuracy: '0.915', precision: '0.912', recall: '0.919', f1Score: '0.915', auc: '0.951', trainTime: '43m' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [activeCell, setActiveCell] = useState<{ rowKey: string; columnKey: string } | null>(null);

  const handleCellClick = (rowKey: string, columnKey: string) => {
    setActiveCell({ rowKey, columnKey });
    if (rowKey === 'EXP-17' && columnKey === 'f1_score') {
      onSuccess();
    }
  };

  const cellStyle = (rowKey: string, columnKey: string): React.CSSProperties => ({
    cursor: 'pointer',
    outline: activeCell?.rowKey === rowKey && activeCell?.columnKey === columnKey ? '2px solid var(--mantine-color-blue-6)' : undefined,
    outlineOffset: -2,
    whiteSpace: 'nowrap',
    minWidth: 90,
  });

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }} data-cb-active-cell={activeCell ? `${activeCell.rowKey}|${activeCell.columnKey}` : undefined}>
      <Text fw={500} size="sm" mb="sm">Experiment Results</Text>
      <ScrollArea>
        <Table fz="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ minWidth: 70 }}>Experiment</Table.Th>
              <Table.Th style={{ minWidth: 80 }}>Accuracy</Table.Th>
              <Table.Th style={{ minWidth: 80 }}>Precision</Table.Th>
              <Table.Th style={{ minWidth: 70 }}>Recall</Table.Th>
              <Table.Th style={{ minWidth: 80 }}>F1 score</Table.Th>
              <Table.Th style={{ minWidth: 60 }}>AUC</Table.Th>
              <Table.Th style={{ minWidth: 80 }}>Train time</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {experimentsData.map((row) => (
              <Table.Tr key={row.key} data-row-key={row.key}>
                <Table.Td style={cellStyle(row.key, 'experiment')} onClick={() => handleCellClick(row.key, 'experiment')}>{row.experiment}</Table.Td>
                <Table.Td style={cellStyle(row.key, 'accuracy')} onClick={() => handleCellClick(row.key, 'accuracy')}>{row.accuracy}</Table.Td>
                <Table.Td style={cellStyle(row.key, 'precision')} onClick={() => handleCellClick(row.key, 'precision')}>{row.precision}</Table.Td>
                <Table.Td style={cellStyle(row.key, 'recall')} onClick={() => handleCellClick(row.key, 'recall')}>{row.recall}</Table.Td>
                <Table.Td style={cellStyle(row.key, 'f1_score')} onClick={() => handleCellClick(row.key, 'f1_score')}>{row.f1Score}</Table.Td>
                <Table.Td style={cellStyle(row.key, 'auc')} onClick={() => handleCellClick(row.key, 'auc')}>{row.auc}</Table.Td>
                <Table.Td style={cellStyle(row.key, 'train_time')} onClick={() => handleCellClick(row.key, 'train_time')}>{row.trainTime}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
