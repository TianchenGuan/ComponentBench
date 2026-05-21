'use client';

/**
 * rich_text_editor-antd-v2-T12: Bubble-menu formatting in the correct service row
 *
 * An Ant Design Table with two rows: "Auth" and "Billing". Each row has a compact
 * TipTap editor and a row-local Save. Editors have no fixed toolbar; selecting text
 * reveals a BubbleMenu with Bold and Italic.
 *
 * Success: Auth row text stays `Deploy is blocked today.` with only `blocked` bold.
 * Billing row unchanged. Auth row Save clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Table, Space } from 'antd';
import { BoldOutlined, ItalicOutlined } from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Editor } from '@tiptap/react';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const { Text } = Typography;

function SelectionToolbar({ editor }: { editor: Editor | null }) {
  const [hasSelection, setHasSelection] = useState(false);
  useEffect(() => {
    if (!editor) return;
    const update = () => { const { from, to } = editor.state.selection; setHasSelection(from !== to); };
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => { editor.off('selectionUpdate', update); editor.off('transaction', update); };
  }, [editor]);
  if (!editor || !hasSelection) return null;
  return (
    <Space size={2} style={{ marginBottom: 2 }}>
      <Button size="small" type={editor.isActive('bold') ? 'primary' : 'default'} icon={<BoldOutlined />} onClick={() => editor.chain().focus().toggleBold().run()} />
      <Button size="small" type={editor.isActive('italic') ? 'primary' : 'default'} icon={<ItalicOutlined />} onClick={() => editor.chain().focus().toggleItalic().run()} />
    </Space>
  );
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [authSaved, setAuthSaved] = useState(false);

  const authEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Deploy is blocked today.</p>',
  });

  const billingEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Ready to ship.</p>',
  });

  const handleAuthSave = useCallback(() => {
    setAuthSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !authSaved || !authEditor || !billingEditor) return;

    const authText = authEditor.getText();
    if (!textsMatch(authText, 'Deploy is blocked today.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = authEditor.getHTML();
    const boldMatches = html.match(/<strong>[^<]+<\/strong>/g) || [];
    if (boldMatches.length !== 1 || !/^\s*blocked\s*$/.test(boldMatches[0].replace(/<\/?strong>/g, ''))) return;

    const billingText = billingEditor.getText();
    if (!textsMatch(billingText, 'Ready to ship.', { normalize: true, ignoreTrailingNewline: true })) return;

    successFired.current = true;
    onSuccess();
  }, [authSaved, authEditor, billingEditor, onSuccess]);

  const columns = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 100 },
    {
      title: 'Status',
      key: 'editor',
      render: (_: any, record: any) => {
        const ed = record.key === 'auth' ? authEditor : billingEditor;
        return (
          <div>
            <SelectionToolbar editor={ed} />
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
              <EditorContent editor={ed} />
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Button
          size="small"
          type="primary"
          data-testid={`save-${record.key}-row`}
          onClick={record.key === 'auth' ? handleAuthSave : undefined}
        >
          Save
        </Button>
      ),
    },
  ];

  const data = [
    { key: 'auth', service: 'Auth' },
    { key: 'billing', service: 'Billing' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Service statuses"
        data-testid="service-table-card"
        styles={{ body: { padding: 0 } }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
        />
      </Card>

      <style>{`
        .ProseMirror { min-height: 32px; padding: 4px 8px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
      `}</style>
    </div>
  );
}
