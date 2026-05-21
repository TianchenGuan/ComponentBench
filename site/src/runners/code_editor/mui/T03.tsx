'use client';

/**
 * code_editor-mui-T03: Open Find panel
 *
 * MUI Paper card centered with a Monaco-based code editor.
 * Toolbar contains a magnifying-glass icon button labeled "Find".
 * Initial state: find/search UI is closed. Editor contains a small snippet, but its content is irrelevant.
 * Clicking Find opens Monaco's find widget overlay within the editor (typically at the top-right of the editor surface)
 * with a focused search input.
 * There is a single editor instance and no other overlays on page load.
 *
 * Success: The editor's Find overlay is open (visible) and in the 'find' mode.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Typography, Toolbar, IconButton, Box, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = `// Sample code
function hello() {
  console.log("Hello, World!");
}`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [findOpen, setFindOpen] = useState(false);
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const successFired = useRef(false);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (findOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [findOpen, onSuccess]);

  const handleEditorMount = useCallback((editorInstance: editor.IStandaloneCodeEditor) => {
    editorInstanceRef.current = editorInstance;
    
    // Listen for find widget visibility
    const findController = editorInstance.getContribution('editor.contrib.findController') as any;
    if (findController) {
      // Check if find widget becomes visible
      const checkFindState = () => {
        const findWidget = editorInstance.getDomNode()?.querySelector('.find-widget');
        if (findWidget && !findWidget.classList.contains('hidden-transition')) {
          setFindOpen(true);
        }
      };
      
      // Set up observer to detect find widget
      const observer = new MutationObserver(checkFindState);
      const editorDom = editorInstance.getDomNode();
      if (editorDom) {
        observer.observe(editorDom, { childList: true, subtree: true, attributes: true });
      }
    }
  }, []);

  const handleFind = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('actions.find')?.run();
      // Set find open after a small delay to allow the widget to appear
      setTimeout(() => setFindOpen(true), 100);
    }
  }, []);

  return (
    <Paper elevation={2} sx={{ width: 600, overflow: 'hidden' }} data-testid="code-editor-card">
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Editor</Typography>
      </Box>
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1 }}>
        <Tooltip title="Find">
          <IconButton size="small" onClick={handleFind} data-testid="find-button">
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Box sx={{ border: '1px solid #e0e0e0', m: 2, mt: 0, borderRadius: 1 }}>
        <Editor
          height="250px"
          language="javascript"
          value={content}
          onChange={(value) => setContent(value || '')}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </Box>
    </Paper>
  );
}
