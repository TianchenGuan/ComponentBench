'use client';

/**
 * window_splitter-mui-v2-T05: Drawer split — Secondary Map/Details to 35% and Apply
 *
 * "Preview layouts" opens a right Drawer with stacked splitters: Primary — Editor/Preview
 * and Secondary — Map/Details (Map left). Draft until Apply. Footer Cancel / Apply.
 *
 * Success: Map (left) 35% ±2% on "Secondary — Map/Details" after "Apply".
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Button,
  Drawer,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import { TwoPanelSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

function LabeledRowSplit({
  label,
  groupDomId,
  leftLabel,
  rightLabel,
  leftId,
  rightId,
  defaultLeft,
  onLayout,
}: {
  label: string;
  groupDomId: string;
  leftLabel: string;
  rightLabel: string;
  leftId: string;
  rightId: string;
  defaultLeft: number;
  onLayout: (leftPct: number, rightPct: number) => void;
}) {
  const handleLayout = useCallback(
    (layout: Record<string, number>) => {
      const a = layout[leftId];
      const b = layout[rightId];
      if (a !== undefined && b !== undefined) onLayout(a, b);
    },
    [leftId, rightId, onLayout],
  );

  return (
    <Box data-instance-label={label}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ height: 200, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}>
        <TwoPanelSplit
          leftId={leftId}
          rightId={rightId}
          defaultLeftPct={defaultLeft}
          onLayoutChange={handleLayout}
          data-testid={`splitter-${groupDomId}`}
          leftContent={
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover',
              }}
            >
              <Typography fontWeight={600}>{leftLabel}</Typography>
            </Box>
          }
          rightContent={
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.200',
              }}
            >
              <Typography fontWeight={600}>{rightLabel}</Typography>
            </Box>
          }
        />
      </Box>
    </Box>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [drawerKey, setDrawerKey] = useState(0);
  const [primaryLeft, setPrimaryLeft] = useState(50);
  const [mapPct, setMapPct] = useState(50);
  const successFired = useRef(false);

  const onPrimary = useCallback((l: number, _r: number) => {
    setPrimaryLeft(l);
  }, []);

  const onSecondary = useCallback((l: number, _r: number) => {
    setMapPct(l);
  }, []);

  const handleApply = () => {
    if (successFired.current) return;
    const primaryOk = primaryLeft >= 48 && primaryLeft <= 52;
    const mapOk = mapPct >= 33 && mapPct <= 37;
    if (primaryOk && mapOk) {
      successFired.current = true;
      onSuccess();
    }
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 400 }} variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Layout previews open in a side drawer. Adjust splits, then apply.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            setDrawerKey((k) => k + 1);
            setPrimaryLeft(50);
            setMapPct(50);
            setOpen(true);
          }}
        >
          Preview layouts
        </Button>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 380, p: 2 } }}>
          <Typography variant="h6" gutterBottom>
            Preview layouts
          </Typography>
          <Stack key={drawerKey} spacing={2} divider={<Divider flexItem />}>
            <LabeledRowSplit
              label="Primary — Editor/Preview"
              groupDomId="drawer-primary-split"
              leftId="primary_editor"
              rightId="primary_preview"
              leftLabel="Editor"
              rightLabel="Preview"
              defaultLeft={50}
              onLayout={onPrimary}
            />
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              Editor: {primaryLeft.toFixed(0)}% · Preview: {(100 - primaryLeft).toFixed(0)}%
            </Typography>

            <LabeledRowSplit
              label="Secondary — Map/Details"
              groupDomId="drawer-secondary-split"
              leftId="secondary_map"
              rightId="secondary_details"
              leftLabel="Map"
              rightLabel="Details"
              defaultLeft={50}
              onLayout={onSecondary}
            />
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              Map: {mapPct.toFixed(0)}% · Details: {(100 - mapPct).toFixed(0)}%
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleApply}>
              Apply
            </Button>
          </Stack>
        </Drawer>
      </CardContent>
    </Card>
  );
}
