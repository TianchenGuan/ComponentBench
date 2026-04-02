'use client';

/**
 * code_editor-mui-T06: Switch language to SQL
 *
 * MUI Paper card centered with a composite CodeMirror editor.
 * A labeled MUI Select control "Language" sits above the editor with options: JSON, SQL, YAML, Python.
 * Initial state: Language is JSON. The editor contains a small example query-looking text, but content is not checked.
 * Selecting a language updates the editor mode immediately; no Apply button exists.
 * Only one editor instance is present.
 *
 * Success: The editor language/mode is SQL.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState, Compartment } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { sql } from '@codemirror/lang-sql';
import { yaml } from '@codemirror/lang-yaml';
import { python } from '@codemirror/lang-python';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = `SELECT * FROM users WHERE active = true`;

const languageExtensions = {
  json: json(),
  sql: sql(),
  yaml: yaml(),
  python: python(),
};

export default function T06({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const [language, setLanguage] = useState<string>('json');
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: INITIAL_CONTENT,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        languageCompartment.current.of(languageExtensions.json),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  // Update language when changed
  useEffect(() => {
    if (!viewRef.current) return;
    
    const langExt = languageExtensions[language as keyof typeof languageExtensions];
    if (langExt) {
      viewRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(langExt),
      });
    }
  }, [language]);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (language === 'sql') {
      successFired.current = true;
      onSuccess();
    }
  }, [language, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 600, overflow: 'hidden' }} data-testid="code-editor-card">
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Editor</Typography>
      </Box>
      <Box sx={{ px: 2, py: 1.5 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
            data-testid="language-select"
          >
            <MenuItem value="json">JSON</MenuItem>
            <MenuItem value="sql">SQL</MenuItem>
            <MenuItem value="yaml">YAML</MenuItem>
            <MenuItem value="python">Python</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box 
        ref={editorRef}
        sx={{ 
          border: '1px solid #e0e0e0', 
          m: 2, 
          mt: 0, 
          borderRadius: 1,
          minHeight: 200,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
