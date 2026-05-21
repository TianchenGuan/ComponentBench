'use client';

/**
 * slider_range-mui-v2-T30: Streaming section below the fold in nested scroll
 *
 * Outer layout + inner scroll column. Streaming has Buffer 1–4, Retry jitter 2–5, Apply section.
 * Success: committed Buffer 2–6, Retry 2–5, Apply section used.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Slider,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T30({ onSuccess }: TaskComponentProps) {
  const [draftBuffer, setDraftBuffer] = useState<number[]>([1, 4]);
  const [draftRetry, setDraftRetry] = useState<number[]>([2, 5]);
  const [committedBuffer, setCommittedBuffer] = useState<number[]>([1, 4]);
  const [committedRetry, setCommittedRetry] = useState<number[]>([2, 5]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committedBuffer[0] === 2 &&
      committedBuffer[1] === 6 &&
      committedRetry[0] === 2 &&
      committedRetry[1] === 5
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedBuffer, committedRetry, onSuccess]);

  const handleApplySection = () => {
    setCommittedBuffer([...draftBuffer]);
    setCommittedRetry([...draftRetry]);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 480, height: 420, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Service configuration
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        Scroll the inner column to reach Streaming. Section Apply commits only those sliders.
      </Typography>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
        data-testid="nested-scroll-outer"
      >
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
            p: 2,
            bgcolor: 'background.paper',
          }}
          data-testid="nested-scroll-inner"
        >
          <Typography variant="overline" color="text.secondary">
            General
          </Typography>
          <TextField size="small" label="Service name" defaultValue="ingest-api" fullWidth sx={{ mt: 1, mb: 2 }} />
          <FormControlLabel control={<Switch defaultChecked size="small" />} label="TLS" sx={{ display: 'block', mb: 2 }} />

          <Typography variant="overline" color="text.secondary">
            Backpressure
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Queue depth and rate limits apply globally. Values here are illustrative.
          </Typography>
          <Slider defaultValue={40} sx={{ mb: 3 }} />

          <Typography variant="overline" color="text.secondary">
            Reliability
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption">Health check interval (mock)</Typography>
            <Slider defaultValue={[15, 45]} valueLabelDisplay="auto" min={0} max={120} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }} id="streaming-section">
            Streaming
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Buffer range (s)
          </Typography>
          <Box sx={{ px: 1, mb: 2 }}>
            <Slider
              value={draftBuffer}
              onChange={(_e, v) => setDraftBuffer(v as number[])}
              min={0}
              max={10}
              step={1}
              valueLabelDisplay="auto"
              data-testid="buffer-range"
            />
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Retry jitter (s)
          </Typography>
          <Box sx={{ px: 1, mb: 2 }}>
            <Slider
              value={draftRetry}
              onChange={(_e, v) => setDraftRetry(v as number[])}
              min={0}
              max={10}
              step={1}
              valueLabelDisplay="auto"
              data-testid="retry-jitter-range"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Draft · Buffer {draftBuffer[0]}–{draftBuffer[1]} · Jitter {draftRetry[0]}–{draftRetry[1]}
          </Typography>
          <Button size="small" variant="contained" onClick={handleApplySection} data-testid="apply-streaming-section">
            Apply section
          </Button>

          <Box sx={{ height: 120 }} />
        </Box>
      </Box>
    </Box>
  );
}
