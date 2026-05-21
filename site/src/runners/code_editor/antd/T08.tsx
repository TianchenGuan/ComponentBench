'use client';

/**
 * code_editor-antd-T08: Edit secondary YAML config (2 editors)
 *
 * Form section layout: a "Deployment" form with multiple fields (Name, Region, Notes) and
 * two code editor cards stacked vertically.
 * Spacing mode is compact and components are rendered at the small size tier.
 * Editor instances (same canonical_type) on page:
 *   1) "Primary — Deployment script" (CodeMirror 6, JavaScript mode)
 *   2) "Secondary — Environment config" (CodeMirror 6, YAML mode)
 * Each card has its own toolbar with a small Apply button on the right.
 * Initial state: Primary contains a short script; Secondary contains placeholder text `# env config`.
 * Only the Secondary editor content matters for this task; other form inputs are distractors.
 * Clicking Apply in a card commits that editor's value and changes a status text from "Unsaved" to "Saved".
 *
 * Success: The Secondary — Environment config editor content equals the target YAML.
 * The change is committed by pressing the Secondary editor's Apply control.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Space, Typography, Input, Select, Form } from 'antd';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { yaml } from '@codemirror/lang-yaml';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const PRIMARY_CONTENT = `// Deployment script
export async function deploy() {
  console.log("Deploying...");
}`;

const SECONDARY_INITIAL = '# env config';

const TARGET_CONTENT = `env:
  MODE: production
  DEBUG: "false"`;

export default function T08({ onSuccess }: TaskComponentProps) {
  const primaryEditorRef = useRef<HTMLDivElement>(null);
  const secondaryEditorRef = useRef<HTMLDivElement>(null);
  const primaryViewRef = useRef<EditorView | null>(null);
  const secondaryViewRef = useRef<EditorView | null>(null);
  
  const [secondaryContent, setSecondaryContent] = useState(SECONDARY_INITIAL);
  const [secondarySaved, setSecondarySaved] = useState(false);
  const successFired = useRef(false);

  // Initialize Primary CodeMirror (read-only distractor)
  useEffect(() => {
    if (!primaryEditorRef.current || primaryViewRef.current) return;

    const state = EditorState.create({
      doc: PRIMARY_CONTENT,
      extensions: [basicSetup, javascript()],
    });

    primaryViewRef.current = new EditorView({
      state,
      parent: primaryEditorRef.current,
    });

    return () => {
      primaryViewRef.current?.destroy();
      primaryViewRef.current = null;
    };
  }, []);

  // Initialize Secondary CodeMirror
  useEffect(() => {
    if (!secondaryEditorRef.current || secondaryViewRef.current) return;

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

    secondaryViewRef.current = new EditorView({
      state,
      parent: secondaryEditorRef.current,
    });

    return () => {
      secondaryViewRef.current?.destroy();
      secondaryViewRef.current = null;
    };
  }, []);

  // Check for success — strip all leading whitespace per line and compare
  // just the content structure (indentation is irrelevant for this simple YAML)
  useEffect(() => {
    if (successFired.current) return;
    if (!secondarySaved) return;
    
    const stripIndent = (s: string) =>
      s.replace(/\r\n/g, '\n')
       .split('\n')
       .map(line => line.trim())
       .filter(line => line.length > 0)
       .join('\n');
    
    if (stripIndent(secondaryContent) === stripIndent(TARGET_CONTENT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [secondaryContent, secondarySaved, onSuccess]);

  const handleSecondaryApply = useCallback(() => {
    setSecondarySaved(true);
  }, []);

  return (
    <div style={{ width: 550 }}>
      <Card title="Deployment" size="small" style={{ marginBottom: 16 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="Name">
            <Input placeholder="my-app" size="small" />
          </Form.Item>
          <Form.Item label="Region">
            <Select 
              size="small"
              placeholder="Select region"
              options={[
                { value: 'us-east', label: 'US East' },
                { value: 'eu-west', label: 'EU West' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Notes">
            <Input.TextArea rows={2} size="small" />
          </Form.Item>
        </Form>
      </Card>

      {/* Primary Editor - Distractor */}
      <Card 
        title="Primary — Deployment script" 
        size="small" 
        style={{ marginBottom: 16 }}
        data-testid="editor-primary"
      >
        <Space style={{ marginBottom: 8, width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Unsaved</Text>
          <Button size="small" data-testid="apply-primary">Apply</Button>
        </Space>
        <div 
          ref={primaryEditorRef} 
          style={{ 
            border: '1px solid #d9d9d9', 
            borderRadius: 4,
            minHeight: 100,
          }}
        />
      </Card>

      {/* Secondary Editor - Target */}
      <Card 
        title="Secondary — Environment config" 
        size="small"
        data-testid="editor-secondary"
      >
        <Space style={{ marginBottom: 8, width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {secondarySaved ? 'Saved' : 'Unsaved'}
          </Text>
          <Button size="small" onClick={handleSecondaryApply} data-testid="apply-secondary">
            Apply
          </Button>
        </Space>
        <div 
          ref={secondaryEditorRef} 
          style={{ 
            border: '1px solid #d9d9d9', 
            borderRadius: 4,
            minHeight: 120,
          }}
        />
      </Card>
    </div>
  );
}
