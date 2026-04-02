'use client';

/**
 * select_custom_multi-mui-v2-T16: Long dropdown metrics field with repeated re-entry
 *
 * Inline surface, compact spacing, small scale, bottom-right placement, medium clutter.
 * Observability card with chart legend and icon buttons.
 * MUI Autocomplete (multiple, filterSelectedOptions) labeled "Tracked metrics".
 * 50+ metric names in long dropdown with internal scroll.
 * Popup closes after each selection → repeated re-entry required.
 * Initial: [API latency p95, Throughput]. Target: [API latency, Error rate, Retry count, Queue depth].
 * Auto-apply (no save button).
 *
 * Success: Tracked metrics = {API latency, Error rate, Retry count, Queue depth}.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Autocomplete, TextField, Chip, Typography, Paper, Box, IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const metricOptions = [
  'API latency', 'API latency p95', 'API latency p99', 'Error rate', 'Error budget',
  'Retry count', 'Retry budget', 'Queue depth', 'Queue age', 'Throughput', 'Saturation',
  'CPU usage', 'Memory usage', 'Disk I/O', 'Network in', 'Network out',
  'GC pause time', 'Thread count', 'Connection pool', 'Cache hit rate',
  'Cache miss rate', 'Request count', 'Response time', 'Availability',
  'Uptime', 'Downtime', 'Incident count', 'MTTR', 'MTBF',
  'Deployment frequency', 'Change failure rate', 'Lead time', 'Recovery time',
  'Error count', 'Warning count', 'Log volume', 'Trace count',
  'Span duration', 'Service latency', 'Database latency', 'DNS latency',
  'TLS handshake time', 'Connection time', 'Transfer time', 'TTFB',
  'Page load time', 'FCP', 'LCP', 'CLS', 'FID', 'INP',
];

export default function T16({ onSuccess }: TaskComponentProps) {
  const [trackedMetrics, setTrackedMetrics] = useState<string[]>(['API latency p95', 'Throughput']);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (setsEqual(trackedMetrics, ['API latency', 'Error rate', 'Retry count', 'Queue depth'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [trackedMetrics, onSuccess]);

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, maxWidth: 420 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Observability</Typography>
          <Box>
            <IconButton size="small"><RefreshIcon fontSize="small" /></IconButton>
            <IconButton size="small"><SettingsIcon fontSize="small" /></IconButton>
          </Box>
        </Box>

        <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, border: '1px dashed #ccc', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">Chart legend placeholder</Typography>
        </Box>

        <Autocomplete
          multiple
          filterSelectedOptions
          size="small"
          options={metricOptions}
          value={trackedMetrics}
          onChange={(_, v) => setTrackedMetrics(v)}
          renderTags={(value, getTagProps) =>
            value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
          }
          renderInput={(params) => <TextField {...params} label="Tracked metrics" size="small" />}
          ListboxProps={{ style: { maxHeight: 200 } }}
        />
      </Paper>
    </Box>
  );
}
