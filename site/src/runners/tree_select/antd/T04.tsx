'use client';

/**
 * tree_select-antd-T04: Open the folder dropdown
 *
 * Layout: isolated_card centered titled "Move item".
 * Target component: one AntD TreeSelect labeled "Folder" with placeholder "Select a folder"; no value selected.
 * Interaction: clicking the input opens a dropdown overlay.
 * Tree data (file-system style): Root → (Documents → (Reports, Invoices), Media → (Images, Videos), Archive).
 * There is a secondary "Cancel" button outside the card footer, but it is disabled.
 *
 * Success: The Folder TreeSelect dropdown overlay is open and the tree panel is visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const treeData = [
  {
    value: 'root',
    title: 'Root',
    selectable: false,
    children: [
      {
        value: 'root_documents',
        title: 'Documents',
        selectable: false,
        children: [
          { value: 'folder_root_documents_reports', title: 'Reports' },
          { value: 'folder_root_documents_invoices', title: 'Invoices' },
        ],
      },
      {
        value: 'root_media',
        title: 'Media',
        selectable: false,
        children: [
          { value: 'folder_root_media_images', title: 'Images' },
          { value: 'folder_root_media_videos', title: 'Videos' },
        ],
      },
      { value: 'folder_root_archive', title: 'Archive' },
    ],
  },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && open) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card title="Move item" style={{ width: 420 }} data-testid="tree-select-card">
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="folder-select" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Folder
        </label>
        <TreeSelect
          id="folder-select"
          data-testid="tree-select-folder"
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => setValue(val)}
          open={open}
          onDropdownVisibleChange={(visible) => setOpen(visible)}
          treeData={treeData}
          placeholder="Select a folder"
          showSearch={false}
          treeDefaultExpandAll={false}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
      </div>
      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        <Button disabled>Cancel</Button>
      </div>
    </Card>
  );
}
