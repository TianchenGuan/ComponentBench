'use client';

/**
 * json_editor-mui-T06: Add an allowed origin in the Backend editor (two instances)
 *
 * Page shows a centered MUI Card titled "CORS settings (JSON)".
 * Inside are TWO JSON editor instances stacked:
 * 1) "Allowed origins (Frontend JSON)"
 * 2) "Allowed origins (Backend JSON)"
 * Each editor includes a small in-editor search box (placeholder "Search…") and starts in Tree mode.
 * Each editor has its own Save button directly below it.
 * Initial JSON in Frontend editor: {"allowedOrigins": ["https://app.example.com"], "allowCredentials": true}
 * Initial JSON in Backend editor: {"allowedOrigins": ["https://api.example.com"], "allowCredentials": false}
 * You must update only the Backend editor so that its allowedOrigins array contains https://example.com.
 *
 * Success: The array at path $.allowedOrigins in the Backend editor contains "https://example.com" after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, Divider, Stack, List, ListItem, IconButton, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath, arrayContains } from '../types';

const FRONTEND_INITIAL = {
  allowedOrigins: ['https://app.example.com'],
  allowCredentials: true
};

const BACKEND_INITIAL = {
  allowedOrigins: ['https://api.example.com'],
  allowCredentials: false
};

interface JsonEditorInstanceProps {
  label: string;
  initialJson: { allowedOrigins: string[]; allowCredentials: boolean };
  onCommit: (value: JsonValue) => void;
  testId: string;
}

function JsonEditorInstance({ label, initialJson, onCommit, testId }: JsonEditorInstanceProps) {
  const [jsonValue, setJsonValue] = useState(initialJson);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrigin, setNewOrigin] = useState('');

  const handleSave = () => {
    onCommit(jsonValue);
  };

  const addOrigin = () => {
    if (newOrigin.trim()) {
      setJsonValue({
        ...jsonValue,
        allowedOrigins: [...jsonValue.allowedOrigins, newOrigin.trim()]
      });
      setNewOrigin('');
    }
  };

  const removeOrigin = (index: number) => {
    const newOrigins = [...jsonValue.allowedOrigins];
    newOrigins.splice(index, 1);
    setJsonValue({ ...jsonValue, allowedOrigins: newOrigins });
  };

  const filteredOrigins = searchTerm
    ? jsonValue.allowedOrigins.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase()))
    : jsonValue.allowedOrigins;

  return (
    <Box data-testid={testId} sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>{label}</Typography>

      <TextField
        size="small"
        placeholder="Search…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1, width: 200 }}
      />

      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, mb: 1, bgcolor: '#fafafa' }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>allowedOrigins:</Typography>
        <List dense sx={{ pl: 2 }}>
          {filteredOrigins.map((origin, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" size="small" onClick={() => removeOrigin(jsonValue.allowedOrigins.indexOf(origin))}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
              sx={{ py: 0 }}
            >
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>"{origin}"</Typography>
            </ListItem>
          ))}
        </List>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <TextField
            size="small"
            placeholder="Add origin URL"
            value={newOrigin}
            onChange={(e) => setNewOrigin(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addOrigin()}
            sx={{ width: 220 }}
            data-testid={`${testId}-new-origin`}
          />
          <IconButton size="small" onClick={addOrigin}>
            <AddIcon />
          </IconButton>
        </Stack>
      </Box>

      <Button variant="contained" size="small" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [, setFrontendCommitted] = useState<JsonValue>(FRONTEND_INITIAL);
  const [backendCommitted, setBackendCommitted] = useState<JsonValue>(BACKEND_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const origins = getJsonPath(backendCommitted, '$.allowedOrigins');
    if (Array.isArray(origins) && arrayContains(origins, ['https://example.com'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [backendCommitted, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>CORS settings (JSON)</Typography>

      <JsonEditorInstance
        label="Allowed origins (Frontend JSON)"
        initialJson={FRONTEND_INITIAL}
        onCommit={setFrontendCommitted}
        testId="frontend-editor"
      />

      <Divider sx={{ my: 2 }} />

      <JsonEditorInstance
        label="Allowed origins (Backend JSON)"
        initialJson={BACKEND_INITIAL}
        onCommit={setBackendCommitted}
        testId="backend-editor"
      />
    </Paper>
  );
}
