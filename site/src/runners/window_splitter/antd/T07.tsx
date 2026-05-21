'use client';

/**
 * window_splitter-antd-T07: Modal apply: set Preview to 35% then Apply
 * 
 * The page uses a modal_flow layout in dark theme. In the center is a button labeled 
 * "Open Layout Editor". Clicking it opens an Ant Design Modal titled "Layout Editor". 
 * Inside the modal is a controlled AntD Splitter with two panes: "Editor" (left) and 
 * "Preview" (right). The splitter starts at 50/50. A readout inside the modal footer 
 * shows "Editor: 50% • Preview: 50%" and updates while dragging. Below the readout are 
 * two buttons: "Cancel" and a primary button "Apply layout". Resizing changes are 
 * considered "pending" until Apply layout is clicked.
 * 
 * Success: After clicking "Apply layout", Preview (right) is 35% ±2%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Card } from 'antd';
import { Splitter } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const [committedSizes, setCommittedSizes] = useState<number[] | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (!successFiredRef.current && committedSizes) {
      const previewFraction = committedSizes[1] / 100;
      // Success: Preview (right) is 35% ±2% (0.33 to 0.37)
      if (previewFraction >= 0.33 && previewFraction <= 0.37) {
        successFiredRef.current = true;
        onSuccess();
      }
    }
  }, [committedSizes, onSuccess]);

  const handleApply = () => {
    setCommittedSizes([...sizes]);
    setIsApplied(true);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSizes([50, 50]);
    setIsModalOpen(false);
  };

  return (
    <Card style={{ width: 400, textAlign: 'center' }}>
      <Button 
        type="primary" 
        size="large" 
        onClick={() => setIsModalOpen(true)}
        data-testid="open-modal-button"
      >
        Open Layout Editor
      </Button>

      <Modal
        title="Layout Editor"
        open={isModalOpen}
        onCancel={handleCancel}
        width={700}
        footer={null}
        data-testid="layout-editor-modal"
      >
        <Splitter
          style={{ height: 300, boxShadow: '0 0 5px rgba(0,0,0,0.1)', marginBottom: 16 }}
          onResize={(newSizes) => {
            const total = newSizes.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setSizes(newSizes.map(s => (s / total) * 100));
            }
            setIsApplied(false);
          }}
          data-testid="splitter-primary"
        >
          <Splitter.Panel size={sizes[0]} min="10%" max="90%">
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f1f1f', color: '#fff' }}>
              <span style={{ fontWeight: 500 }}>Editor</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel size={sizes[1]}>
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2a2a2a', color: '#fff' }}>
              <span style={{ fontWeight: 500 }}>Preview</span>
            </div>
          </Splitter.Panel>
        </Splitter>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>
            Editor: {sizes[0].toFixed(0)}% • Preview: {sizes[1].toFixed(0)}%
            {!isApplied && <span style={{ marginLeft: 12, color: '#faad14', fontSize: 12 }}>Not applied</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button 
              type="primary" 
              onClick={handleApply}
              data-testid="apply-button"
            >
              Apply layout
            </Button>
          </div>
        </div>
      </Modal>

      {committedSizes && (
        <div 
          style={{ marginTop: 16, fontSize: 13, color: '#52c41a' }}
          data-committed-layout={`${committedSizes[0]},${committedSizes[1]}`}
        >
          Applied: Editor {committedSizes[0].toFixed(0)}% • Preview {committedSizes[1].toFixed(0)}%
        </div>
      )}
    </Card>
  );
}
