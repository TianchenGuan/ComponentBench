'use client';

/**
 * code_editor-mantine-v2-T04: Edit post-deploy hook, save, and confirm
 *
 * "Edit post-deploy hook" opens a Mantine Modal with a CodeMirror editor labeled "Hook script".
 * Initial source: `enabled = true` and `hook = "postDeploy"`. Change enabled to false,
 * click Save → second confirmation modal → click Confirm.
 * Success: content matches target, both modals closed, confirmed.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Modal, Group, Text, Stack } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const INITIAL_CONTENT = `enabled = true

hook = "postDeploy"`;

const TARGET_CONTENT = `enabled = false

hook = "postDeploy"`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [mainOpen, setMainOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [confirmed, setConfirmed] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const contentRef = useRef(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    if (!mainOpen) return;
    const timer = setTimeout(() => {
      if (!editorRef.current || viewRef.current) return;
      const state = EditorState.create({
        doc: contentRef.current,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const val = update.state.doc.toString();
              setContent(val);
              contentRef.current = val;
            }
          }),
        ],
      });
      viewRef.current = new EditorView({ state, parent: editorRef.current });
    }, 100);
    return () => {
      clearTimeout(timer);
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [mainOpen]);

  useEffect(() => {
    if (successFired.current) return;
    if (!confirmed || mainOpen || confirmOpen) return;
    if (contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, confirmed, mainOpen, confirmOpen, onSuccess]);

  const handleSave = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
    setConfirmOpen(false);
    setMainOpen(false);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Button variant="filled" onClick={() => setMainOpen(true)}>
        Edit post-deploy hook
      </Button>
      <Text size="sm" c="dimmed" ml="sm" span>Configure the post-deploy lifecycle hook</Text>

      <Modal
        opened={mainOpen}
        onClose={() => setMainOpen(false)}
        title="Hook script"
        size="lg"
      >
        <div
          ref={editorRef}
          style={{ border: '1px solid #dee2e6', borderRadius: 4, minHeight: 150, marginBottom: 16 }}
          data-testid="codemirror-editor"
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={() => setMainOpen(false)}>Cancel</Button>
          <Button variant="filled" onClick={handleSave} data-testid="save-hook">Save</Button>
        </Group>
      </Modal>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm changes"
        size="sm"
      >
        <Stack>
          <Text size="sm">Are you sure you want to save these hook changes?</Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="filled" color="red" onClick={handleConfirm} data-testid="confirm-hook">
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
