'use client';

/**
 * dialog_modal-mui-v2-T15: Visual match purple → Palette dialog → top-right drag
 */

import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { boundsFromRect, withinTopRightViewport } from './dragBounds';

type Panel = 'logs' | 'palette' | 'queue';

const titles: Record<Panel, string> = {
  logs: 'Logs',
  palette: 'Palette',
  queue: 'Queue',
};

export default function T15({ onSuccess }: TaskComponentProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const activeRef = useRef<Panel | null>(null);
  const [active, setActive] = useState<Panel | null>(null);
  const successCalledRef = useRef(false);

  openRef.current = active !== null;
  activeRef.current = active;

  const pushOpen = (panel: Panel, extra: Partial<NonNullable<typeof window.__cbModalState>>) => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: titles[panel],
      last_opened_instance: titles[panel],
      ...extra,
    };
  };

  const PaperComponent = (props: PaperProps) => (
    <Draggable
      nodeRef={paperRef}
      handle="#cb-panel-dlg-title"
      cancel=".MuiDialogContent-root,.MuiDialogActions-root,button,a,input,textarea"
      onStart={() => {
        if (!openRef.current || activeRef.current !== 'palette') return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        pushOpen('palette', { last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
      }}
      onStop={() => {
        if (!openRef.current || activeRef.current !== 'palette') return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        pushOpen('palette', { last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
        if (withinTopRightViewport(r, 40, 40) && !successCalledRef.current) {
          successCalledRef.current = true;
          setTimeout(() => onSuccess(), 100);
        }
      }}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );

  const PaperPlain = (p: PaperProps) => <Paper {...p} />;

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Chip
        sx={{ mb: 2, borderColor: '#7b1fa2', '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 1 } }}
        variant="outlined"
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#7b1fa2' }} />
            Target floating panel
          </Box>
        }
        data-testid="cb-reference-purple"
      />
      <Stack spacing={1}>
        <Card variant="outlined">
          <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography flex={1}>Stream logs</Typography>
            <Button size="small" onClick={() => setActive('logs')} data-testid="cb-open-logs-panel">
              Open panel
            </Button>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#7b1fa2', borderRadius: 0.5 }} />
            <Typography flex={1}>Theme palette</Typography>
            <Button size="small" onClick={() => setActive('palette')} data-testid="cb-open-palette-panel">
              Open panel
            </Button>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography flex={1}>Job queue</Typography>
            <Button size="small" onClick={() => setActive('queue')} data-testid="cb-open-queue-panel">
              Open panel
            </Button>
          </CardContent>
        </Card>
      </Stack>

      <Dialog
        key={active ?? 'closed'}
        open={active !== null}
        onClose={() => setActive(null)}
        PaperComponent={active === 'palette' ? PaperComponent : PaperPlain}
        aria-labelledby="cb-panel-dlg-title"
        maxWidth="xs"
        fullWidth
      >
        {active && (
          <>
            <DialogTitle
              id="cb-panel-dlg-title"
              sx={{
                cursor: active === 'palette' ? 'move' : 'default',
                userSelect: 'none',
                ...(active === 'palette'
                  ? { bgcolor: '#7b1fa2', color: 'common.white' }
                  : {}),
              }}
            >
              {titles[active]}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2">Panel content for {titles[active]}.</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
