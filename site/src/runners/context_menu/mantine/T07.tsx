'use client';

/**
 * context_menu-mantine-T07: Compact settings: set View checkmarks
 *
 * Scene: theme=light, spacing=compact, layout=settings_panel, placement=center, scale=default, instances=1.
 *
 * Layout: settings_panel centered, styled like an editor preferences pane.
 * COMPACT spacing mode (reduced padding) is enabled for the panel.
 *
 * Target element: a text area labeled "Markdown editor". Right-clicking inside it opens
 * a custom context menu.
 *
 * Context menu: composed from Mantine Menu with a submenu "View".
 * The View submenu contains several checkable items.
 *
 * Menu structure:
 * - Undo
 * - Redo
 * - View ▸
 *     - Show preview (checkable)
 *     - Show toolbar (checkable)
 *     - Spell check (checkable)
 *     - Word wrap (checkable)
 *
 * Initial checked state in View:
 * - Show preview: OFF
 * - Show toolbar: ON
 * - Spell check: OFF
 * - Word wrap: ON
 *
 * Success: In the View submenu, the checked states match: Show preview=true, Show toolbar=false, Spell check=true, Word wrap=true.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Box } from '@mantine/core';
import { IconCheck, IconChevronRight } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ViewOptions {
  showPreview: boolean;
  showToolbar: boolean;
  spellCheck: boolean;
  wordWrap: boolean;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    showPreview: false,
    showToolbar: true,
    spellCheck: false,
    wordWrap: true,
  });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    // Success: Show preview=true, Show toolbar=false, Spell check=true, Word wrap=true
    if (
      viewOptions.showPreview === true &&
      viewOptions.showToolbar === false &&
      viewOptions.spellCheck === true &&
      viewOptions.wordWrap === true &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [viewOptions, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const toggleOption = (key: keyof ViewOptions) => {
    setViewOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    // Keep menu open for toggle
  };

  const editorContent = `# Welcome to Markdown Editor

This is a sample document with some **bold** and *italic* text.

## Features
- Live preview
- Syntax highlighting
- Spell checking

Start typing to begin...`;

  return (
    <Paper shadow="sm" p="sm" radius="md" style={{ width: 500 }}>
      <Text size="md" fw={500} mb="xs">Markdown editor</Text>
      
      <Menu
        opened={menuOpen}
        onChange={setMenuOpen}
        position="bottom-start"
      >
        <Menu.Target>
          <Box
            onContextMenu={handleContextMenu}
            style={{
              width: '100%',
              minHeight: 200,
              background: 'var(--mantine-color-gray-0)',
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: 4,
              padding: 12,
              cursor: 'context-menu',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
            data-testid="editor-area"
            data-view-options={JSON.stringify(viewOptions)}
          >
            {editorContent}
          </Box>
        </Menu.Target>

        <Menu.Dropdown data-testid="context-menu-overlay">
          <Menu.Item onClick={() => setMenuOpen(false)}>Undo</Menu.Item>
          <Menu.Item onClick={() => setMenuOpen(false)}>Redo</Menu.Item>
          <Menu.Divider />
          <Menu
            trigger="hover"
            position="right-start"
            offset={0}
          >
            <Menu.Target>
              <Menu.Item rightSection={<IconChevronRight size={14} />}>
                View
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown data-testid="view-submenu">
              <Menu.Item
                onClick={() => toggleOption('showPreview')}
                leftSection={viewOptions.showPreview ? <IconCheck size={14} /> : <div style={{ width: 14 }} />}
                data-testid="opt-show-preview"
              >
                Show preview
              </Menu.Item>
              <Menu.Item
                onClick={() => toggleOption('showToolbar')}
                leftSection={viewOptions.showToolbar ? <IconCheck size={14} /> : <div style={{ width: 14 }} />}
                data-testid="opt-show-toolbar"
              >
                Show toolbar
              </Menu.Item>
              <Menu.Item
                onClick={() => toggleOption('spellCheck')}
                leftSection={viewOptions.spellCheck ? <IconCheck size={14} /> : <div style={{ width: 14 }} />}
                data-testid="opt-spell-check"
              >
                Spell check
              </Menu.Item>
              <Menu.Item
                onClick={() => toggleOption('wordWrap')}
                leftSection={viewOptions.wordWrap ? <IconCheck size={14} /> : <div style={{ width: 14 }} />}
                data-testid="opt-word-wrap"
              >
                Word wrap
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Menu.Dropdown>
      </Menu>

      <Box mt="sm" style={{ fontSize: 11 }}>
        <Text size="xs" c="dimmed">View options:</Text>
        <Text size="xs" c="dimmed">• Show preview: <strong data-testid="status-preview">{viewOptions.showPreview ? 'ON' : 'OFF'}</strong></Text>
        <Text size="xs" c="dimmed">• Show toolbar: <strong data-testid="status-toolbar">{viewOptions.showToolbar ? 'ON' : 'OFF'}</strong></Text>
        <Text size="xs" c="dimmed">• Spell check: <strong data-testid="status-spellcheck">{viewOptions.spellCheck ? 'ON' : 'OFF'}</strong></Text>
        <Text size="xs" c="dimmed">• Word wrap: <strong data-testid="status-wordwrap">{viewOptions.wordWrap ? 'ON' : 'OFF'}</strong></Text>
      </Box>
    </Paper>
  );
}
