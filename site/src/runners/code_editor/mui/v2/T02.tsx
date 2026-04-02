'use client';

/**
 * code_editor-mui-v2-T02: Modal routes editor replace-all and save
 *
 * "Edit routes" opens a centered MUI Dialog with one Monaco editor labeled "Routes editor".
 * The source contains exactly three occurrences of `/v1/`. Replace all with `/v2/`, then
 * click "Save routes". The dialog closes after save.
 * Success: no `/v1/` remaining, `/v2/` present, saved, dialog closed.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, IconButton, Toolbar,
} from '@mui/material';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TaskComponentProps } from '../../types';
import { normalizeContent } from '../../types';

const ROUTES_INITIAL = `const routes = [
  { path: "/v1/users", handler: handleUsers },
  { path: "/v1/products", handler: handleProducts },
  { path: "/v1/orders", handler: handleOrders },
];
export default routes;`;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState(ROUTES_INITIAL);
  const [saved, setSaved] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!saved || dialogOpen) return;
    const normalized = normalizeContent(content, { normalizeLineEndings: true });
    if (normalized.includes('/v2/') && !normalized.includes('/v1/')) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, dialogOpen, onSuccess]);

  const handleSave = useCallback(() => {
    setSaved(true);
    setDialogOpen(false);
  }, []);

  const handleReplace = useCallback(() => {
    editorRef.current?.getAction('editor.action.startFindReplaceAction')?.run();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>
        Edit routes
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Configure API route mappings
      </Typography>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Routes editor</DialogTitle>
        <DialogContent>
          <Toolbar variant="dense" sx={{ px: 0, minHeight: 40 }}>
            <IconButton size="small" onClick={handleReplace}>
              <FindReplaceIcon fontSize="small" />
            </IconButton>
          </Toolbar>
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Editor
              height="300px"
              language="javascript"
              value={content}
              onChange={(v) => {
                setContent(v || '');
                setSaved(false);
              }}
              onMount={(ed) => { editorRef.current = ed; }}
              options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="save-routes">
            Save routes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
