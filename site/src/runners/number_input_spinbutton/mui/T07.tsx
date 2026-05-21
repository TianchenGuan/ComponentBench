'use client';

/**
 * number_input_spinbutton-mui-T07: Match Target score to preview card
 * 
 * A centered card titled "Scoring" contains two MUI Number Field inputs (2 instances) arranged vertically:
 * - "Target score" (TARGET) — initial value 500, min=0, max=2000, step=10
 * - "Bonus points" — initial value 100, min=0, max=500, step=5
 * To the right, a Preview card shows read-only summary text including "Target score: 850".
 * Guidance is mixed: the instruction gives 850 and the same number is also visible in the Preview card.
 * No confirmation button is required; changes are immediate.
 * 
 * Success: The numeric value of the target number input (Target score) is 850.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Box, Paper, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [targetScore, setTargetScore] = useState<number>(500);
  const [bonusPoints, setBonusPoints] = useState<number>(100);

  useEffect(() => {
    if (targetScore === 850) {
      onSuccess();
    }
  }, [targetScore, onSuccess]);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Scoring
          </Typography>
          <TextField
            label="Target score"
            type="number"
            variant="outlined"
            fullWidth
            value={targetScore}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 0 && v <= 2000) {
                setTargetScore(v);
              }
            }}
            inputProps={{ 
              min: 0, 
              max: 2000, 
              step: 10,
              'data-testid': 'target-score-input'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton 
                    size="small" 
                    onClick={() => setTargetScore(prev => Math.max(prev - 10, 0))}
                    disabled={targetScore <= 0}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => setTargetScore(prev => Math.min(prev + 10, 2000))}
                    disabled={targetScore >= 2000}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bonus points"
            type="number"
            variant="outlined"
            fullWidth
            value={bonusPoints}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 0 && v <= 500) {
                setBonusPoints(v);
              }
            }}
            inputProps={{ 
              min: 0, 
              max: 500, 
              step: 5,
              'data-testid': 'bonus-points-input'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton 
                    size="small" 
                    onClick={() => setBonusPoints(prev => Math.max(prev - 5, 0))}
                    disabled={bonusPoints <= 0}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => setBonusPoints(prev => Math.min(prev + 5, 500))}
                    disabled={bonusPoints >= 500}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>
      
      <Paper sx={{ p: 2, minWidth: 180 }} data-testid="preview-card">
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Preview
        </Typography>
        <Typography variant="body2">
          Target score: <strong>850</strong>
        </Typography>
        <Typography variant="body2">
          Bonus: <strong>{bonusPoints}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Total: <strong>{targetScore + bonusPoints}</strong>
        </Typography>
      </Paper>
    </Box>
  );
}
