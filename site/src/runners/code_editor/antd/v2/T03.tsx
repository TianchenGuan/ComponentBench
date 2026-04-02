'use client';

/**
 * code_editor-antd-v2-T03: Rule B JSON patch in dense table cell
 *
 * Two table-style rows (Rule A and Rule B) each with a compact CodeMirror JSON patch editor,
 * an Example code block, and a row-local Save button. Rule B editor starts with `[]`.
 * Success: Rule B matches the Example patch, Rule A unchanged, Rule B saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Typography } from 'antd';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const { Text } = Typography;

const RULE_A_CONTENT = '[]';
const RULE_B_INITIAL = '[]';
const RULE_B_TARGET = `[
  { "op": "add", "path": "/headers/X-Trace", "value": "1" }
]`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const ruleARef = useRef<HTMLDivElement>(null);
  const ruleBRef = useRef<HTMLDivElement>(null);
  const ruleAViewRef = useRef<EditorView | null>(null);
  const ruleBViewRef = useRef<EditorView | null>(null);

  const [ruleAContent, setRuleAContent] = useState(RULE_A_CONTENT);
  const [ruleBContent, setRuleBContent] = useState(RULE_B_INITIAL);
  const [ruleBSaved, setRuleBSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!ruleARef.current || ruleAViewRef.current) return;
    const state = EditorState.create({
      doc: RULE_A_CONTENT,
      extensions: [
        basicSetup,
        json(),
        indentUnit.of('  '),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) setRuleAContent(update.state.doc.toString());
        }),
      ],
    });
    ruleAViewRef.current = new EditorView({ state, parent: ruleARef.current });
    return () => { ruleAViewRef.current?.destroy(); ruleAViewRef.current = null; };
  }, []);

  useEffect(() => {
    if (!ruleBRef.current || ruleBViewRef.current) return;
    const state = EditorState.create({
      doc: RULE_B_INITIAL,
      extensions: [
        basicSetup,
        json(),
        indentUnit.of('  '),
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setRuleBContent(update.state.doc.toString());
            setRuleBSaved(false);
          }
        }),
      ],
    });
    ruleBViewRef.current = new EditorView({ state, parent: ruleBRef.current });
    return () => { ruleBViewRef.current?.destroy(); ruleBViewRef.current = null; };
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    if (!ruleBSaved) return;
    if (
      contentMatches(ruleBContent, RULE_B_TARGET, {
        normalizeLineEndings: true,
        ignoreTrailingWhitespace: true,
        allowTrailingNewline: true,
      }) &&
      contentMatches(ruleAContent, RULE_A_CONTENT, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      })
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [ruleBContent, ruleAContent, ruleBSaved, onSuccess]);

  const handleSaveRuleB = useCallback(() => {
    setRuleBSaved(true);
  }, []);

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #d9d9d9',
  };

  return (
    <div style={{ width: 700, border: '1px solid #d9d9d9', borderRadius: 4 }}>
      <div style={{
        display: 'flex',
        padding: '8px 16px',
        background: '#fafafa',
        borderBottom: '1px solid #d9d9d9',
        fontWeight: 600,
        fontSize: 13,
      }}>
        <div style={{ flex: '0 0 80px' }}>Rule</div>
        <div style={{ flex: 1 }}>Patch</div>
        <div style={{ flex: 1 }}>Example</div>
        <div style={{ flex: '0 0 70px' }}>Action</div>
      </div>

      <div style={rowStyle} data-testid="row-rule-a">
        <Text strong style={{ flex: '0 0 80px', paddingTop: 4 }}>Rule A</Text>
        <div style={{ flex: 1 }}>
          <div ref={ruleARef} style={{ border: '1px solid #d9d9d9', borderRadius: 4, minHeight: 60 }} />
        </div>
        <pre style={{ flex: 1, fontSize: 11, margin: 0, background: '#fafafa', padding: 8, borderRadius: 4 }}>{'[]'}</pre>
        <div style={{ flex: '0 0 70px' }}>
          <Button size="small" data-testid="save-rule-a">Save</Button>
        </div>
      </div>

      <div style={{ ...rowStyle, borderBottom: 'none' }} data-testid="row-rule-b">
        <Text strong style={{ flex: '0 0 80px', paddingTop: 4 }}>Rule B</Text>
        <div style={{ flex: 1 }}>
          <div ref={ruleBRef} style={{ border: '1px solid #d9d9d9', borderRadius: 4, minHeight: 60 }} />
        </div>
        <pre style={{ flex: 1, fontSize: 11, margin: 0, background: '#fafafa', padding: 8, borderRadius: 4 }}>{RULE_B_TARGET}</pre>
        <div style={{ flex: '0 0 70px' }}>
          <Button size="small" type="primary" onClick={handleSaveRuleB} data-testid="save-rule-b">Save</Button>
        </div>
      </div>
    </div>
  );
}
