'use client';

/**
 * code_editor-antd-v2-T02: Secondary YAML editor exact match with local save
 *
 * Settings panel with two stacked CodeMirror editors: "Primary — Deployment script" (JS, distractor)
 * and "Secondary — Environment config" (YAML, target). Each card has an Example block and Save button.
 * Success: Secondary matches the Example YAML, Primary unchanged, Secondary saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { yaml } from '@codemirror/lang-yaml';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const { Text } = Typography;

const PRIMARY_CONTENT = 'deploy();';
const SECONDARY_INITIAL = '# env config';
const SECONDARY_TARGET = `env:
  MODE: production
  DEBUG: "false"`;

export default function T02({ onSuccess }: TaskComponentProps) {
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const primaryViewRef = useRef<EditorView | null>(null);
  const secondaryViewRef = useRef<EditorView | null>(null);

  const [primaryContent, setPrimaryContent] = useState(PRIMARY_CONTENT);
  const [secondaryContent, setSecondaryContent] = useState(SECONDARY_INITIAL);
  const [secondarySaved, setSecondarySaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!primaryRef.current || primaryViewRef.current) return;
    const state = EditorState.create({
      doc: PRIMARY_CONTENT,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) setPrimaryContent(update.state.doc.toString());
        }),
      ],
    });
    primaryViewRef.current = new EditorView({ state, parent: primaryRef.current });
    return () => { primaryViewRef.current?.destroy(); primaryViewRef.current = null; };
  }, []);

  useEffect(() => {
    if (!secondaryRef.current || secondaryViewRef.current) return;
    const state = EditorState.create({
      doc: SECONDARY_INITIAL,
      extensions: [
        basicSetup,
        yaml(),
        indentUnit.of('  '),
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setSecondaryContent(update.state.doc.toString());
            setSecondarySaved(false);
          }
        }),
      ],
    });
    secondaryViewRef.current = new EditorView({ state, parent: secondaryRef.current });
    return () => { secondaryViewRef.current?.destroy(); secondaryViewRef.current = null; };
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    if (!secondarySaved) return;
    if (
      contentMatches(secondaryContent, SECONDARY_TARGET, {
        normalizeLineEndings: true,
        ignoreTrailingWhitespace: true,
        allowTrailingNewline: true,
      }) &&
      contentMatches(primaryContent, PRIMARY_CONTENT, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      })
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [secondaryContent, primaryContent, secondarySaved, onSuccess]);

  const handleSecondarySave = useCallback(() => {
    setSecondarySaved(true);
  }, []);

  return (
    <div style={{ width: 600 }}>
      <Card title="Primary — Deployment script" size="small" style={{ marginBottom: 16 }} data-testid="editor-primary">
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div ref={primaryRef} style={{ border: '1px solid #d9d9d9', borderRadius: 4, minHeight: 80 }} />
          </div>
          <Card size="small" style={{ flex: 1, background: '#fafafa' }} title="Example">
            <pre style={{ fontSize: 12, margin: 0 }}>{PRIMARY_CONTENT}</pre>
          </Card>
        </div>
        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button size="small" data-testid="save-primary">Save</Button>
        </Space>
      </Card>

      <Card title="Secondary — Environment config" size="small" data-testid="editor-secondary">
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div ref={secondaryRef} style={{ border: '1px solid #d9d9d9', borderRadius: 4, minHeight: 100 }} />
          </div>
          <Card size="small" style={{ flex: 1, background: '#fafafa' }} title="Example">
            <pre style={{ fontSize: 12, margin: 0 }}>{SECONDARY_TARGET}</pre>
          </Card>
        </div>
        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button size="small" type="primary" onClick={handleSecondarySave} data-testid="save-secondary-environment">
            Save
          </Button>
        </Space>
      </Card>
    </div>
  );
}
