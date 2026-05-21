'use client';

/**
 * code_editor-mui-T10: Edit JSON in modal and save
 *
 * Page shows a centered MUI Button labeled "Edit settings". Clicking it opens a modal dialog (MUI Dialog).
 * Inside the modal is a composite code editor (CodeMirror 6) labeled "Settings JSON" and prefilled
 * with a small JSON object.
 * Modal footer has two buttons: Cancel and Save.
 * Initial state: modal is closed. When opened, the editor content is:
 * { "enabled": true, "level": "info" } formatted across multiple lines.
 * Clicking Save commits the editor content to the underlying value and closes the modal;
 * a small toast "Saved" appears.
 * Only the committed editor content is checked for success.
 *
 * Success: The committed settings content equals the target JSON with `"enabled": false`.
 * Save has been clicked (commit occurred) and the modal is closed.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, Snackbar, Alert, Box 
} from '@mui/material';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const INITIAL_CONTENT = `{
  "enabled": true,
  "level": "info"
}`;

const TARGET_CONTENT = `{
  "enabled": false,
  "level": "info"
}`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [savedContent, setSavedContent] = useState('');
  const [showToast, setShowToast] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const currentContent = useRef(INITIAL_CONTENT);
  const successFired = useRef(false);

  // Initialize CodeMirror when dialog opens — use a small delay to ensure
  // the Dialog content is mounted in the DOM before attaching CodeMirror.
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (!editorRef.current) return;

      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }

      const state = EditorState.create({
        doc: INITIAL_CONTENT,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          json(),
          indentUnit.of('  '),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              currentContent.current = update.state.doc.toString();
            }
          }),
        ],
      });

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [open]);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (!open && savedContent && contentMatches(savedContent, TARGET_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, savedContent, onSuccess]);

  const handleOpen = useCallback(() => {
    currentContent.current = INITIAL_CONTENT;
    setOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    setSavedContent(currentContent.current);
    setShowToast(true);
    setOpen(false);
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <Button variant="contained" onClick={handleOpen} data-testid="edit-settings-button">
        Edit settings
      </Button>

      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth disableEnforceFocus>
        <DialogTitle>Settings JSON</DialogTitle>
        <DialogContent>
          <Box 
            ref={editorRef}
            sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              minHeight: 180,
              mt: 1,
            }}
            data-testid="modal-editor"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="modal-save">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowToast(false)}>
          Saved
        </Alert>
      </Snackbar>
    </Box>
  );
}
