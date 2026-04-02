'use client';

/**
 * window_splitter-mui-T18: Three panels: set 20/60/20 in compact small layout
 * 
 * A centered isolated card titled "Primary splitter" contains a three-panel 
 * horizontal resizable group. Pane labels are "Files" (left), "Editor" (middle), 
 * and "Terminal" (right). Two resize handles are present and look identical. 
 * The scene uses compact spacing and a small component scale. A compact table-style 
 * readout beneath the group lists the current percentages.
 * 
 * Success: Pane fractions match [20%, 60%, 20%] ±2% for each
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState({ files: 33, editor: 34, terminal: 33 });
  const successFiredRef = useRef(false);

  useEffect(() => {
    const files = sizes.files / 100;
    const editor = sizes.editor / 100;
    const terminal = sizes.terminal / 100;
    // Success: all three panes within ±2% of targets
    const filesOk = files >= 0.18 && files <= 0.22;
    const editorOk = editor >= 0.58 && editor <= 0.62;
    const terminalOk = terminal >= 0.18 && terminal <= 0.22;
    
    if (!successFiredRef.current && filesOk && editorOk && terminalOk) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  const renderSeparator = () => (
    <Separator style={{
      width: 6,
      background: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'col-resize',
    }}>
      <Box sx={{ 
        width: 2, 
        height: 16, 
        borderLeft: '1px dotted #999',
        borderRight: '1px dotted #999',
      }} />
    </Separator>
  );

  return (
    <Card sx={{ width: 600 }}>
      <CardHeader 
        title="Primary splitter" 
        titleTypographyProps={{ variant: 'subtitle2' }} 
        sx={{ py: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
          <Box 
          sx={{ height: 220, border: '1px solid #e0e0e0', borderRadius: 1 }}
          data-testid="splitter-primary"
        >
          <Group 
            orientation="horizontal" 
            onLayoutChange={(layout) => {
              setSizes({
                files: layout['files'] ?? 33,
                editor: layout['editor'] ?? 34,
                terminal: layout['terminal'] ?? 33,
              });
            }}
          >
            <Panel id="files" defaultSize="33%" minSize="10%" maxSize="50%">
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0', p: 0.5 }}>
                  Files
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary">File tree...</Typography>
                </Box>
              </Box>
            </Panel>
            {renderSeparator()}
            <Panel id="editor" defaultSize="34%" minSize="20%" maxSize="80%">
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0', p: 0.5 }}>
                  Editor
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Code editor...</Typography>
                </Box>
              </Box>
            </Panel>
            {renderSeparator()}
            <Panel id="terminal" defaultSize="33%" minSize="10%" maxSize="50%">
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0', p: 0.5 }}>
                  Terminal
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Terminal output...</Typography>
                </Box>
              </Box>
            </Panel>
          </Group>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          Files: {sizes.files.toFixed(0)}% • Editor: {sizes.editor.toFixed(0)}% • Terminal: {sizes.terminal.toFixed(0)}%
        </Typography>
      </CardContent>
    </Card>
  );
}
