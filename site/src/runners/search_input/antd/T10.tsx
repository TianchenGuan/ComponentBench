'use client';

/**
 * search_input-antd-T10: Advanced search modal: replace query and confirm
 *
 * Modal flow: the main page shows a single button labeled "Advanced search".
 * Clicking it opens an Ant Design Modal titled "Advanced search" (overlay layer).
 * Inside the modal is one Ant Design Input.Search labeled "Query" with an enterButton labeled "Search" and allowClear enabled.
 * Initial state: the input is prefilled with "draft".
 * Clutter inside the modal is medium: there are non-required checkboxes ("Include archived", "Exact match") and a help link, but success depends only on the search input submission.
 * Feedback: after clicking the modal Search button, the button shows a loading spinner for ~500ms and the modal displays an inline status line "Last searched: final report".
 * Closing the modal is not required.
 *
 * Success: Inside the "Advanced search" modal, the Input.Search has submitted_query "final report".
 */

import React, { useState, useRef } from 'react';
import { Button, Modal, Input, Checkbox, Typography, Space, Spin } from 'antd';
import type { TaskComponentProps } from '../types';

const { Search } = Input;
const { Text, Link } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState('draft');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSearch = (query: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmittedQuery(query);
      if (query === 'final report' && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }, 500);
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Advanced search
      </Button>

      <Modal
        title="Advanced search"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={450}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <label htmlFor="search-advanced" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Query
            </label>
            <Search
              id="search-advanced"
              placeholder="Enter search query…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onSearch={handleSearch}
              enterButton={loading ? <Spin size="small" /> : 'Search'}
              allowClear
              data-testid="search-advanced"
              loading={loading}
            />
            {submittedQuery && (
              <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                Last searched: {submittedQuery}
              </Text>
            )}
          </div>

          <Space direction="vertical" size="small">
            <Checkbox>Include archived</Checkbox>
            <Checkbox>Exact match</Checkbox>
          </Space>

          <Link href="#" style={{ fontSize: 12 }}>Need help with advanced search?</Link>
        </Space>
      </Modal>
    </>
  );
}
