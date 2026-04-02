'use client';

/**
 * markdown_editor-external-T28: Reset content in a drawer with confirmation
 *
 * Layout: drawer_flow — the page has a right-side drawer that contains the editor.
 * Background (clutter low): a simple "Repository" page with a README preview and a button "Edit README".
 * Target component: the Markdown editor inside the "Edit README" drawer.
 * Drawer behavior:
 *   - Click "Edit README" to open a drawer sliding in from the right.
 *   - The drawer header contains actions: "Close", and "Reset".
 * Reset behavior (layering):
 *   - Clicking "Reset" opens an inline confirmation popover inside the drawer ("Reset content to default?").
 *   - Confirmation buttons: "Confirm reset" and "Cancel".
 *   - Only after confirming does the editor content change.
 * Editor configuration:
 *   - Standard toolbar; preview hidden (edit-only).
 * Initial state:
 *   - When opened, the editor contains a modified README with multiple lines (not equal to the default).
 *   - Default template:
 *     # README
 *     Describe your project here.
 * Feedback:
 *   - After confirming reset, the editor content becomes the default template immediately.
 *   - A small inline status text shows "Reset complete".
 *
 * Success: Editor markdown value equals the default README template AND
 *          the reset confirmation control "Confirm reset" has been activated AND
 *          Drawer remains open and the confirmation popover is closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const MODIFIED_CONTENT = `# README - My Project

This is a customized README.

## Features
- Feature A
- Feature B

Please update this content.`;

const DEFAULT_TEMPLATE = `# README
Describe your project here.`;

export default function T28({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editorValue, setEditorValue] = useState<string>(MODIFIED_CONTENT);
  const [confirmPopoverOpen, setConfirmPopoverOpen] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [showResetComplete, setShowResetComplete] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    // Success: editor matches template AND reset was confirmed AND drawer is open AND confirm popover is closed
    if (
      drawerOpen &&
      !confirmPopoverOpen &&
      resetConfirmed &&
      markdownMatches(editorValue, DEFAULT_TEMPLATE)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [editorValue, drawerOpen, confirmPopoverOpen, resetConfirmed, onSuccess]);

  const openDrawer = () => {
    setDrawerOpen(true);
    setEditorValue(MODIFIED_CONTENT);
    setResetConfirmed(false);
    setShowResetComplete(false);
  };

  const handleConfirmReset = () => {
    setEditorValue(DEFAULT_TEMPLATE);
    setConfirmPopoverOpen(false);
    setResetConfirmed(true);
    setShowResetComplete(true);
    setTimeout(() => setShowResetComplete(false), 2000);
  };

  return (
    <div style={{ width: 600 }}>
      {/* Repository page */}
      <div
        style={{
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Repository</h2>
        <div
          style={{
            padding: 16,
            background: '#fafafa',
            borderRadius: 4,
            marginBottom: 16,
            whiteSpace: 'pre-wrap',
            fontSize: 14,
            color: '#333',
            maxHeight: 150,
            overflow: 'auto',
          }}
        >
          {MODIFIED_CONTENT}
        </div>
        <button
          onClick={openDrawer}
          style={{
            padding: '8px 16px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
          data-testid="edit-readme-button"
        >
          Edit README
        </button>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 998,
            }}
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 450,
              background: '#fff',
              boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
            }}
            data-testid="readme-drawer"
          >
            {/* Drawer header */}
            <div
              style={{
                padding: 16,
                borderBottom: '1px solid #e8e8e8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18 }}>Edit README</h3>
              <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                <button
                  onClick={() => setConfirmPopoverOpen(true)}
                  style={{
                    padding: '6px 12px',
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                  data-testid="reset-button"
                >
                  Reset
                </button>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    padding: '6px 12px',
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                  data-testid="close-button"
                >
                  Close
                </button>

                {/* Confirm popover */}
                {confirmPopoverOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 40,
                      right: 0,
                      width: 220,
                      background: '#fff',
                      borderRadius: 6,
                      border: '1px solid #e8e8e8',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      padding: 12,
                      zIndex: 1000,
                    }}
                    data-testid="reset-confirm-popover"
                  >
                    <div style={{ fontSize: 14, marginBottom: 12 }}>Reset content to default?</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setConfirmPopoverOpen(false)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          background: '#fff',
                          color: '#333',
                          border: '1px solid #d9d9d9',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                        data-testid="cancel-reset-button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmReset}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          background: '#ff4d4f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                        data-testid="confirm-reset-button"
                      >
                        Confirm reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, padding: 16, overflow: 'auto' }} data-testid="md-editor-readme">
              {showResetComplete && (
                <div style={{ marginBottom: 12, color: '#52c41a', fontSize: 13 }}>Reset complete</div>
              )}
              <MDEditor
                value={editorValue}
                onChange={(val) => setEditorValue(val || '')}
                preview="edit"
                height={400}
                data-color-mode="light"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
