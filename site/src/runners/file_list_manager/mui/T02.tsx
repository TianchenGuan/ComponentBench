'use client';

/**
 * file_list_manager-mui-T02: Rename a scanned image
 *
 * setup_description: One file list manager is shown inside a centered card. The manager is a MUI List with
 * per-item actions. Each item has an Edit (pencil) IconButton. Clicking Edit turns the filename into an inline
 * TextField and shows two controls: a "Save" IconButton and a "Cancel" IconButton. The TextField is prefilled
 * with the current filename.
 *
 * Success: The file originally named "scan_001.jpg" is now named "passport_scan.jpg" in the Attachments list.
 * The rename is committed (not left in edit mode).
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
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'scan_001.jpg', type: 'JPG', size: 245000 },
  { id: 'f2', name: 'scan_002.jpg', type: 'JPG', size: 198000 },
  { id: 'f3', name: 'document.pdf', type: 'PDF', size: 312000 },
  { id: 'f4', name: 'receipt.png', type: 'PNG', size: 89000 },
  { id: 'f5', name: 'notes.txt', type: 'TXT', size: 4500 },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const renamedFile = files.find((f) => f.id === 'f1');
    if (renamedFile && renamedFile.name === 'passport_scan.jpg' && editingId === null) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, editingId, completed, onSuccess]);

  const startEditing = (file: FileItem) => {
    setEditingId(file.id);
    setEditValue(file.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEditing = () => {
    if (editingId && editValue.trim()) {
      setFiles((prev) =>
        prev.map((f) => (f.id === editingId ? { ...f, name: editValue.trim() } : f))
      );
      setEditingId(null);
      setEditValue('');
    }
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
                editingId === file.id ? (
                  <>
                    <IconButton
                      edge="end"
                      aria-label="Save"
                      onClick={saveEditing}
                      data-testid="flm-action-save"
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="Cancel"
                      onClick={cancelEditing}
                      data-testid="flm-action-cancel"
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    edge="end"
                    aria-label={`Edit ${file.name}`}
                    onClick={() => startEditing(file)}
                    disabled={editingId !== null}
                    data-testid="flm-action-edit"
                  >
                    <EditIcon />
                  </IconButton>
                )
              }
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              {editingId === file.id ? (
                <TextField
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  size="small"
                  variant="outlined"
                  autoFocus
                  data-testid="flm-rename-input"
                />
              ) : (
                <ListItemText primary={file.name} />
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
