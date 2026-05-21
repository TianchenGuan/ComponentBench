'use client';

/**
 * select_custom_multi-mui-v2-T07: Pipeline B environments row repair
 *
 * Table cell layout, dark theme, compact spacing, small scale, high clutter.
 * Deployments table with 3 rows: Pipeline A (read-only), Pipeline B (editable), Pipeline C (read-only).
 * Pipeline B cell uses MUI Autocomplete (multiple, limitTags=2).
 * Options: dev, prod, prod-old, staging, qa, canary, sandbox, perf.
 * Initial Pipeline B: [dev, prod-old]. Target: [dev, prod, staging, qa].
 * Row-local "Save row" button commits only Pipeline B.
 *
 * Success: Pipeline B = {dev, prod, staging, qa}, Save row clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Autocomplete, TextField, Chip, Button, Typography, Box,
  ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const envOptions = ['dev', 'prod', 'prod-old', 'staging', 'qa', 'canary', 'sandbox', 'perf'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [pipelineBEnvs, setPipelineBEnvs] = useState<string[]>(['dev', 'prod-old']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const committedRef = useRef<string[]>([]);

  const handleSave = () => {
    committedRef.current = [...pipelineBEnvs];
    setSaved(true);
  };

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(committedRef.current, ['dev', 'prod', 'staging', 'qa'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, onSuccess]);

  const cellSx = { p: '6px 10px', borderBottom: '1px solid #333', fontSize: 12 };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 2, minHeight: '100vh' }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Deployments</Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">Filter: Active pipelines</Typography>
          <Typography variant="caption" color="text.secondary">|</Typography>
          <Chip label="CI" size="small" variant="outlined" />
          <Chip label="CD" size="small" color="primary" />
        </Box>

        <Box sx={{ border: '1px solid #333', borderRadius: 1, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a1a' }}>
                <th style={{ ...cellSx, textAlign: 'left', width: 120 } as React.CSSProperties}>Pipeline</th>
                <th style={{ ...cellSx, textAlign: 'left', width: 80 } as React.CSSProperties}>Status</th>
                <th style={{ ...cellSx, textAlign: 'left' } as React.CSSProperties}>Environments</th>
                <th style={{ ...cellSx, width: 100 } as React.CSSProperties}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellSx as React.CSSProperties}>Pipeline A</td>
                <td style={cellSx as React.CSSProperties}><Chip label="Healthy" size="small" color="success" /></td>
                <td style={cellSx as React.CSSProperties}><Typography variant="caption" color="text.secondary">prod, staging</Typography></td>
                <td style={cellSx as React.CSSProperties}></td>
              </tr>
              <tr style={{ background: '#1a1a2e' }}>
                <td style={cellSx as React.CSSProperties}><strong>Pipeline B</strong></td>
                <td style={cellSx as React.CSSProperties}><Chip label="Review" size="small" color="warning" /></td>
                <td style={cellSx as React.CSSProperties}>
                  <Autocomplete
                    multiple
                    limitTags={2}
                    size="small"
                    options={envOptions}
                    value={pipelineBEnvs}
                    onChange={(_, v) => setPipelineBEnvs(v)}
                    renderTags={(value, getTagProps) =>
                      value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
                    }
                    renderInput={(params) => <TextField {...params} size="small" variant="outlined" />}
                    sx={{ minWidth: 200 }}
                  />
                </td>
                <td style={{ ...cellSx, textAlign: 'center' } as React.CSSProperties}>
                  <Button size="small" variant="contained" data-testid="save-row-pipeline-b" onClick={handleSave}>
                    Save row
                  </Button>
                </td>
              </tr>
              <tr>
                <td style={cellSx as React.CSSProperties}>Pipeline C</td>
                <td style={cellSx as React.CSSProperties}><Chip label="Healthy" size="small" color="success" /></td>
                <td style={cellSx as React.CSSProperties}><Typography variant="caption" color="text.secondary">dev, sandbox</Typography></td>
                <td style={cellSx as React.CSSProperties}></td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
