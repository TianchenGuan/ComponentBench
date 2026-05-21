'use client';

/**
 * tour_teaching_tip-antd-T22: Drawer flow: start tips tour and reach Keyboard shortcuts
 *
 * setup_description:
 * A drawer_flow scene in light theme with comfortable spacing.
 * The main page shows a "Quick tips" button in the header. Clicking it opens an AntD Drawer from the right titled "Quick tips".
 * Inside the drawer is a short list of tips and a button labeled "Start tips tour".
 * Clicking "Start tips tour" opens an AntD Tour scoped to the drawer content (getPopupContainer set to drawer body), with mask enabled over the drawer only.
 * The Tour has 4 steps: "Welcome", "Pinned tips", "Keyboard shortcuts", and "Done".
 * Initial state: drawer closed, tour closed.
 *
 * success_trigger: Tour overlay is open, current step title is "Keyboard shortcuts", current step index equals 2.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Tour, List } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T22({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const shortcutsRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Welcome',
      description: 'Welcome to the quick tips tour!',
      target: () => welcomeRef.current!,
    },
    {
      title: 'Pinned tips',
      description: 'Your pinned tips appear here.',
      target: () => pinnedRef.current!,
    },
    {
      title: 'Keyboard shortcuts',
      description: 'Learn useful keyboard shortcuts.',
      target: () => shortcutsRef.current!,
    },
    {
      title: 'Done',
      description: 'You\'re all set!',
      target: () => doneRef.current!,
    },
  ];

  useEffect(() => {
    if (tourOpen && current === 2 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Keyboard shortcuts') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [tourOpen, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (tourOpen && current === 2 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Keyboard shortcuts') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [tourOpen, current, onSuccess]);

  const tips = [
    'Use Ctrl+S to save',
    'Press ? for help',
    'Double-click to edit',
  ];

  const shortcuts = [
    { key: 'Ctrl+S', action: 'Save' },
    { key: 'Ctrl+Z', action: 'Undo' },
    { key: 'Ctrl+F', action: 'Search' },
  ];

  return (
    <>
      <div
        style={{
          padding: '16px 24px',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Button onClick={() => setDrawerOpen(true)} data-testid="quick-tips-btn">
          Quick tips
        </Button>
      </div>

      <Drawer
        title="Quick tips"
        placement="right"
        onClose={() => {
          setDrawerOpen(false);
          setTourOpen(false);
        }}
        open={drawerOpen}
        width={350}
        data-testid="drawer-quick-tips"
      >
        <div>
          <div ref={welcomeRef} style={{ marginBottom: 16 }} data-testid="welcome-section">
            <p style={{ color: '#666' }}>Helpful tips to get you started</p>
          </div>

          <div ref={pinnedRef} style={{ marginBottom: 16 }} data-testid="pinned-section">
            <List
              size="small"
              header={<strong>Pinned Tips</strong>}
              bordered
              dataSource={tips}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>

          <div ref={shortcutsRef} style={{ marginBottom: 16 }} data-testid="shortcuts-section">
            <List
              size="small"
              header={<strong>Keyboard Shortcuts</strong>}
              bordered
              dataSource={shortcuts}
              renderItem={(item) => (
                <List.Item>
                  <code>{item.key}</code> - {item.action}
                </List.Item>
              )}
            />
          </div>

          <div ref={doneRef} style={{ marginBottom: 16 }} data-testid="done-section">
            <p style={{ color: '#52c41a' }}>You're all set!</p>
          </div>

          <Button
            type="primary"
            onClick={() => {
              setTourOpen(true);
              setCurrent(0);
            }}
            data-testid="start-tips-tour-btn"
          >
            Start tips tour
          </Button>
        </div>
      </Drawer>

      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        data-testid="tour-quick-tips"
      />
    </>
  );
}
