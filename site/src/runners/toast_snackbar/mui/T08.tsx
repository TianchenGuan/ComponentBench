'use client';

/**
 * toast_snackbar-mui-T08: Undo archive from Inbox table via snackbar UNDO
 *
 * setup_description:
 * Scene uses a table_cell layout with medium-to-high clutter: an "Inbox" table lists message threads with columns (Name, Last message, Actions).
 * Each row has an icon-only "Archive" action button. The target row is "Project Alpha".
 * Clicking Archive on any row opens a MUI **Snackbar** with message "Conversation archived" and an action button "UNDO".
 * The snackbar is configured to auto-hide relatively quickly; if it disappears, the user must re-archive to bring it back.
 * Clicking "UNDO" shows a follow-up snackbar message "Conversation restored".
 *
 * success_trigger: A snackbar becomes visible with message exactly "Conversation restored".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Button,
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import type { TaskComponentProps } from '../types';

const inbox = [
  { id: '1', name: 'Project Alpha', lastMessage: 'Meeting scheduled for tomorrow' },
  { id: '2', name: 'Design Review', lastMessage: 'Feedback on mockups' },
  { id: '3', name: 'Budget Update', lastMessage: 'Q4 numbers are in' },
  { id: '4', name: 'Team Standup', lastMessage: 'Notes from Monday' },
  { id: '5', name: 'Client Proposal', lastMessage: 'Draft ready for review' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [restoredOpen, setRestoredOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (restoredOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [restoredOpen, onSuccess]);

  const handleArchive = () => {
    setArchiveOpen(true);
  };

  const handleUndo = () => {
    setArchiveOpen(false);
    setRestoredOpen(true);
  };

  const handleArchiveClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setArchiveOpen(false);
  };

  const handleRestoredClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setRestoredOpen(false);
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Inbox</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Last message</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inbox.map((row) => (
                <TableRow key={row.id} data-row-id={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.lastMessage}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={handleArchive}
                      aria-label={`Archive ${row.name}`}
                      data-testid={`archive-row-${row.id}`}
                    >
                      <ArchiveIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <Snackbar
        open={archiveOpen}
        autoHideDuration={5000}
        onClose={handleArchiveClose}
        message={<span data-testid="snackbar-message-archive">Conversation archived</span>}
        action={
          <Button color="primary" size="small" onClick={handleUndo} data-testid="undo-btn">
            UNDO
          </Button>
        }
        data-testid="snackbar-archive"
      />

      <Snackbar
        open={restoredOpen}
        autoHideDuration={4000}
        onClose={handleRestoredClose}
        message={<span data-testid="snackbar-message-restored">Conversation restored</span>}
        data-testid="snackbar-restored"
      />
    </Card>
  );
}
