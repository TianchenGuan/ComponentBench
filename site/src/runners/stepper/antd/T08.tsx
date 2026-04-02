'use client';

/**
 * stepper-antd-T08: Modal wizard: match step to preview
 *
 * Layout: modal_flow.
 * A button "Open Setup Wizard" opens a Modal containing a Steps component.
 * A preview card shows a highlighted step that the user must match.
 * Modal stepper steps: "Welcome" → "Company info" → "Security" → "Integrations" → "Finish".
 * Initial state (modal): Active step is "Welcome" (index 0).
 * Target step is "Security" (shown in preview, index 2).
 * Success: Modal stepper active step matches the preview-highlighted step.
 */

import React, { useState } from 'react';
import { Steps, Card, Button, Modal } from 'antd';
import type { TaskComponentProps } from '../types';

const modalSteps = [
  { title: 'Welcome' },
  { title: 'Company info' },
  { title: 'Security' },
  { title: 'Integrations' },
  { title: 'Finish' },
];

const TARGET_STEP_INDEX = 2; // "Security"
const TARGET_STEP_LABEL = 'Security';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleChange = (value: number) => {
    setCurrent(value);
    if (value === TARGET_STEP_INDEX) {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
      >
        Open Setup Wizard
      </Button>

      <Card
        size="small"
        title="Preview"
        style={{ width: 200 }}
        data-testid="step-preview"
        data-target-step={TARGET_STEP_LABEL}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {modalSteps.map((step, idx) => (
            <div
              key={step.title}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: idx === TARGET_STEP_INDEX ? '#1677ff' : '#e8e8e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: idx === TARGET_STEP_INDEX ? '#fff' : '#999',
              }}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          Target: <strong>{TARGET_STEP_LABEL}</strong>
        </p>
      </Card>

      <Modal
        title="Setup Wizard"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={<Button onClick={() => setIsModalOpen(false)}>Close</Button>}
        width={600}
        data-testid="setup-wizard-modal"
      >
        <Steps
          current={current}
          onChange={handleChange}
          items={modalSteps}
          data-testid="stepper-modal"
        />
        <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
          <p>Step content: {modalSteps[current]?.title}</p>
        </div>
      </Modal>
    </div>
  );
}
