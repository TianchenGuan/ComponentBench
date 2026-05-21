'use client';

/**
 * masked_input-mui-T09: Apply end time with inline confirm
 * 
 * Isolated card centered in the viewport titled "Working hours".
 * Two masked MUI TextFields are shown:
 * - "Start time" is prefilled with "09:00".
 * - "End time" is prefilled with "17:00".
 * Both use an HH:MM mask with placeholder "__:__" and auto-insert the colon.
 * Inside the End time field on the right are two small icon buttons labeled with aria-labels "Apply end time" and "Cancel end time".
 * Clicking Apply commits the current End time value (sets a committed flag and shows an inline "Applied" helper text); Cancel reverts to the last applied value.
 * 
 * Success: The masked input instance labeled "End time" equals "18:45" AND committed by clicking Apply.
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { Card, CardContent, CardHeader, TextField, Box, InputAdornment, IconButton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TimeMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TimeMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00:00"
        definitions={{
          '0': /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [startTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [committedEndTime, setCommittedEndTime] = useState('17:00');
  const [isCommitted, setIsCommitted] = useState(false);

  useEffect(() => {
    if (isCommitted && committedEndTime === '18:45') {
      onSuccess();
    }
  }, [isCommitted, committedEndTime, onSuccess]);

  const handleApply = () => {
    if (endTime.length === 5) {
      setCommittedEndTime(endTime);
      setIsCommitted(true);
    }
  };

  const handleCancel = () => {
    setEndTime(committedEndTime);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Working hours" />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Start time"
            placeholder="__:__"
            value={startTime}
            slotProps={{
              input: {
                inputComponent: TimeMaskCustom as any,
                readOnly: true,
              },
            }}
            inputProps={{
              'data-testid': 'start-time',
            }}
            sx={{ '& .MuiInputBase-root': { backgroundColor: '#f5f5f5' } }}
          />
          <Box>
            <TextField
              fullWidth
              label="End time"
              placeholder="__:__"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              slotProps={{
                input: {
                  inputComponent: TimeMaskCustom as any,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Apply end time"
                        onClick={handleApply}
                        size="small"
                        sx={{ color: 'success.main' }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="Cancel end time"
                        onClick={handleCancel}
                        size="small"
                        sx={{ color: 'error.main' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              inputProps={{
                'data-testid': 'end-time',
                'data-committed': isCommitted,
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: isCommitted ? 'success.main' : 'text.secondary',
                mt: 0.5,
                display: 'block',
              }}
              data-testid="end-time-status"
            >
              {isCommitted ? 'Applied' : 'Not applied'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
