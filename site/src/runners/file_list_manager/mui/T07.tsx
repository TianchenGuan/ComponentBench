'use client';

/**
 * file_list_manager-mui-T07: Reset a modified file list back to the original
 *
 * setup_description: The Attachments manager appears near the bottom-left of the viewport (bottom_left placement)
 * in an isolated card. At the top of the manager is a small warning banner: "You have unsaved changes" and a
 * button labeled "Reset changes". The list is intentionally not in its original state: (1) the file order has
 * been changed so "summary.txt" appears above "final_report.pdf", and (2) the file "old-data.csv" is marked as
 * Archived (badge "Archived"). Clicking "Reset changes" restores the original order and clears all temporary flags.
 *
 * Success: The Attachments manager matches the baseline snapshot: original order restored and temporary flags cleared.
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
  Button,
  Alert,
  Chip,
} from '@mui/material';
import { InsertDriveFile as FileIcon } from '@mui/icons-material';
import type { TaskComponentProps, FileItem } from '../types';

interface FileWithArchived extends FileItem {
  archived?: boolean;
}

// Original baseline order
const baselineFiles: FileWithArchived[] = [
  { id: 'f1', name: 'final_report.pdf', type: 'PDF', size: 312000, archived: false },
  { id: 'f2', name: 'summary.txt', type: 'TXT', size: 4500, archived: false },
  { id: 'f3', name: 'old-data.csv', type: 'CSV', size: 89000, archived: false },
  { id: 'f4', name: 'notes.docx', type: 'DOCX', size: 67000, archived: false },
];

// Modified state (different order + archived flag)
const modifiedFiles: FileWithArchived[] = [
  { id: 'f2', name: 'summary.txt', type: 'TXT', size: 4500, archived: false },
  { id: 'f1', name: 'final_report.pdf', type: 'PDF', size: 312000, archived: false },
  { id: 'f3', name: 'old-data.csv', type: 'CSV', size: 89000, archived: true },
  { id: 'f4', name: 'notes.docx', type: 'DOCX', size: 67000, archived: false },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileWithArchived[]>(modifiedFiles);
  const [hasChanges, setHasChanges] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const orderMatches = files.every((f, i) => f.id === baselineFiles[i].id);
    const noArchived = files.every((f) => !f.archived);

    if (orderMatches && noArchived) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleReset = () => {
    setFiles(baselineFiles.map((f) => ({ ...f })));
    setHasChanges(false);
  };

  return (
    <Card sx={{ width: 400 }} data-testid="flm-root">
      <CardHeader title="Attachments" />
      <CardContent data-testid="flm-Attachments">
        {hasChanges && (
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleReset}
                data-testid="flm-reset-button"
              >
                Reset changes
              </Button>
            }
            sx={{ mb: 2 }}
          >
            You have unsaved changes
          </Alert>
        )}
        <List>
          {files.map((file) => (
            <ListItem key={file.id} data-testid={`flm-row-${file.id}`}>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    {file.name}
                    {file.archived && (
                      <Chip
                        label="Archived"
                        size="small"
                        sx={{ ml: 1 }}
                        data-testid={`flm-archived-${file.id}`}
                      />
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
