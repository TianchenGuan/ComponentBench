'use client';

/**
 * progress_bar-mui-T08: Table: process Dataset B to 95%
 *
 * Layout: table_cell. A compact datasets table is shown in a fixed-height container.
 *
 * Target components: multiple MUI LinearProgress bars rendered inside the "Progress" column.
 *
 * Table details:
 * - Rows: Dataset A, Dataset B (TARGET), Dataset C, Dataset D.
 * - Each row contains: name cell, LinearProgress bar cell, "Start" button.
 *
 * Initial state:
 * - Dataset B progress starts at 0% and idle.
 * - Other rows show various static values (e.g., 20%, 60%) to create interference.
 *
 * Interaction:
 * - Clicking "Start" in the Dataset B row begins increasing its progress and auto-pauses at 95%.
 *
 * Success: Dataset B progress within ±1% of 95% and stable for 0.8 seconds.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface DatasetRow {
  id: string;
  name: string;
  progress: number;
  isRunning: boolean;
  targetPause?: number;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [datasets, setDatasets] = useState<DatasetRow[]>([
    { id: 'a', name: 'Dataset A', progress: 20, isRunning: false },
    { id: 'b', name: 'Dataset B', progress: 0, isRunning: false, targetPause: 95 },
    { id: 'c', name: 'Dataset C', progress: 60, isRunning: false },
    { id: 'd', name: 'Dataset D', progress: 45, isRunning: false },
  ]);

  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: Dataset B within ±1% of 95% and stable for 0.8 seconds
  useEffect(() => {
    const datasetB = datasets.find((d) => d.id === 'b');
    if (!datasetB) return;

    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (
      !datasetB.isRunning &&
      datasetB.progress >= 94 &&
      datasetB.progress <= 96 &&
      !successFiredRef.current
    ) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 800);
    }

    return () => {
      if (stabilityRef.current) {
        clearTimeout(stabilityRef.current);
      }
    };
  }, [datasets, onSuccess]);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const handleStart = (datasetId: string) => {
    const dataset = datasets.find((d) => d.id === datasetId);
    if (!dataset || dataset.isRunning) return;

    setDatasets((prev) =>
      prev.map((d) => (d.id === datasetId ? { ...d, isRunning: true } : d))
    );

    const interval = setInterval(() => {
      setDatasets((prev) =>
        prev.map((d) => {
          if (d.id !== datasetId) return d;
          const targetPause = d.targetPause || 100;
          if (d.progress >= targetPause) {
            clearInterval(intervalsRef.current.get(datasetId)!);
            intervalsRef.current.delete(datasetId);
            return { ...d, isRunning: false };
          }
          return { ...d, progress: d.progress + 1 };
        })
      );
    }, 100);

    intervalsRef.current.set(datasetId, interval);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 550 }}>
      <Typography variant="h6" gutterBottom>
        Datasets
      </Typography>

      <TextField
        size="small"
        placeholder="Filter datasets..."
        sx={{ mb: 2, width: '100%' }}
      />

      <TableContainer sx={{ maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell sx={{ width: 200 }}>Progress</TableCell>
              <TableCell sx={{ width: 80 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((dataset) => (
              <TableRow key={dataset.id} data-row-key={`dataset-${dataset.id}`}>
                <TableCell>{dataset.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={dataset.progress}
                        aria-label={`${dataset.name} progress`}
                        data-testid={`progress-${dataset.id}`}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ minWidth: 35 }}>
                      {dataset.progress}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleStart(dataset.id)}
                    disabled={dataset.isRunning || dataset.progress >= (dataset.targetPause || 100)}
                  >
                    Start
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
