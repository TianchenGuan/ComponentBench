'use client';

/**
 * file_upload_button-antd-T03: Remove an already uploaded file (no confirmation)
 *
 * setup_description: The page contains one centered isolated card titled "Attachments" with a single 
 * Ant Design Upload component in the default (text) list style. The upload list is visible on page 
 * load and already contains one completed item named "draft_cover_letter.docx" with status "done". 
 * Each list item has a small remove (×) icon on the right. There is no confirmation dialog for 
 * removal; clicking the remove icon immediately removes the item from the list. No other uploaders 
 * or controls are present.
 *
 * Success: The Attachment uploader's file list is empty (0 files).
 */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Modal, List } from 'antd';
import { UploadOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'draft_cover_letter.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { name: 'notes.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { name: 'report.pdf', type: 'application/pdf' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: 'existing-1',
      name: 'draft_cover_letter.docx',
      status: 'done',
    },
  ]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (fileList.length === 0) {
      setCompleted(true);
      onSuccess();
    }
  }, [fileList, completed, onSuccess]);

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setFileList((prev) => [...prev, newFile]);
    
    // Simulate upload progress
    await simulateUpload(500);
    setFileList((prev) =>
      prev.map((f) => (f.uid === newFile.uid ? { ...f, status: 'done' } : f))
    );
  };

  const uploadProps: UploadProps = {
    fileList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      return true;
    },
  };

  return (
    <Card title="Attachments" style={{ width: 400 }}>
      <div data-testid="uploader-attachment" onClick={() => setPickerOpen(true)}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Select file</Button>
        </Upload>
      </div>

      <Modal
        title="Sample files"
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={SAMPLE_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectFile(item)}
              style={{ cursor: 'pointer', padding: '12px 0' }}
            >
              <List.Item.Meta
                avatar={<FileOutlined style={{ fontSize: 20 }} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
