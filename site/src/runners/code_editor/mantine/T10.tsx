'use client';

/**
 * code_editor-mantine-T10: Edit code editor in table cell (Rule B)
 *
 * Table-cell scene: a compact Mantine Table titled "Header rewrite rules" with two rows (Rule A and Rule B).
 * Each row has multiple cells (Name, Enabled toggle, Example) and a small code editor cell (same canonical_type)
 * for "Patch".
 * Editors are rendered in small size inside table cells (limited height, showing ~6 lines). Spacing is compact.
 * The Example cell for each row contains a read-only code block showing the desired patch for that row.
 * Target instance: the "Patch" editor in the Rule B row (second row). It has its own Save icon button at the end
 * of the row.
 * Initial state: Rule B Patch editor contains placeholder `[]`.
 * Clicking Save for Rule B commits that row's editor content and shows a small inline checkmark "Saved" in the row.
 *
 * Success: The Rule B Patch editor content equals the target patch exactly.
 * Rule B Save has been clicked (commit occurred) and the row reports Saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Text, Table, Switch, ActionIcon, Badge, Group, Box } from '@mantine/core';
import { IconDeviceFloppy, IconCheck } from '@tabler/icons-react';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const RULE_A_EXAMPLE = `[
  { "op": "add", "path": "/headers/X-Auth", "value": "token" }
]`;

const RULE_B_EXAMPLE = `[
  { "op": "add", "path": "/headers/X-Trace", "value": "1" }
]`;

const RULE_B_TARGET = `[
  { "op": "add", "path": "/headers/X-Trace", "value": "1" }
]`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const ruleAEditorRef = useRef<HTMLDivElement>(null);
  const ruleBEditorRef = useRef<HTMLDivElement>(null);
  const ruleAViewRef = useRef<EditorView | null>(null);
  const ruleBViewRef = useRef<EditorView | null>(null);
  
  const [ruleBContent, setRuleBContent] = useState('[]');
  const [ruleBSaved, setRuleBSaved] = useState(false);
  const successFired = useRef(false);

  // Initialize Rule A CodeMirror
  useEffect(() => {
    if (!ruleAEditorRef.current || ruleAViewRef.current) return;

    const state = EditorState.create({
      doc: '[]',
      extensions: [basicSetup, keymap.of([indentWithTab]), json(), indentUnit.of('  ')],
    });

    ruleAViewRef.current = new EditorView({
      state,
      parent: ruleAEditorRef.current,
    });

    return () => {
      ruleAViewRef.current?.destroy();
      ruleAViewRef.current = null;
    };
  }, []);

  // Initialize Rule B CodeMirror
  useEffect(() => {
    if (!ruleBEditorRef.current || ruleBViewRef.current) return;

    const state = EditorState.create({
      doc: '[]',
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        json(),
        indentUnit.of('  '),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setRuleBContent(update.state.doc.toString());
            setRuleBSaved(false);
          }
        }),
      ],
    });

    ruleBViewRef.current = new EditorView({
      state,
      parent: ruleBEditorRef.current,
    });

    return () => {
      ruleBViewRef.current?.destroy();
      ruleBViewRef.current = null;
    };
  }, []);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (ruleBSaved && contentMatches(ruleBContent, RULE_B_TARGET, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [ruleBContent, ruleBSaved, onSuccess]);

  const handleRuleBSave = useCallback(() => {
    setRuleBSaved(true);
  }, []);

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder style={{ width: 850 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">Header rewrite rules</Text>
      
      <Table highlightOnHover withTableBorder withColumnBorders style={{ fontSize: 13 }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 100 }}>Name</Table.Th>
            <Table.Th style={{ width: 80 }}>Enabled</Table.Th>
            <Table.Th style={{ width: 200 }}>Example</Table.Th>
            <Table.Th style={{ width: 250 }}>Patch</Table.Th>
            <Table.Th style={{ width: 80 }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* Rule A */}
          <Table.Tr data-testid="row-rule-a">
            <Table.Td>Rule A</Table.Td>
            <Table.Td><Switch size="xs" defaultChecked /></Table.Td>
            <Table.Td>
              <pre style={{ 
                margin: 0, 
                fontSize: 10, 
                background: '#f8f9fa', 
                padding: 4, 
                borderRadius: 2,
                whiteSpace: 'pre-wrap',
              }} data-testid="example-rule-a">
                {RULE_A_EXAMPLE}
              </pre>
            </Table.Td>
            <Table.Td>
              <div 
                ref={ruleAEditorRef}
                style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: 2,
                  maxHeight: 80,
                  overflow: 'auto',
                }}
              />
            </Table.Td>
            <Table.Td>
              <ActionIcon variant="subtle" size="sm" data-testid="save-rule-a">
                <IconDeviceFloppy size={14} />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>

          {/* Rule B - Target */}
          <Table.Tr data-testid="row-rule-b">
            <Table.Td>Rule B</Table.Td>
            <Table.Td><Switch size="xs" defaultChecked /></Table.Td>
            <Table.Td>
              <pre style={{ 
                margin: 0, 
                fontSize: 10, 
                background: '#f8f9fa', 
                padding: 4, 
                borderRadius: 2,
                whiteSpace: 'pre-wrap',
              }} data-testid="example-rule-b">
                {RULE_B_EXAMPLE}
              </pre>
            </Table.Td>
            <Table.Td>
              <div 
                ref={ruleBEditorRef}
                style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: 2,
                  maxHeight: 80,
                  overflow: 'auto',
                }}
                data-testid="editor-rule-b"
              />
            </Table.Td>
            <Table.Td>
              <Group gap={4}>
                <ActionIcon 
                  variant="subtle" 
                  size="sm" 
                  onClick={handleRuleBSave}
                  data-testid="save-rule-b"
                >
                  <IconDeviceFloppy size={14} />
                </ActionIcon>
                {ruleBSaved && <IconCheck size={14} color="green" />}
              </Group>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
