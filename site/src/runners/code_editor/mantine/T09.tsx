'use client';

/**
 * code_editor-mantine-T09: Set font size to 13
 *
 * Mantine Paper card anchored near the bottom-left of the viewport.
 * Composite CodeMirror editor with a settings row above it.
 * Settings include a labeled slider "Font size" with discrete steps from 12 to 18 and a numeric value display.
 * Initial state: Font size is 14. Editor contains a short snippet, but content is not checked.
 * Changing the slider updates the editor font size immediately; no Save/Apply.
 *
 * Success: Editor option `font_size` equals 13.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Text, Slider, Group, Box } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState, Compartment } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = `// Sample code
const greeting = "Hello";
console.log(greeting);`;

export default function T09({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const fontSizeCompartment = useRef(new Compartment());
  const [fontSize, setFontSize] = useState(14);
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: INITIAL_CONTENT,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
        fontSizeCompartment.current.of(EditorView.theme({
          '.cm-content': { fontSize: '14px' },
          '.cm-gutters': { fontSize: '14px' },
        })),
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

  // Update font size when changed
  useEffect(() => {
    if (!viewRef.current) return;
    
    viewRef.current.dispatch({
      effects: fontSizeCompartment.current.reconfigure(
        EditorView.theme({
          '.cm-content': { fontSize: `${fontSize}px` },
          '.cm-gutters': { fontSize: `${fontSize}px` },
        })
      ),
    });
  }, [fontSize]);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (fontSize === 13) {
      successFired.current = true;
      onSuccess();
    }
  }, [fontSize, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 550 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">Editor</Text>
      
      <Group mb="md" align="center">
        <Text size="sm" style={{ width: 80 }}>Font size</Text>
        <Slider
          value={fontSize}
          onChange={setFontSize}
          min={12}
          max={18}
          step={1}
          marks={[
            { value: 12, label: '12' },
            { value: 14, label: '14' },
            { value: 16, label: '16' },
            { value: 18, label: '18' },
          ]}
          style={{ flex: 1 }}
          aria-valuenow={fontSize}
          data-testid="font-size-slider"
        />
        <Text size="sm" fw={500} style={{ width: 30 }}>{fontSize}</Text>
      </Group>

      <div 
        ref={editorRef}
        style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: 4,
          minHeight: 180,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
