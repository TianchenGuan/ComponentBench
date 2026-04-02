'use client';

/**
 * rating-mui-T10: Modal with two ratings: set Issue resolution to 2 and confirm (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: modal_flow. The page shows a support call summary with a button labeled "Rate support call".
 * Clicking the button opens a MUI Dialog.
 * Inside the Dialog there are two rating rows:
 *   • "Agent politeness" - displayed as a read-only MUI Rating pre-set to 5.
 *   • "Issue resolution" - an editable MUI Rating with max=5 and precision=1.
 * Dialog actions: "Cancel" and "Confirm rating".
 * Initial state when dialog opens: Issue resolution = 0 (empty).
 * Success requires setting the Issue resolution rating to 2 and clicking "Confirm rating".
 * 
 * Success: Target rating value equals 2 out of 5 on "Issue resolution" AND "Confirm rating" is clicked.
 */

import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Rating, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, Box 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [issueResolution, setIssueResolution] = useState<number | null>(null);

  const handleOpenDialog = () => {
    setIssueResolution(null); // Reset rating when opening
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    if (issueResolution === 2) {
      setIsDialogOpen(false);
      onSuccess();
    } else {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Support call summary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your call with Agent #1234 has ended. Please take a moment to rate your experience.
          </Typography>
          <Button variant="contained" onClick={handleOpenDialog}>
            Rate support call
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCancel}>
        <DialogTitle>Rate support call</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography component="legend" sx={{ mb: 1 }}>
                Agent politeness
              </Typography>
              <Rating
                value={5}
                readOnly
                data-testid="rating-agent-politeness"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                (read-only)
              </Typography>
            </Box>
            
            <Box>
              <Typography component="legend" sx={{ mb: 1 }}>
                Issue resolution
              </Typography>
              <Rating
                value={issueResolution}
                onChange={(_, newValue) => setIssueResolution(newValue)}
                precision={1}
                data-testid="rating-issue-resolution"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" data-testid="confirm-rating">
            Confirm rating
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
