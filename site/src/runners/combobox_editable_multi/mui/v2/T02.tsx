'use client';

/**
 * combobox_editable_multi-mui-v2-T02
 *
 * Settings panel. MUI Autocomplete (multiple, limitTags=2).
 * Initial chips: none. Options: News, Sports, Finance, Travel, Tech, Health, Weather, Science.
 * Success: Categories = {News, Sports, Finance, Travel, Tech, Health}, Apply categories clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const options = ['News', 'Sports', 'Finance', 'Travel', 'Tech', 'Health', 'Weather', 'Science'];
const TARGET_SET = ['News', 'Sports', 'Finance', 'Travel', 'Tech', 'Health'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(value, TARGET_SET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, onSuccess]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Card sx={{ width: 460 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Content settings</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Auto-refresh feed" />
          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2" gutterBottom>Categories</Typography>
          <Autocomplete
            multiple
            limitTags={2}
            options={options}
            value={value}
            onChange={(_e, newVal) => { setValue(newVal); setSaved(false); }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select categories" size="small" />
            )}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" size="small" onClick={() => setSaved(true)}>
            Apply categories
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
