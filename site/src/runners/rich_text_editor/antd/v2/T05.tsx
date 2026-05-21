'use client';

/**
 * rich_text_editor-antd-v2-T05: Row-local clear formatting in the correct table row
 *
 * An Ant Design Table with two rows: "Gateway" and "Billing". Each row has a compact
 * TipTap editor in the "Runbook reply" column and a row-local Save button.
 * Gateway starts with `Deploy now.` (`Deploy` bold, `now` italic).
 * Billing starts with `Hold release.`
 *
 * Success: Gateway text stays `Deploy now.` with all formatting removed.
 * Billing unchanged. Gateway row Save clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Table, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const { Text } = Typography;

function MiniEditor({ initialContent, label }: { initialContent: string; label: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialContent,
  });

  return { editor, label };
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [gatewaySaved, setGatewaySaved] = useState(false);

  const gatewayEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p><strong>Deploy</strong> <em>now</em>.</p>',
  });

  const billingEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Hold release.</p>',
  });

  const handleGatewaySave = useCallback(() => {
    setGatewaySaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !gatewaySaved || !gatewayEditor || !billingEditor) return;

    const gwText = gatewayEditor.getText();
    if (!textsMatch(gwText, 'Deploy now.', { normalize: true, ignoreTrailingNewline: true })) return;

    const gwHtml = gatewayEditor.getHTML();
    if (/<strong>|<em>|<u>|<s>|<mark|<code>|<a /.test(gwHtml.replace(/<\/?p>/g, ''))) return;

    const billingText = billingEditor.getText();
    if (!textsMatch(billingText, 'Hold release.', { normalize: true, ignoreTrailingNewline: true })) return;

    successFired.current = true;
    onSuccess();
  }, [gatewaySaved, gatewayEditor, billingEditor, onSuccess]);

  const columns = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 100 },
    {
      title: 'Runbook reply',
      dataIndex: 'editor',
      key: 'editor',
      render: (_: any, record: any) => {
        const ed = record.key === 'gateway' ? gatewayEditor : billingEditor;
        return (
          <div style={{ border: '1px solid #434343', borderRadius: 4 }}>
            <Space wrap style={{ padding: 4, borderBottom: '1px solid #434343' }}>
              <Button size="small" icon={<BoldOutlined />} onClick={() => ed?.chain().focus().toggleBold().run()} />
              <Button size="small" icon={<ItalicOutlined />} onClick={() => ed?.chain().focus().toggleItalic().run()} />
              <Button size="small" icon={<ClearOutlined />} onClick={() => ed?.chain().focus().selectAll().unsetAllMarks().run()} />
            </Space>
            <EditorContent editor={ed} />
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
          onClick={record.key === 'gateway' ? handleGatewaySave : undefined}
        >
          Save
        </Button>
      ),
    },
  ];

  const data = [
    { key: 'gateway', service: 'Gateway' },
    { key: 'billing', service: 'Billing' },
  ];

  return (
    <div style={{ padding: 24, background: '#141414', minHeight: '100vh' }}>
      <Card
        title="Runbook replies"
        style={{ background: '#1f1f1f', borderColor: '#434343' }}
        styles={{ header: { color: '#e0e0e0', borderBottom: '1px solid #434343' }, body: { padding: 0 } }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          style={{ background: '#1f1f1f' }}
        />
      </Card>

      <style>{`
        .ProseMirror { min-height: 32px; padding: 4px 8px; outline: none; color: #e0e0e0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
        .ant-table { background: #1f1f1f !important; }
        .ant-table-cell { background: #1f1f1f !important; color: #e0e0e0 !important; border-color: #434343 !important; }
        .ant-table-thead .ant-table-cell { background: #2a2a2a !important; }
      `}</style>
    </div>
  );
}
