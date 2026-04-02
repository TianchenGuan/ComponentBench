'use client';

/**
 * code_editor-mantine-T06: Open Go to line overlay
 *
 * Mantine Paper card centered titled "Navigator".
 * Composite CodeMirror editor with a small actions menu.
 * In the toolbar there is an "Actions" menu button (opens a dropdown). One of the menu items is "Go to line…".
 * Initial state: no overlays are open.
 * Selecting "Go to line…" opens a small in-editor overlay with a single input for line number
 * (it appears near the top-right of the editor surface).
 * Only the overlay-open state is checked; no specific line number needs to be entered.
 *
 * Success: The editor's Go to line overlay is open.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Text, Menu, Button, TextInput, Modal } from '@mantine/core';
import { IconChevronDown, IconArrowRight, IconSearch } from '@tabler/icons-react';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = `// Navigator example
function navigate() {
  console.log("Line 3");
  console.log("Line 4");
  console.log("Line 5");
  console.log("Line 6");
  console.log("Line 7");
  console.log("Line 8");
  console.log("Line 9");
  console.log("Line 10");
}`;

export default function T06({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [gotoLineOpen, setGotoLineOpen] = useState(false);
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

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (gotoLineOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [gotoLineOpen, onSuccess]);

  const handleGotoLine = useCallback(() => {
    setGotoLineOpen(true);
  }, []);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 550 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">Navigator</Text>
      <Menu shadow="md" width={180}>
        <Menu.Target>
          <Button variant="light" rightSection={<IconChevronDown size={14} />} mb="sm">
            Actions
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconSearch size={14} />}>
            Find…
          </Menu.Item>
          <Menu.Item 
            leftSection={<IconArrowRight size={14} />}
            onClick={handleGotoLine}
            data-testid="goto-line-menu-item"
          >
            Go to line…
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* Go to line overlay */}
      {gotoLineOpen && (
        <div 
          style={{
            position: 'absolute',
            top: 120,
            right: 20,
            background: '#fff',
            border: '1px solid #dee2e6',
            borderRadius: 4,
            padding: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 100,
          }}
          data-testid="goto-line-overlay"
        >
          <TextInput
            placeholder="Line number"
            size="sm"
            style={{ width: 150 }}
            autoFocus
          />
        </div>
      )}

      <div 
        ref={editorRef}
        style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: 4,
          minHeight: 250,
          position: 'relative',
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
