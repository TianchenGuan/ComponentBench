'use client';

/**
 * popover-mui-T04: Open dashboard popover that matches the Reference chip (2 instances)
 *
 * Dashboard layout with two metric cards side-by-side: 'Revenue' and 'Churn'.
 * Each card has a small IconButton (ⓘ) in its header that opens a MUI Popover on click.
 * At the top of the dashboard, a 'Reference' chip shows the target card using mixed cues:
 *   - text: the card name (Revenue or Churn)
 *   - a small colored dot matching the card's accent color
 * The agent must use the reference chip to decide which card's info popover to open.
 * Popover titles are 'Revenue breakdown' and 'Churn breakdown'.
 * Initial state: both popovers are closed.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, Typography, IconButton, Popover, Box, Chip, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { TaskComponentProps } from '../types';

const CARD_OPTIONS = ['Revenue', 'Churn'] as const;

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const targetCard = useMemo(() => {
    const index = Math.floor(Math.random() * CARD_OPTIONS.length);
    return CARD_OPTIONS[index];
  }, []);

  const [revenueAnchor, setRevenueAnchor] = useState<HTMLButtonElement | null>(null);
  const [churnAnchor, setChurnAnchor] = useState<HTMLButtonElement | null>(null);
  const successCalledRef = useRef(false);

  const revenueOpen = Boolean(revenueAnchor);
  const churnOpen = Boolean(churnAnchor);

  useEffect(() => {
    const targetOpen = targetCard === 'Revenue' ? revenueOpen : churnOpen;
    const otherOpen = targetCard === 'Revenue' ? churnOpen : revenueOpen;

    if (targetOpen && !otherOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [revenueOpen, churnOpen, targetCard, onSuccess]);

  const handleRevenueClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRevenueAnchor(event.currentTarget);
  };

  const handleChurnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setChurnAnchor(event.currentTarget);
  };

  const colors = {
    Revenue: '#4caf50',
    Churn: '#f44336',
  };

  return (
    <Box sx={{ width: 500 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle2">Reference:</Typography>
        <Chip
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: colors[targetCard],
                }}
              />
              {targetCard}
            </Box>
          }
          size="small"
          variant="outlined"
          data-testid="reference-card-chip"
          data-ref-card={targetCard.toLowerCase()}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Use the Reference chip to choose the correct info popover.
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: colors.Revenue }}>
                    Revenue
                  </Typography>
                  <Typography variant="h5">$24,500</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={handleRevenueClick}
                  data-testid="popover-target-revenue"
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
          <Popover
            open={revenueOpen}
            anchorEl={revenueAnchor}
            onClose={() => setRevenueAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            data-testid="popover-revenue"
          >
            <Box sx={{ p: 2, maxWidth: 200 }}>
              <Typography variant="subtitle2" gutterBottom>Revenue breakdown</Typography>
              <Typography variant="body2">Total revenue from all channels this month.</Typography>
            </Box>
          </Popover>
        </Grid>
        
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: colors.Churn }}>
                    Churn
                  </Typography>
                  <Typography variant="h5">2.3%</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={handleChurnClick}
                  data-testid="popover-target-churn"
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
          <Popover
            open={churnOpen}
            anchorEl={churnAnchor}
            onClose={() => setChurnAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            data-testid="popover-churn"
          >
            <Box sx={{ p: 2, maxWidth: 200 }}>
              <Typography variant="subtitle2" gutterBottom>Churn breakdown</Typography>
              <Typography variant="body2">Customer churn rate for the current period.</Typography>
            </Box>
          </Popover>
        </Grid>
      </Grid>
    </Box>
  );
}
