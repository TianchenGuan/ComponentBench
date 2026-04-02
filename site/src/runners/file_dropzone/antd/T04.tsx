'use client';

/**
 * file_dropzone-antd-T04: Remove the pre-attached text file (empty the dropzone)
 *
 * setup_description: Baseline scene: one centered isolated card (light theme, comfortable spacing).
 * The card contains one AntD Upload.Dragger labeled "Supporting files" (multiple=false).
 * Initial state: the upload list already contains exactly one successfully uploaded item:
 * - project-brief.txt (status: uploaded)
 * The list item shows the filename and a remove (×) icon. Clicking remove immediately removes the item (no confirmation for this task).
 * The drop area remains visible above the list for adding new files, but adding files is not required for success.
 *
 * Success: The dropzone labeled "Supporting files" has an empty file list (no selected/uploaded files).
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List } from 'antd';
import { InboxOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'project-brief.txt', type: 'text/plain' },
  { name: 'readme.txt', type: 'text/plain' },
  { name: 'notes.txt', type: 'text/plain' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: 'initial-file-1',
      name: 'project-brief.txt',
      status: 'done',
      percent: 100,
    },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

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
      percent: 0,
    };
    
    setFileList([newFile]);
    
    await simulateUpload(300);
    setFileList([{ ...newFile, percent: 50 }]);
    await simulateUpload(300);
    setFileList([{ ...newFile, status: 'done', percent: 100 }]);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };

  const uploadProps: UploadProps = {
    fileList,
    multiple: false,
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card style={{ width: 450 }}>
      <Title level={5} style={{ marginBottom: 16 }}>Supporting files</Title>
      
      <div data-testid="dropzone-supporting-files" onClick={() => setPickerOpen(true)} style={{ cursor: 'pointer' }}>
        <Dragger
          {...uploadProps}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
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
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<FileOutlined />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
