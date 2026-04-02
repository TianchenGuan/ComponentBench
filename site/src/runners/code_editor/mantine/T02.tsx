'use client';

/**
 * code_editor-mantine-T02: Switch language to YAML
 *
 * Mantine centered card with a composite code editor.
 * A Mantine Select labeled "Language" sits above the editor with options: JavaScript, YAML, JSON, Python.
 * Initial state: Language is JavaScript. The editor contains a short placeholder comment.
 * Selecting a language changes editor mode immediately; no other action required.
 * Single editor instance; no clutter.
 *
 * Success: Editor language/mode is set to YAML.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Text, Select, Group } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState, Compartment } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { yaml } from '@codemirror/lang-yaml';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = '// Sample code';

const languageExtensions = {
  javascript: javascript(),
  yaml: yaml(),
  json: json(),
  python: python(),
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const [language, setLanguage] = useState<string | null>('javascript');
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: INITIAL_CONTENT,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        languageCompartment.current.of(languageExtensions.javascript),
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
    if (!viewRef.current || !language) return;
    
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
    if (language === 'yaml') {
      successFired.current = true;
      onSuccess();
    }
  }, [language, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 550 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">Editor</Text>
      <Group mb="sm">
        <Select
          label="Language"
          value={language}
          onChange={setLanguage}
          data={[
            { value: 'javascript', label: 'JavaScript' },
            { value: 'yaml', label: 'YAML' },
            { value: 'json', label: 'JSON' },
            { value: 'python', label: 'Python' },
          ]}
          style={{ width: 150 }}
          data-testid="language-select"
        />
      </Group>
      <div 
        ref={editorRef}
        style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: 4,
          minHeight: 200,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
