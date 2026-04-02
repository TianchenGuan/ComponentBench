'use client';

/**
 * tour_teaching_tip-antd-T21: Modal flow: start Help Center walkthrough and reach Search
 *
 * setup_description:
 * A modal_flow scene: the page shows a centered "Help" button in an otherwise simple layout (light theme, comfortable spacing).
 * Clicking "Help" opens an AntD Modal titled "Help Center" (this modal is a prerequisite container; it is not the target component for success).
 * Inside the modal is a compact help layout with a search input, a category list, and a button labeled "Start walkthrough".
 * Clicking "Start walkthrough" opens an AntD Tour whose popup container is the modal content (getPopupContainer points to the modal body), with mask enabled over the modal only.
 * The Tour has 3 steps anchored to modal elements:
 * 1) "Welcome"
 * 2) "Search articles" (targets the search input)
 * 3) "Browse categories"
 * Initial state: modal closed, tour closed.
 *
 * success_trigger: Tour overlay is open, current step title is "Search articles", current step index equals 1.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Tour, Input, List } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T21({ task, onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Welcome',
      description: 'Welcome to the Help Center walkthrough!',
      target: () => welcomeRef.current!,
    },
    {
      title: 'Search articles',
      description: 'Search for help articles here.',
      target: () => searchRef.current!,
    },
    {
      title: 'Browse categories',
      description: 'Browse articles by category.',
      target: () => categoriesRef.current!,
    },
  ];

  useEffect(() => {
    if (tourOpen && current === 1 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Search articles') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [tourOpen, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (tourOpen && current === 1 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Search articles') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [tourOpen, current, onSuccess]);

  const categories = [
    'Getting Started',
    'Account Settings',
    'Billing & Payments',
    'Troubleshooting',
  ];

  return (
    <>
      <Button
        type="primary"
        size="large"
        onClick={() => setModalOpen(true)}
        data-testid="help-btn"
      >
        Help
      </Button>

      <Modal
        title="Help Center"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setTourOpen(false);
        }}
        footer={null}
        width={500}
        data-testid="help-center-modal"
      >
        <div>
          <div ref={welcomeRef} style={{ marginBottom: 16 }} data-testid="welcome-section">
            <p style={{ color: '#666' }}>Find answers to your questions</p>
          </div>

          <div ref={searchRef} style={{ marginBottom: 16 }} data-testid="search-section">
            <Input.Search placeholder="Search help articles..." />
          </div>

          <div ref={categoriesRef} style={{ marginBottom: 16 }} data-testid="categories-section">
            <List
              size="small"
              header={<strong>Categories</strong>}
              bordered
              dataSource={categories}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>

          <Button
            type="primary"
            onClick={() => {
              setTourOpen(true);
              setCurrent(0);
            }}
            data-testid="start-walkthrough-btn"
          >
            Start walkthrough
          </Button>
        </div>
      </Modal>

      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        data-testid="tour-help-center"
      />
    </>
  );
}
