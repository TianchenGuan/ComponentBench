'use client';

/**
 * code_editor-antd-T10: Match reference snippet (dashboard)
 *
 * Dashboard-style layout in dark theme: left sidebar shows a fake file tree and recent runs
 * (non-interactive labels), main area has two panels.
 * Top panel is a read-only "Reference" code block (monospace) showing the target snippet the user should match.
 * Bottom panel is the composite code editor (CodeMirror 6) with a toolbar (Apply button, Clear icon).
 * Initial state: the editor contains a different snippet (a placeholder `// start here`).
 * Apply commits the editor content and shows an inline status "Saved" under the editor.
 * Only the editor content (after Apply) is checked for success; sidebar items are clutter only.
 *
 * Success: The editor content exactly matches the Reference panel snippet (exact characters and newlines).
 * Apply has been clicked to commit the value.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Space, Typography, ConfigProvider, theme, Layout } from 'antd';
import { DeleteOutlined, FileOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

const REFERENCE_CONTENT = `export const config = {
  retries: 3,
  backoffMs: 250
};`;

const INITIAL_CONTENT = '// start here';

export default function T10({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  // Initialize CodeMirror with dark theme
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: INITIAL_CONTENT,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
        EditorView.theme({
          '&': { backgroundColor: '#1f1f1f' },
          '.cm-content': { color: '#d4d4d4' },
          '.cm-gutters': { backgroundColor: '#1f1f1f', color: '#858585', border: 'none' },
          '.cm-activeLineGutter': { backgroundColor: '#2a2a2a' },
          '.cm-activeLine': { backgroundColor: '#2a2a2a' },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString());
            setSaved(false);
          }
        }),
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
    if (saved && contentMatches(content, REFERENCE_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, onSuccess]);

  const handleApply = useCallback(() => {
    setSaved(true);
  }, []);

  const handleClear = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: '',
      },
    });
  }, []);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Layout style={{ minHeight: 500, background: '#141414' }}>
        {/* Sidebar - Clutter */}
        <Sider width={180} style={{ background: '#1f1f1f', padding: 16 }}>
          <Text strong style={{ color: '#fff', fontSize: 12 }}>FILES</Text>
          <div style={{ marginTop: 12 }}>
            <div style={{ color: '#888', fontSize: 12, padding: '4px 0' }}>
              <FileOutlined style={{ marginRight: 8 }} />config.js
            </div>
            <div style={{ color: '#888', fontSize: 12, padding: '4px 0' }}>
              <FileOutlined style={{ marginRight: 8 }} />utils.js
            </div>
          </div>
          <Text strong style={{ color: '#fff', fontSize: 12, marginTop: 24, display: 'block' }}>RECENT RUNS</Text>
          <div style={{ marginTop: 12 }}>
            <div style={{ color: '#888', fontSize: 12, padding: '4px 0' }}>
              <PlayCircleOutlined style={{ marginRight: 8 }} />Run #42
            </div>
            <div style={{ color: '#888', fontSize: 12, padding: '4px 0' }}>
              <PlayCircleOutlined style={{ marginRight: 8 }} />Run #41
            </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Content style={{ padding: 16 }}>
          {/* Reference Panel */}
          <Card 
            size="small" 
            title={<Text style={{ color: '#fff' }}>Reference</Text>}
            style={{ marginBottom: 16, background: '#1f1f1f' }}
            styles={{ body: { padding: 12 } }}
            data-testid="ref-antd-10"
          >
            <pre style={{ 
              margin: 0, 
              fontFamily: 'monospace', 
              fontSize: 13,
              color: '#d4d4d4',
              background: '#2d2d2d',
              padding: 12,
              borderRadius: 4,
              whiteSpace: 'pre-wrap',
            }}>
              {REFERENCE_CONTENT}
            </pre>
          </Card>

          {/* Editor Panel */}
          <Card 
            size="small"
            title={<Text style={{ color: '#fff' }}>Editor</Text>}
            style={{ background: '#1f1f1f' }}
            styles={{ body: { padding: 12 } }}
            data-testid="code-editor-card"
          >
            <Space style={{ marginBottom: 12 }}>
              <Button size="small" type="primary" onClick={handleApply} data-testid="editor-apply">
                Apply
              </Button>
              <Button size="small" icon={<DeleteOutlined />} onClick={handleClear} />
            </Space>
            <div 
              ref={editorRef} 
              style={{ 
                border: '1px solid #424242', 
                borderRadius: 4,
                minHeight: 150,
              }}
            />
            {saved && (
              <Text type="success" style={{ marginTop: 8, display: 'block', fontSize: 12 }}>
                Saved
              </Text>
            )}
          </Card>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
