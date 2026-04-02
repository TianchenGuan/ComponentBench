'use client';

/**
 * dialog_modal-mui-v2-T02: Visual match (shield) → Audit trail → backdrop dismiss
 */

import React, { useState, useRef } from 'react';
import SecurityIcon from '@mui/icons-material/Security';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

type Dlg = 'none' | 'chat' | 'audit' | 'billing';

const copy: Record<Exclude<Dlg, 'none'>, { title: string; body: string }> = {
  chat: { title: 'Chat theme', body: 'Pick a chat color scheme.' },
  audit: { title: 'Audit trail', body: 'Immutable audit entries for compliance.' },
  billing: { title: 'Billing summary', body: 'Monthly rollups and tax lines.' },
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState<Dlg>('none');
  const successCalledRef = useRef(false);

  const open = (d: Exclude<Dlg, 'none'>) => {
    setActive(d);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: copy[d].title,
      last_opened_instance: copy[d].title,
    };
  };

  const handleClose = (_: unknown, reason: string) => {
    if (reason !== 'backdropClick' || active === 'none') return;
    const prev = active;
    const title = copy[prev].title;
    setActive('none');
    window.__cbModalState = {
      open: false,
      close_reason: 'backdrop_click',
      modal_instance: title,
      last_opened_instance: title,
    };
    if (prev === 'audit' && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const cur = active === 'none' ? null : copy[active];

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Chip
        icon={<SecurityIcon sx={{ color: '#b0b8c4 !important' }} />}
        label="Reference: silver shield badge"
        sx={{ mb: 2, borderColor: '#cfd4dc' }}
        variant="outlined"
        data-testid="cb-reference-shield"
      />
      <Stack spacing={1.5}>
        <Card variant="outlined">
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ChatBubbleOutlineIcon color="action" />
            <Box flex={1}>
              <Typography variant="subtitle2">Workspace appearance</Typography>
              <Typography variant="caption" color="text.secondary">
                Chat bubbles and density
              </Typography>
            </Box>
            <Button size="small" onClick={() => open('chat')} data-testid="cb-open-chat-theme">
              Open dialog
            </Button>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon sx={{ color: '#b0b8c4' }} />
            <Box flex={1}>
              <Typography variant="subtitle2">Security & compliance</Typography>
              <Typography variant="caption" color="text.secondary">
                Matches reference shield
              </Typography>
            </Box>
            <Button size="small" onClick={() => open('audit')} data-testid="cb-open-audit-trail">
              Open dialog
            </Button>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReceiptLongIcon color="action" />
            <Box flex={1}>
              <Typography variant="subtitle2">Finance</Typography>
              <Typography variant="caption" color="text.secondary">
                Invoices and usage
              </Typography>
            </Box>
            <Button size="small" onClick={() => open('billing')} data-testid="cb-open-billing-summary">
              Open dialog
            </Button>
          </CardContent>
        </Card>
      </Stack>

      <Dialog
        open={active !== 'none'}
        onClose={handleClose}
        disableEscapeKeyDown
        aria-labelledby="match-dlg-title"
      >
        {cur && (
          <>
            <DialogTitle id="match-dlg-title">{cur.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{cur.body}</DialogContentText>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
