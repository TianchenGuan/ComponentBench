'use client';

/**
 * context_menu-antd-T10: Set multiple View options toggles
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=bottom_left, scale=default, instances=1.
 *
 * Target element: a large text area labeled "Editor" shows a few lines of code-like text.
 * Right-clicking inside the editor opens a context menu.
 *
 * Context menu: AntD Dropdown trigger=['contextMenu'] with a nested AntD Menu.
 * The submenu "View options" contains checkable items and is configured with closeOnItemClick=false
 * so toggling check items does not close the menu.
 *
 * Menu structure:
 * - Undo
 * - Redo
 * - View options ▸
 *     - Show line numbers (checkable)
 *     - Word wrap (checkable)
 *     - Minimap (checkable)
 *
 * Initial state:
 * - Show line numbers: OFF
 * - Word wrap: ON
 * - Minimap: ON
 *
 * Success: Inside View options, the checked states match: Show line numbers=true, Word wrap=true, Minimap=false.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

interface ViewOptions {
  showLineNumbers: boolean;
  wordWrap: boolean;
  minimap: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    showLineNumbers: false,
    wordWrap: true,
    minimap: true,
  });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    // Success: Show line numbers=true, Word wrap=true, Minimap=false
    if (
      viewOptions.showLineNumbers === true &&
      viewOptions.wordWrap === true &&
      viewOptions.minimap === false &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [viewOptions, successTriggered, onSuccess]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'show-line-numbers') {
      setViewOptions((prev) => ({ ...prev, showLineNumbers: !prev.showLineNumbers }));
    } else if (key === 'word-wrap') {
      setViewOptions((prev) => ({ ...prev, wordWrap: !prev.wordWrap }));
    } else if (key === 'minimap') {
      setViewOptions((prev) => ({ ...prev, minimap: !prev.minimap }));
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'undo', label: 'Undo' },
    { key: 'redo', label: 'Redo' },
    {
      key: 'view-options',
      label: 'View options',
      children: [
        {
          key: 'show-line-numbers',
          label: 'Show line numbers',
          icon: viewOptions.showLineNumbers ? <CheckOutlined /> : null,
        },
        {
          key: 'word-wrap',
          label: 'Word wrap',
          icon: viewOptions.wordWrap ? <CheckOutlined /> : null,
        },
        {
          key: 'minimap',
          label: 'Minimap',
          icon: viewOptions.minimap ? <CheckOutlined /> : null,
        },
      ],
    },
  ];

  const codeLines = [
    'function calculateTotal(items) {',
    '  return items.reduce((sum, item) => {',
    '    return sum + item.price * item.qty;',
    '  }, 0);',
    '}',
    '',
    'export { calculateTotal };',
  ];

  return (
    <Card title="Editor" style={{ width: 500 }}>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['contextMenu']}
      >
        <div
          style={{
            width: '100%',
            minHeight: 200,
            background: '#1e1e1e',
            borderRadius: 4,
            padding: 16,
            cursor: 'context-menu',
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.6,
            color: '#d4d4d4',
            display: 'flex',
          }}
          data-testid="editor-area"
          data-view-options={JSON.stringify(viewOptions)}
        >
          {viewOptions.showLineNumbers && (
            <div style={{ marginRight: 16, color: '#858585', userSelect: 'none' }}>
              {codeLines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, whiteSpace: viewOptions.wordWrap ? 'pre-wrap' : 'pre' }}>
            {codeLines.map((line, i) => (
              <div key={i}>{line || ' '}</div>
            ))}
          </div>
          {viewOptions.minimap && (
            <div
              style={{
                width: 60,
                marginLeft: 16,
                background: '#252526',
                borderRadius: 2,
                padding: 4,
              }}
            >
              <div style={{ fontSize: 3, lineHeight: 1.2, color: '#666' }}>
                {codeLines.map((line, i) => (
                  <div key={i}>{line.substring(0, 20)}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Dropdown>
      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        <div>View options:</div>
        <div>• Show line numbers: <strong data-testid="opt-line-numbers">{viewOptions.showLineNumbers ? 'ON' : 'OFF'}</strong></div>
        <div>• Word wrap: <strong data-testid="opt-word-wrap">{viewOptions.wordWrap ? 'ON' : 'OFF'}</strong></div>
        <div>• Minimap: <strong data-testid="opt-minimap">{viewOptions.minimap ? 'ON' : 'OFF'}</strong></div>
      </div>
    </Card>
  );
}
