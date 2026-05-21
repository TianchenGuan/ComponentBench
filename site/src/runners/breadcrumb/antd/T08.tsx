'use client';

/**
 * breadcrumb-antd-T08: Navigate to correct folder in cluttered UI
 * 
 * File browser form section with high clutter.
 * Breadcrumb: Home > Documents > Projects > Work
 * Navigate to "Projects" using the breadcrumb.
 */

import React, { useState } from 'react';
import { Breadcrumb, Card, List } from 'antd';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Projects') {
      onSuccess();
    }
  };

  // Distractor file items
  const files = [
    { name: 'report.docx', type: 'file' },
    { name: 'data.xlsx', type: 'file' },
    { name: 'presentation.pptx', type: 'file' },
    { name: 'notes.txt', type: 'file' },
    { name: 'Archive', type: 'folder' },
    { name: 'Backup', type: 'folder' },
  ];

  return (
    <Card title="File Browser" style={{ width: 500 }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <a
                onClick={() => handleNavigate('Home')}
                data-testid="antd-breadcrumb-home"
                style={{ cursor: 'pointer' }}
              >
                Home
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => handleNavigate('Documents')}
                data-testid="antd-breadcrumb-documents"
                style={{ cursor: 'pointer' }}
              >
                Documents
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => handleNavigate('Projects')}
                data-testid="antd-breadcrumb-projects"
                style={{ cursor: 'pointer' }}
              >
                Projects
              </a>
            ),
          },
          {
            title: <span data-testid="antd-breadcrumb-work">Work</span>,
          },
        ]}
      />

      {navigated ? (
        <p style={{ color: '#52c41a', fontWeight: 500 }}>
          Navigated to: {navigated}
        </p>
      ) : (
        <>
          <List
            size="small"
            dataSource={files}
            renderItem={(item) => (
              <List.Item style={{ padding: '4px 0' }}>
                {item.type === 'folder' ? (
                  <FolderOutlined style={{ marginRight: 8, color: '#faad14' }} />
                ) : (
                  <FileOutlined style={{ marginRight: 8, color: '#999' }} />
                )}
                {item.name}
              </List.Item>
            )}
          />
        </>
      )}
    </Card>
  );
}
