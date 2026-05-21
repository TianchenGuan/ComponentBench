'use client';

/**
 * file_list_manager-mui-T08: Drag-reorder in dark theme
 *
 * setup_description: The page is in dark theme. The Attachments manager is an isolated centered card with a
 * sortable MUI List. Each row has a small drag handle icon (grip) on the left; dragging by the handle reorders
 * items. The list contains 6 files in this initial order: draft.md, figures.png, summary.txt, final_report.pdf,
 * appendix.pdf, raw-data.csv. The goal requires placing "final_report.pdf" immediately before "summary.txt".
 *
 * Success: The Attachments list order is: draft.md, figures.png, final_report.pdf, summary.txt, appendix.pdf, raw-data.csv.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { DragIndicator as DragIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import type { TaskComponentProps, FileItem } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'draft.md', type: 'MD', size: 12000 },
  { id: 'f2', name: 'figures.png', type: 'PNG', size: 234000 },
  { id: 'f3', name: 'summary.txt', type: 'TXT', size: 4500 },
  { id: 'f4', name: 'final_report.pdf', type: 'PDF', size: 312000 },
  { id: 'f5', name: 'appendix.pdf', type: 'PDF', size: 198000 },
  { id: 'f6', name: 'raw-data.csv', type: 'CSV', size: 567000 },
];

const expectedOrder = [
  'draft.md',
  'figures.png',
  'final_report.pdf',
  'summary.txt',
  'appendix.pdf',
  'raw-data.csv',
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const currentOrder = files.map((f) => f.name);
    const isCorrect = expectedOrder.every((name, i) => currentOrder[i] === name);

    if (isCorrect) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newFiles = [...files];
      const [draggedItem] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(index, 0, draggedItem);
      setFiles(newFiles);
      setDraggedIndex(index);
    },
    [draggedIndex, files]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Card sx={{ width: 400, bgcolor: 'background.paper' }} data-testid="flm-root">
        <CardHeader title="Attachments" />
        <CardContent data-testid="flm-Attachments">
          <List>
            {files.map((file, index) => (
              <ListItem
                key={file.id}
                data-testid={`flm-row-${file.id}`}
                sx={{
                  bgcolor: draggedIndex === index ? 'action.hover' : 'transparent',
                }}
              >
                <ListItemIcon
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  sx={{ cursor: 'grab', minWidth: 32 }}
                  aria-label="Reorder"
                  data-testid={`flm-drag-handle-${index}`}
                >
                  <DragIcon />
                </ListItemIcon>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
