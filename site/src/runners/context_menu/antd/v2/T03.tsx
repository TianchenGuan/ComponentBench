'use client';

/**
 * context_menu-antd-v2-T03: Sandbox B — View toggles; Sandbox A must stay unchanged
 */

import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Dropdown, Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

type View = { lineNumbers: boolean; wordWrap: boolean; diagnostics: boolean; minimap: boolean };

const INITIAL_A: View = {
  lineNumbers: true,
  wordWrap: true,
  diagnostics: false,
  minimap: true,
};

function viewsEqual(a: View, b: View) {
  return (
    a.lineNumbers === b.lineNumbers &&
    a.wordWrap === b.wordWrap &&
    a.diagnostics === b.diagnostics &&
    a.minimap === b.minimap
  );
}

function EditorPane({
  label,
  view,
  setView,
}: {
  label: string;
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (key: keyof View) => {
    setView((v) => ({ ...v, [key]: !v[key] }));
    setTimeout(() => setOpen(true), 0);
  };

  const items: MenuProps['items'] = [
    { key: 'undo', label: 'Undo' },
    {
      key: 'view',
      label: 'View',
      children: [
        {
          key: 'ln',
          label: `${view.lineNumbers ? '✓ ' : ''}Line numbers`,
        },
        {
          key: 'ww',
          label: `${view.wordWrap ? '✓ ' : ''}Word wrap`,
        },
        {
          key: 'diag',
          label: `${view.diagnostics ? '✓ ' : ''}Diagnostics`,
        },
        {
          key: 'mm',
          label: `${view.minimap ? '✓ ' : ''}Minimap`,
        },
      ],
    },
    { key: 'theme', label: 'Theme' },
    { key: 'indent', label: 'Indentation' },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'ln') toggle('lineNumbers');
    else if (key === 'ww') toggle('wordWrap');
    else if (key === 'diag') toggle('diagnostics');
    else if (key === 'mm') toggle('minimap');
  };

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={['contextMenu']}
      dropdownRender={() => (
        <div
          className="ant-dropdown-menu"
          style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.12)', borderRadius: 8, background: '#fff' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Menu
            mode="vertical"
            selectable={false}
            triggerSubMenuAction="click"
            items={items}
            onClick={onClick}
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </div>
      )}
    >
      <div
        style={{
          flex: 1,
          minHeight: 120,
          background: '#1e1e1e',
          color: '#ccc',
          fontFamily: 'monospace',
          fontSize: 10,
          padding: 8,
          cursor: 'context-menu',
          borderRadius: 4,
          border: '1px solid #333',
        }}
        data-instance-label={label}
        data-view-state={JSON.stringify(view)}
        data-testid={`editor-${label.replace(/\s/g, '-').toLowerCase()}`}
      >
        <div style={{ color: '#888', marginBottom: 4 }}>{label}</div>
        <div>const x = 1;</div>
        <div>export default x;</div>
      </div>
    </Dropdown>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [viewA, setViewA] = useState<View>({ ...INITIAL_A });
  const [viewB, setViewB] = useState<View>({
    lineNumbers: false,
    wordWrap: false,
    diagnostics: false,
    minimap: true,
  });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const bOk =
      viewB.lineNumbers && viewB.wordWrap && viewB.diagnostics && !viewB.minimap;
    if (bOk && viewsEqual(viewA, INITIAL_A)) {
      successFired.current = true;
      onSuccess();
    }
  }, [viewA, viewB, onSuccess]);

  return (
    <Drawer
      title="Editor preferences"
      placement="right"
      open
      closable={false}
      onClose={() => {}}
      width={420}
      mask={false}
      getContainer={false}
      styles={{ body: { paddingTop: 12 } }}
    >
      <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
        <EditorPane label="Sandbox A" view={viewA} setView={setViewA} />
        <EditorPane label="Sandbox B" view={viewB} setView={setViewB} />
      </div>
      <div style={{ marginTop: 12, color: '#999', fontSize: 10 }}>Footer: Close (preview only)</div>
    </Drawer>
  );
}
