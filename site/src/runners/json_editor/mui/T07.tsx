'use client';

/**
 * json_editor-mui-T07: Set rateLimit.perMinute inside a form section
 *
 * Page shows a MUI form section titled "API limits".
 * Above the JSON editor are unrelated controls (e.g., a Select for strategy and a TextField for plan name) that are NOT required.
 * A labeled JSON editor "Rate limit (JSON)" appears within the section and starts in Tree mode.
 * The JSON contains a nested object rateLimit with fields perMinute and burst.
 * A Save button under the editor commits changes.
 * Initial JSON value:
 * {
 *   "rateLimit": {"perMinute": 60, "burst": 30},
 *   "enabled": true
 * }
 *
 * Success: The committed JSON value at path $.rateLimit.perMinute equals 120 after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Stack, Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const INITIAL_JSON = {
  rateLimit: { perMinute: 60, burst: 30 },
  enabled: true
};

export default function T07({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const perMinute = getJsonPath(committedValue, '$.rateLimit.perMinute');
    if (perMinute === 120) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleSave = () => {
    setCommittedValue(jsonValue);
  };

  const updateJsonPath = (path: string[], value: JsonValue) => {
    const newJson = JSON.parse(JSON.stringify(jsonValue));
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setJsonValue(newJson);
  };

  const obj = jsonValue as typeof INITIAL_JSON;

  return (
    <Paper elevation={2} sx={{ width: 480, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>API limits</Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" fullWidth>
          <InputLabel>Strategy</InputLabel>
          <Select defaultValue="sliding" label="Strategy">
            <MenuItem value="sliding">Sliding Window</MenuItem>
            <MenuItem value="fixed">Fixed Window</MenuItem>
            <MenuItem value="token">Token Bucket</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Plan name"
          defaultValue="default"
          fullWidth
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>Rate limit (JSON)</Typography>

      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5, mb: 2, bgcolor: '#fafafa' }}>
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 36, '& .MuiAccordionSummary-content': { my: 0 } }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>rateLimit</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Stack spacing={1} sx={{ pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 90 }}>perMinute:</Typography>
                <TextField
                  size="small"
                  type="number"
                  value={obj.rateLimit.perMinute}
                  onChange={(e) => updateJsonPath(['rateLimit', 'perMinute'], Number(e.target.value))}
                  sx={{ width: 100 }}
                  data-testid="input-perMinute"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 90 }}>burst:</Typography>
                <TextField
                  size="small"
                  type="number"
                  value={obj.rateLimit.burst}
                  onChange={(e) => updateJsonPath(['rateLimit', 'burst'], Number(e.target.value))}
                  sx={{ width: 100 }}
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={obj.enabled}
              onChange={(e) => updateJsonPath(['enabled'], e.target.checked)}
            />
          }
          label={<Typography variant="body2" sx={{ fontFamily: 'monospace' }}>enabled</Typography>}
        />
      </Box>

      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Paper>
  );
}
