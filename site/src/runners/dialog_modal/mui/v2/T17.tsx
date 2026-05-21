'use client';

/**
 * dialog_modal-mui-v2-T17: Gateway floating preview — drag bottom-right + Pin here
 */

import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { boundsFromRect, withinBottomRightViewport } from './dragBounds';

type RowKey = 'gateway' | 'billing' | 'search';

const titles: Record<RowKey, string> = {
  gateway: 'Gateway preview',
  billing: 'Billing preview',
  search: 'Search preview',
};

export default function T17({ onSuccess }: TaskComponentProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const rowRef = useRef<RowKey | null>(null);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<RowKey | null>(null);
  const successCalledRef = useRef(false);

  openRef.current = open;
  rowRef.current = row;

  const sync = (extra: Partial<NonNullable<typeof window.__cbModalState>>) => {
    const inst = rowRef.current ? titles[rowRef.current] : 'Gateway preview';
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: inst,
      last_opened_instance: inst,
      layout_saved: false,
      ...extra,
    };
  };

  const PaperComponent = (props: PaperProps) => (
    <Draggable
      nodeRef={paperRef}
      handle="#cb-gateway-preview-drag-title"
      cancel=".MuiDialogContent-root,.MuiDialogActions-root,button,a,input,textarea"
      onStart={() => {
        if (!openRef.current || rowRef.current !== 'gateway') return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        sync({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
      }}
      onStop={() => {
        if (!openRef.current || rowRef.current !== 'gateway') return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        sync({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
      }}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );

  const PaperPlain = (p: PaperProps) => <Paper {...p} />;

  const pin = () => {
    if (successCalledRef.current || rowRef.current !== 'gateway') return;
    const el = paperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!withinBottomRightViewport(r, 50, 50)) return;
    sync({
      last_drag_source: 'title_bar',
      modal_bounds: boundsFromRect(r),
      layout_saved: true,
    });
    successCalledRef.current = true;
    setTimeout(() => onSuccess(), 100);
  };

  return (
    <Box sx={{ minWidth: 440 }}>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
        {['Shard A', 'Shard B', 'Readonly'].map((l) => (
          <Chip key={l} size="small" label={l} variant="outlined" />
        ))}
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell align="right">Preview</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(['gateway', 'billing', 'search'] as RowKey[]).map((key) => (
            <TableRow key={key}>
              <TableCell sx={{ textTransform: 'capitalize' }}>{key}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setRow(key);
                    setOpen(true);
                  }}
                  data-testid={`cb-open-float-${key}`}
                >
                  Open floating preview
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        key={row ?? 'closed'}
        open={open}
        onClose={() => {
          setOpen(false);
          setRow(null);
        }}
        PaperComponent={row === 'gateway' ? PaperComponent : PaperPlain}
        maxWidth="xs"
        fullWidth
        aria-labelledby="cb-gateway-preview-drag-title"
      >
        {row && (
          <>
            <DialogTitle
              id="cb-gateway-preview-drag-title"
              sx={{ cursor: row === 'gateway' ? 'move' : 'default', userSelect: 'none' }}
            >
              {titles[row]}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2">Floating preview for {titles[row]}.</Typography>
            </DialogContent>
            {row === 'gateway' && (
              <DialogActions>
                <Button variant="contained" onClick={pin} data-testid="cb-pin-here">
                  Pin here
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>
    </Box>
  );
}
