'use client';

/**
 * window_splitter-antd-T08: Three-pane IDE layout: match 25/50/25
 * 
 * A centered isolated card titled "Primary splitter" contains an Ant Design Splitter 
 * configured with three horizontal panes (multiple panels). Pane labels appear in each 
 * pane header: "Files" (left), "Editor" (middle), and "Console" (right). There are two 
 * resize handles: one between Files↔Editor and one between Editor↔Console. The scene 
 * uses compact spacing and the component is rendered in a small scale variant. To the 
 * right of the splitter card is a small non-interactive reference diagram labeled 
 * "Target layout" showing the desired 25/50/25 proportions.
 * 
 * Success: Pane fractions match [25%, 50%, 25%] ±3% for each
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([33, 34, 33]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const [files, editor, console_] = sizes.map(s => s / 100);
    // Success: all three panes within ±3% of targets
    const filesOk = files >= 0.22 && files <= 0.28;
    const editorOk = editor >= 0.47 && editor <= 0.53;
    const consoleOk = console_ >= 0.22 && console_ <= 0.28;
    
    if (!successFiredRef.current && filesOk && editorOk && consoleOk) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <Card title="Primary splitter" style={{ width: 600 }} size="small">
        <Splitter
          style={{ height: 250, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
          onResize={(newSizes) => {
            const total = newSizes.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setSizes(newSizes.map(s => (s / total) * 100));
            }
          }}
          data-testid="splitter-primary"
        >
          <Splitter.Panel defaultSize="33%" min="10%" max="60%">
            <div style={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
              <div style={{ fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e8e8e8', paddingBottom: 6, marginBottom: 8 }}>Files</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                File tree...
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel defaultSize="34%" min="20%" max="70%">
            <div style={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              <div style={{ fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e8e8e8', paddingBottom: 6, marginBottom: 8 }}>Editor</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                Code editor...
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel defaultSize="33%" min="10%" max="60%">
            <div style={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column', background: '#f0f0f0' }}>
              <div style={{ fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e8e8e8', paddingBottom: 6, marginBottom: 8 }}>Console</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                Console output...
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 8, textAlign: 'center', color: '#666', fontSize: 12 }}>
          Files: {sizes[0].toFixed(0)}% • Editor: {sizes[1].toFixed(0)}% • Console: {sizes[2].toFixed(0)}%
        </div>
      </Card>

      {/* Reference diagram */}
      <Card title="Target layout" size="small" style={{ width: 180 }}>
        <div style={{ display: 'flex', height: 80, border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: '25%', background: '#e6f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, borderRight: '1px solid #d9d9d9' }}>
            25%
          </div>
          <div style={{ width: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, borderRight: '1px solid #d9d9d9' }}>
            50%
          </div>
          <div style={{ width: '25%', background: '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
            25%
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#666', textAlign: 'center' }}>
          Files / Editor / Console
        </div>
      </Card>
    </div>
  );
}
