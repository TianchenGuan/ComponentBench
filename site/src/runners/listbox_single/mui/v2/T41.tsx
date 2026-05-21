'use client';

/**
 * listbox_single-mui-v2-T41: Plan listboxes: match the star cue in Target plan and apply
 *
 * Subscription panel with two MUI List listboxes: "Current plan" (initial: Pro, must stay)
 * and "Target plan" (initial: Starter). Each row has icon+text: Starter (⭕), Pro (⭐),
 * Enterprise (💎). A reference badge shows only the star icon (⭐).
 * Footer: "Apply plan". Committed only on Apply.
 *
 * Success: Target plan = "pro", Current plan still "pro", "Apply plan" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, List, ListItemButton,
  ListItemText, ListItemIcon, Chip, Divider, Box, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const planOptions = [
  { value: 'starter', label: 'Starter', icon: '⭕' },
  { value: 'pro', label: 'Pro', icon: '⭐' },
  { value: 'enterprise', label: 'Enterprise', icon: '💎' },
];

export default function T41({ onSuccess }: TaskComponentProps) {
  const [currentPlan, setCurrentPlan] = useState<string>('pro');
  const [targetPlan, setTargetPlan] = useState<string>('starter');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && targetPlan === 'pro' && currentPlan === 'pro') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, targetPlan, currentPlan, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 500 }}>
        <Box
          data-testid="star-plan-cue"
          sx={{ mb: 1.5, display: 'inline-block', p: '8px 16px', bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}
        >
          <span style={{ fontSize: 28 }}>⭐</span>
          <Typography variant="caption" display="block" color="text.secondary">Reference</Typography>
        </Box>

        <Card sx={{ width: 460 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Subscription</Typography>

            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Current plan</Typography>
                <List
                  data-cb-listbox-root
                  data-cb-instance="current"
                  data-cb-selected-value={currentPlan}
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                  dense
                >
                  {planOptions.map(opt => (
                    <ListItemButton
                      key={opt.value}
                      selected={currentPlan === opt.value}
                      onClick={() => { setCurrentPlan(opt.value); setApplied(false); }}
                      data-cb-option-value={opt.value}
                    >
                      <ListItemIcon sx={{ minWidth: 32, fontSize: 16 }}>{opt.icon}</ListItemIcon>
                      <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 13 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Target plan</Typography>
                <List
                  data-cb-listbox-root
                  data-cb-instance="target"
                  data-cb-selected-value={targetPlan}
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                  dense
                >
                  {planOptions.map(opt => (
                    <ListItemButton
                      key={opt.value}
                      selected={targetPlan === opt.value}
                      onClick={() => { setTargetPlan(opt.value); setApplied(false); }}
                      data-cb-option-value={opt.value}
                    >
                      <ListItemIcon sx={{ minWidth: 32, fontSize: 16 }}>{opt.icon}</ListItemIcon>
                      <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 13 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1}>
                <Chip label="Monthly" size="small" />
                <Chip label="Auto-renew" size="small" color="success" />
              </Stack>
              <Button variant="contained" size="small" onClick={() => setApplied(true)}>Apply plan</Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
