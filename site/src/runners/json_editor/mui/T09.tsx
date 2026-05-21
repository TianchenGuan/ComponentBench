'use client';

/**
 * json_editor-mui-T09: Make Draft payload match the reference (two editors)
 *
 * Page shows a centered MUI Card titled "Webhook payloads".
 * It contains two editable JSON editor instances side-by-side:
 * - Left: "Draft payload JSON" (editable; has its own "Save draft" button)
 * - Right: "Published payload JSON" (editable; has its own "Save published" button)
 * Below the editors, a read-only panel titled "Target payload JSON" displays the desired JSON for the Draft as formatted text.
 * Both editors start in Tree mode.
 * Initial Draft JSON: { "id": "evt_000", "type": "payment.failed", "amount": 0 }
 * Initial Published JSON (distractor): { "id": "evt_999", "type": "payment.succeeded", "amount": 9.99 }
 * Target payload JSON: { "id": "evt_123", "type": "payment.succeeded", "amount": 19.99 }
 *
 * Success: The Draft payload JSON equals the target after "Save draft" is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, Grid, Stack } from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const DRAFT_INITIAL = {
  id: 'evt_000',
  type: 'payment.failed',
  amount: 0
};

const PUBLISHED_INITIAL = {
  id: 'evt_999',
  type: 'payment.succeeded',
  amount: 9.99
};

const TARGET_JSON = {
  id: 'evt_123',
  type: 'payment.succeeded',
  amount: 19.99
};

interface EditorProps {
  label: string;
  initialValue: typeof DRAFT_INITIAL;
  buttonLabel: string;
  onSave: (value: JsonValue) => void;
  testId: string;
}

function JsonEditor({ label, initialValue, buttonLabel, onSave, testId }: EditorProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <Box data-testid={testId}>
      <Typography variant="subtitle2" gutterBottom>{label}</Typography>
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, mb: 1, bgcolor: '#fafafa' }}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 60 }}>id:</Typography>
            <TextField
              size="small"
              value={value.id}
              onChange={(e) => setValue({ ...value, id: e.target.value })}
              sx={{ width: 130 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 60 }}>type:</Typography>
            <TextField
              size="small"
              value={value.type}
              onChange={(e) => setValue({ ...value, type: e.target.value })}
              sx={{ width: 160 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 60 }}>amount:</Typography>
            <TextField
              size="small"
              type="number"
              inputProps={{ step: 0.01 }}
              value={value.amount}
              onChange={(e) => setValue({ ...value, amount: Number(e.target.value) })}
              sx={{ width: 100 }}
            />
          </Box>
        </Stack>
      </Box>
      <Button variant="contained" size="small" onClick={() => onSave(value)}>
        {buttonLabel}
      </Button>
    </Box>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [draftCommitted, setDraftCommitted] = useState<JsonValue>(DRAFT_INITIAL);
  const [, setPublishedCommitted] = useState<JsonValue>(PUBLISHED_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (jsonEquals(draftCommitted, TARGET_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  }, [draftCommitted, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 600, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>Webhook payloads</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <JsonEditor
            label="Draft payload JSON"
            initialValue={DRAFT_INITIAL}
            buttonLabel="Save draft"
            onSave={setDraftCommitted}
            testId="draft-editor"
          />
        </Grid>
        <Grid item xs={6}>
          <JsonEditor
            label="Published payload JSON"
            initialValue={PUBLISHED_INITIAL}
            buttonLabel="Save published"
            onSave={setPublishedCommitted}
            testId="published-editor"
          />
        </Grid>
      </Grid>

      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle2" gutterBottom>Target payload JSON</Typography>
        <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12 }}>
          {JSON.stringify(TARGET_JSON, null, 2)}
        </pre>
      </Box>
    </Paper>
  );
}
