'use client';

/**
 * file_list_manager-mui-T09: Delete the document that matches a preview thumbnail
 *
 * setup_description: The Documents manager is placed near the top-left of the viewport (top_left placement).
 * Above the list, a "Reference" panel shows a small preview thumbnail of the target PDF (first page image).
 * The list contains 12 PDF items with very similar names (e.g., document-01.pdf, document-02.pdf, ...).
 * Each item includes its own small thumbnail and a trailing delete IconButton. Deletion is immediate.
 *
 * Success: The file matching the Reference preview thumbnail is removed from the Documents list.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

// Reference image is pdf-07 (index 6 in the list)
const TARGET_ID = 'pdf-07';
const REFERENCE_COLOR = '#F7DC6F';

interface DocFile {
  id: string;
  name: string;
  color: string;
}

const initialDocs: DocFile[] = [
  { id: 'pdf-01', name: 'document-01.pdf', color: '#FF6B6B' },
  { id: 'pdf-02', name: 'document-02.pdf', color: '#4ECDC4' },
  { id: 'pdf-03', name: 'document-03.pdf', color: '#96CEB4' },
  { id: 'pdf-04', name: 'document-04.pdf', color: '#45B7D1' },
  { id: 'pdf-05', name: 'document-05.pdf', color: '#FFEAA7' },
  { id: 'pdf-06', name: 'document-06.pdf', color: '#DDA0DD' },
  { id: 'pdf-07', name: 'document-07.pdf', color: REFERENCE_COLOR }, // Target
  { id: 'pdf-08', name: 'document-08.pdf', color: '#98D8C8' },
  { id: 'pdf-09', name: 'document-09.pdf', color: '#BB8FCE' },
  { id: 'pdf-10', name: 'document-10.pdf', color: '#85C1E9' },
  { id: 'pdf-11', name: 'document-11.pdf', color: '#F1948A' },
  { id: 'pdf-12', name: 'document-12.pdf', color: '#AED6F1' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [docs, setDocs] = useState<DocFile[]>(initialDocs);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const targetExists = docs.some((d) => d.id === TARGET_ID);
    const othersCount = docs.filter((d) => d.id !== TARGET_ID).length;

    if (!targetExists && othersCount === 11) {
      setCompleted(true);
      onSuccess();
    }
  }, [docs, completed, onSuccess]);

  const handleDelete = (docId: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <Card sx={{ width: 450 }} data-testid="flm-root">
      <CardHeader title="Documents" />
      <CardContent>
        {/* Reference panel */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="textSecondary">
            Reference
          </Typography>
          <Box
            data-testid="ref-preview-1"
            sx={{
              width: 80,
              height: 60,
              bgcolor: REFERENCE_COLOR,
              borderRadius: 1,
              mt: 1,
            }}
          />
        </Box>

        {/* Documents list */}
        <Box data-testid="flm-Documents" sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List dense>
            {docs.map((doc) => (
              <ListItem
                key={doc.id}
                data-testid={`flm-row-${doc.id}`}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`Delete ${doc.name}`}
                    onClick={() => handleDelete(doc.id)}
                    data-testid="flm-action-delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Box
                  sx={{
                    width: 32,
                    height: 24,
                    bgcolor: doc.color,
                    borderRadius: 0.5,
                    mr: 1.5,
                  }}
                  data-testid={`flm-thumbnail-${doc.id}`}
                />
                <ListItemText primary={doc.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}
