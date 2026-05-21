'use client';

/**
 * file_upload_button-antd-T07: Drag-and-drop upload with Upload.Dragger (compact spacing)
 *
 * setup_description: A centered isolated card titled "Upload asset" contains an Ant Design 
 * Upload.Dragger component (large dashed drop area). The page is in compact spacing mode, 
 * so padding around the drop area and surrounding text is reduced. Inside the drop area, 
 * the helper text reads "Click or drag file to this area to upload" and there is no separate 
 * button. A small, non-interactive "Test files" note below the card lists available files 
 * including "diagram.svg". On drop, the file is added to a file list rendered below the 
 * drop area and quickly transitions to status done.
 *
 * Success: The drag-and-drop uploader contains exactly one file named "diagram.svg" with status "done".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List } from 'antd';
import { InboxOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Text } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'diagram.svg', type: 'image/svg+xml' },
  { name: 'chart.png', type: 'image/png' },
  { name: 'logo.svg', type: 'image/svg+xml' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'diagram.svg' &&
      fileList[0].status === 'done'
    ) {
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
    
    setFileList([newFile]);
    
    await simulateUpload(500);
    setFileList([{ ...newFile, status: 'done' }]);
  };

  const uploadProps: UploadProps = {
    multiple: false,
    fileList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  return (
    <div style={{ padding: 8 }}>
      <Card 
        title="Upload asset" 
        style={{ width: 450 }}
        bodyStyle={{ padding: 12 }}
      >
        <div data-testid="uploader-asset" onClick={() => setPickerOpen(true)}>
          <Dragger {...uploadProps} style={{ padding: 16 }}>
            <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
              <InboxOutlined style={{ fontSize: 36, color: '#1677ff' }} />
            </p>
            <p className="ant-upload-text" style={{ margin: 0, fontSize: 14 }}>
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </div>
      </Card>
      
      {/* Test files note */}
      <div style={{ marginTop: 8, padding: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Test files: diagram.svg, chart.png, logo.svg
        </Text>
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
    </div>
  );
}
