'use client';

/**
 * window_splitter-mui-v2-T02: Below-fold secondary card: set Details to 68%
 *
 * Dashboard panel with scroll; chart card and "Primary — Filters" splitter appear first.
 * Target card "Secondary — Metrics" (Summary / Details) is below the fold. Details starts 50%.
 *
 * Success: Details (right) 68% ±2% on instance "Secondary — Metrics".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Card, CardHeader, CardContent } from '@mui/material';
import { TwoPanelSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

function SplitterCard({
  title,
  instanceId,
  onLayout,
}: {
  title: string;
  instanceId: string;
  onLayout: (id: string, summary: number, details: number) => void;
}) {
  const [summaryPct, setSummaryPct] = useState(50);
  const [detailsPct, setDetailsPct] = useState(50);

  const handleLayout = useCallback(
    (layout: Record<string, number>) => {
      const s = layout.summary;
      const d = layout.details;
      if (s !== undefined && d !== undefined) {
        setSummaryPct(s);
        setDetailsPct(d);
        onLayout(instanceId, s, d);
      }
    },
    [instanceId, onLayout],
  );

  return (
    <Card variant="outlined" data-instance-label={instanceId}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'subtitle1' }} />
      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{ height: 200, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}
        >
          <TwoPanelSplit
            leftId="summary"
            rightId="details"
            defaultLeftPct={50}
            onLayoutChange={handleLayout}
            data-testid={`splitter-${instanceId}`}
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
                <Typography fontWeight={600}>Summary</Typography>
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
                <Typography fontWeight={600}>Details</Typography>
              </Box>
            }
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          Summary: {summaryPct.toFixed(0)}% · Details: {detailsPct.toFixed(0)}%
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [metricsDetails, setMetricsDetails] = useState(50);
  const successFired = useRef(false);

  const onLayout = useCallback((id: string, _summary: number, details: number) => {
    if (id === 'Secondary — Metrics') setMetricsDetails(details);
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    if (metricsDetails >= 66 && metricsDetails <= 70) {
      successFired.current = true;
      onSuccess();
    }
  }, [metricsDetails, onSuccess]);

  return (
    <Box sx={{ width: 'min(720px, 100%)' }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Operations dashboard
      </Typography>
      <Box
        sx={{
          maxHeight: '58vh',
          overflow: 'auto',
          pr: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        data-testid="dashboard-scroll-region"
      >
        <Card variant="outlined">
          <CardHeader title="Throughput (24h)" />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 120 }}>
              {[40, 65, 55, 80, 50, 70].map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    height: `${h}%`,
                    bgcolor: 'primary.light',
                    borderRadius: 0.5,
                    opacity: 0.85,
                  }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Distractor chart — not a splitter target.
            </Typography>
          </CardContent>
        </Card>

        <SplitterCard title="Primary — Filters" instanceId="Primary — Filters" onLayout={onLayout} />

        <Box sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Scroll for metrics workspace ↓
          </Typography>
        </Box>

        <SplitterCard title="Secondary — Metrics" instanceId="Secondary — Metrics" onLayout={onLayout} />

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Target card summary · Details pane: {metricsDetails.toFixed(0)}%
        </Typography>
      </Box>
    </Box>
  );
}
