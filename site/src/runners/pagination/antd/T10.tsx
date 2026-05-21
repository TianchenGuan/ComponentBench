'use client';

/**
 * pagination-antd-T10: Match reference page indicator style
 * 
 * Centered isolated card titled "Match the page".
 * Target sample shows pagination with page 7 highlighted.
 * Below, Pagination with 10 pages. Goal is to click page 7.
 */

import React, { useState } from 'react';
import { Card, Pagination, Typography, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 7 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card title="Match the page" style={{ width: 500 }}>
      {/* Target sample */}
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Target sample:
        </Text>
        <div 
          style={{ 
            padding: 12, 
            background: '#f5f5f5', 
            borderRadius: 6,
            pointerEvents: 'none',
          }}
          data-testid="antd-target-page-7"
        >
          {/* Static display showing page 7 highlighted */}
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {[1, 2, 3, '...', 6, 7, 8, '...', 10].map((p, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  fontSize: 12,
                  background: p === 7 ? '#1677ff' : 'transparent',
                  color: p === 7 ? '#fff' : '#333',
                  border: p === 7 ? 'none' : '1px solid #d9d9d9',
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* Interactive pagination */}
      <div style={{ marginBottom: 16 }}>
        <Text style={{ display: 'block', marginBottom: 8 }}>
          Navigate to match:
        </Text>
        <Pagination
          current={currentPage}
          total={100}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
          data-testid="antd-pagination-match"
        />
      </div>

      <div style={{ marginTop: 16 }}>
        {currentPage === 7 ? (
          <Text type="success" strong>✓ Match found!</Text>
        ) : (
          <Text type="secondary">Current page: {currentPage}</Text>
        )}
      </div>
    </Card>
  );
}
