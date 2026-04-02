'use client';

/**
 * window_splitter-mui-v2-T04: Compact three-pane split: 18 / 57 / 25
 *
 * Isolated compact card, three panels Files / Editor / Terminal, thin separators with
 * generous hit targets. Readout lists all three live percentages. Initial ~25/50/25.
 *
 * Success: Files 18%, Editor 57%, Terminal 25% each ±2%.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { ThreePanelSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState(25);
  const [editor, setEditor] = useState(50);
  const [terminal, setTerminal] = useState(25);
  const successFired = useRef(false);

  const handleLayout = useCallback((layout: Record<string, number>) => {
    const f = layout.files;
    const e = layout.editor;
    const t = layout.terminal;
    if (f !== undefined) setFiles(f);
    if (e !== undefined) setEditor(e);
    if (t !== undefined) setTerminal(t);
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const okFiles = files >= 16 && files <= 20;
    const okEd = editor >= 55 && editor <= 59;
    const okTerm = terminal >= 23 && terminal <= 27;
    if (okFiles && okEd && okTerm) {
      successFired.current = true;
      onSuccess();
    }
  }, [files, editor, terminal, onSuccess]);

  return (
    <Card sx={{ width: 520, maxWidth: '100%' }} variant="outlined">
      <CardHeader title="Workspace panes" subheader="Compact three-pane layout" />
      <CardContent>
        <Box
          sx={{
            height: 160,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <ThreePanelSplit
            ids={['files', 'editor', 'terminal']}
            defaultPcts={[25, 50, 25]}
            mins={[8, 15, 8]}
            maxs={[85, 90, 85]}
            onLayoutChange={handleLayout}
            data-testid="three-pane-splitter"
            contents={[
              <Box
                key="files"
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                }}
              >
                <Typography fontWeight={700} fontSize="0.8125rem">Files</Typography>
              </Box>,
              <Box
                key="editor"
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200',
                }}
              >
                <Typography fontWeight={700} fontSize="0.8125rem">Editor</Typography>
              </Box>,
              <Box
                key="terminal"
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.selected',
                }}
              >
                <Typography fontWeight={700} fontSize="0.8125rem">Terminal</Typography>
              </Box>,
            ]}
          />
        </Box>
        <Typography variant="caption" component="div" sx={{ mt: 1.5, textAlign: 'center', lineHeight: 1.6 }}>
          Files: {files.toFixed(0)}% · Editor: {editor.toFixed(0)}% · Terminal: {terminal.toFixed(0)}%
        </Typography>
      </CardContent>
    </Card>
  );
}
