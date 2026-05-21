'use client';

/**
 * hover_card-mui-T05: Expand 'Usage limits' inside hover card
 *
 * Layout: isolated_card centered, light theme.
 *
 * The card shows a subscription summary line with a "Plan limits" label rendered as a small underlined text.
 * - Hovering "Plan limits" opens a MUI Tooltip/Popper-based hover card with rich content.
 * - The hover card body contains:
 *   * A brief summary line ("This plan includes …")
 *   * A collapsed disclosure row labeled "Usage limits" with a chevron indicator
 * - Clicking "Usage limits" expands an additional list (requests/day, seats, storage).
 *
 * Instances: 1 hover card.
 * Initial state: closed and disclosure collapsed.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, Button, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && expanded && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, expanded, onSuccess]);

  const hoverCardContent = (
    <Card 
      sx={{ minWidth: 260, boxShadow: 3 }}
      data-testid="hover-card-content"
      data-cb-instance="Plan limits"
      data-details-expanded={expanded}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Pro Plan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          This plan includes advanced features and priority support.
        </Typography>
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          data-testid="usage-limits-button"
          sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
        >
          Usage limits
        </Button>
        <Collapse in={expanded}>
          <Box sx={{ mt: 1.5, pl: 1, borderLeft: '2px solid #e0e0e0' }}>
            <Typography variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
              • 10,000 requests/day
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
              • 25 team seats
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              • 100GB storage
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Subscription</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Current Plan
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight={500}>Pro</Typography>
            <Tooltip
              title={hoverCardContent}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => {
                setOpen(false);
                setExpanded(false);
              }}
              arrow={false}
              placement="bottom"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'transparent',
                    p: 0,
                    maxWidth: 'none'
                  }
                }
              }}
            >
              <Typography
                variant="body2"
                data-testid="plan-limits-trigger"
                data-cb-instance="Plan limits"
                sx={{ 
                  color: '#1976d2', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Plan limits
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
