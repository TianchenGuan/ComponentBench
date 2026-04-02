'use client';

/**
 * file_list_manager-mui-T01: Remove a stray notes file
 *
 * setup_description: A centered card contains one MUI-styled file list manager rendered as a vertical List.
 * Each ListItem shows a file icon, the filename, and a trailing delete IconButton (trash). The list is
 * pre-populated with 6 files including "notes.txt". Clicking the delete icon removes the item immediately
 * and shows a Snackbar message "File removed". No confirmation dialog is used in this task.
 *
 * Success: "notes.txt" is not present in the Attachments list. All other files remain present.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Delete as DeleteIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'draft-proposal.docx', type: 'DOCX', size: 128000 },
  { id: 'f3', name: 'receipt.png', type: 'PNG', size: 89000 },
  { id: 'f4', name: 'invoice-feb.pdf', type: 'PDF', size: 156000 },
  { id: 'f5', name: 'notes.txt', type: 'TXT', size: 4500 },
  { id: 'f6', name: 'summary.pdf', type: 'PDF', size: 198000 },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const notesExists = files.some((f) => f.name === 'notes.txt');
    const othersExist = files.length === 5 && !notesExists;

    if (othersExist) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setSnackbarOpen(true);
  };

  return (
    <Card sx={{ width: 400 }} data-testid="flm-root">
      <CardHeader title="Attachments" />
      <CardContent data-testid="flm-Attachments">
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              data-testid={`flm-row-${file.id}`}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`Delete ${file.name}`}
                  onClick={() => handleDelete(file.id)}
                  data-testid="flm-action-delete"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="File removed"
      />
    </Card>
  );
}
