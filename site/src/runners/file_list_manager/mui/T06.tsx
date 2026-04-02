'use client';

/**
 * file_list_manager-mui-T06: Search and mark the correct file as Primary
 *
 * setup_description: The page contains two similar file list managers (instances=2): "Shared files" and
 * "Private files". Each manager has a search TextField labeled "Search" that filters visible rows by filename
 * substring. Rows include a star IconButton used to mark a single Primary file (filled star = Primary).
 * Initially, in "Shared files" a different document is Primary, and "warranty-card.pdf" is not.
 *
 * Success: In the "Shared files" manager, the Primary file is "warranty-card.pdf".
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import type { TaskComponentProps, FileItem } from '../types';

const sharedFiles: FileItem[] = [
  { id: 's1', name: 'contract.pdf', type: 'PDF', size: 245000, primary: true },
  { id: 's2', name: 'warranty.pdf', type: 'PDF', size: 89000, primary: false },
  { id: 's3', name: 'warranty-card.pdf', type: 'PDF', size: 78000, primary: false },
  { id: 's4', name: 'warranty-card-old.pdf', type: 'PDF', size: 112000, primary: false },
  { id: 's5', name: 'manual.pdf', type: 'PDF', size: 234000, primary: false },
  { id: 's6', name: 'receipt.pdf', type: 'PDF', size: 56000, primary: false },
];

const privateFiles: FileItem[] = [
  { id: 'p1', name: 'warranty-card.pdf', type: 'PDF', size: 67000, primary: false },
  { id: 'p2', name: 'notes.txt', type: 'TXT', size: 4500, primary: false },
  { id: 'p3', name: 'draft.docx', type: 'DOCX', size: 123000, primary: true },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [sharedData, setSharedData] = useState<FileItem[]>(sharedFiles);
  const [privateData, setPrivateData] = useState<FileItem[]>(privateFiles);
  const [sharedSearch, setSharedSearch] = useState('');
  const [privateSearch, setPrivateSearch] = useState('');
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const primaryFile = sharedData.find((f) => f.primary);
    if (primaryFile && primaryFile.name === 'warranty-card.pdf') {
      setCompleted(true);
      onSuccess();
    }
  }, [sharedData, completed, onSuccess]);

  const handleSharedPrimary = (fileId: string) => {
    setSharedData((prev) =>
      prev.map((f) => ({ ...f, primary: f.id === fileId }))
    );
  };

  const handlePrivatePrimary = (fileId: string) => {
    setPrivateData((prev) =>
      prev.map((f) => ({ ...f, primary: f.id === fileId }))
    );
  };

  const filteredShared = useMemo(() => {
    if (!sharedSearch.trim()) return sharedData;
    return sharedData.filter((f) =>
      f.name.toLowerCase().includes(sharedSearch.toLowerCase())
    );
  }, [sharedData, sharedSearch]);

  const filteredPrivate = useMemo(() => {
    if (!privateSearch.trim()) return privateData;
    return privateData.filter((f) =>
      f.name.toLowerCase().includes(privateSearch.toLowerCase())
    );
  }, [privateData, privateSearch]);

  const renderList = (
    files: FileItem[],
    onPrimaryClick: (id: string) => void,
    search: string,
    setSearch: (v: string) => void,
    testId: string
  ) => (
    <Box data-testid={testId}>
      <TextField
        label="Search"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
        data-testid={`${testId}-search`}
      />
      <List dense>
        {files.map((file) => (
          <ListItem
            key={file.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="Set primary"
                onClick={() => onPrimaryClick(file.id)}
                data-testid={`flm-star-${file.id}`}
              >
                {file.primary ? <StarIcon color="warning" /> : <StarBorderIcon />}
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
    </Box>
  );

  return (
    <Card sx={{ width: 700 }} data-testid="flm-root">
      <CardContent>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Shared files
            </Typography>
            {renderList(filteredShared, handleSharedPrimary, sharedSearch, setSharedSearch, 'flm-Shared files')}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Private files
            </Typography>
            {renderList(filteredPrivate, handlePrivatePrimary, privateSearch, setPrivateSearch, 'flm-Private files')}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
