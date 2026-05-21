'use client';

/**
 * file_dropzone-antd-T09: Upload the banner that matches a reference preview (visual match)
 *
 * setup_description: A centered isolated card is shown (light theme, comfortable spacing, default scale).
 * The card is split into two columns:
 * - Left column: a "Reference preview" panel showing the target banner image (a small wide thumbnail).
 * - Right column: one AntD Upload.Dragger labeled "Banner image" (accept=image/png, maxCount=1).
 * Below the drop area is a grid of 4 candidate banner thumbnails (part of the test harness). Each thumbnail is labeled only with a neutral ID:
 * - banner-01.png
 * - banner-02.png
 * - banner-03.png   ← (this one visually matches the reference)
 * - banner-04.png
 * The intended interaction is to drag the correct thumbnail tile onto the AntD dragger area (or click the drop area to open the in-page picker showing the same 4 thumbnails).
 * Auto-upload is enabled; after selection, the upload list under "Banner image" shows a picture thumbnail, filename, and uploaded status.
 * Initial state: no file selected/uploaded.
 *
 * Success: The dropzone labeled "Banner image" contains exactly one file whose file_key is banner-03.png with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const BANNER_FILES: SampleFile[] = [
  { name: 'banner-01.png', type: 'image/png' },
  { name: 'banner-02.png', type: 'image/png' },
  { name: 'banner-03.png', type: 'image/png' },  // Target - matches reference
  { name: 'banner-04.png', type: 'image/png' },
];

// Generate distinct banner colors for visual matching
const getBannerColor = (name: string): string => {
  const colors: Record<string, string> = {
    'banner-01.png': '#ff6b6b',  // Red
    'banner-02.png': '#4ecdc4',  // Teal
    'banner-03.png': '#45b7d1',  // Blue - TARGET
    'banner-04.png': '#96ceb4',  // Green
  };
  return colors[name] || '#999';
};

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'banner-03.png' &&
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
      percent: 0,
      thumbUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect fill="${encodeURIComponent(getBannerColor(sample.name))}" width="120" height="40"/></svg>`,
    };
    
    setFileList([newFile]);
    
    await simulateUpload(300);
    setFileList([{ ...newFile, percent: 50 }]);
    await simulateUpload(300);
    setFileList([{ ...newFile, status: 'done', percent: 100 }]);
  };

  const handleDragStart = (e: React.DragEvent, file: SampleFile) => {
    e.dataTransfer.setData('application/json', JSON.stringify(file));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const file: SampleFile = JSON.parse(data);
      await handleSelectFile(file);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };

  const uploadProps: UploadProps = {
    fileList,
    multiple: false,
    maxCount: 1,
    listType: 'picture',
    accept: 'image/png',
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card style={{ width: 550 }}>
      <Row gutter={24}>
        {/* Left: Reference preview */}
        <Col span={10}>
          <Title level={5} style={{ marginBottom: 12 }}>Reference preview</Title>
          <div
            style={{
              width: '100%',
              height: 60,
              background: getBannerColor('banner-03.png'),  // The target banner color
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
          />
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
            Upload the banner that matches this preview
          </Text>
        </Col>

        {/* Right: Upload dropzone */}
        <Col span={14}>
          <Title level={5} style={{ marginBottom: 12 }}>Banner image</Title>
          <div 
            data-testid="dropzone-banner-image"
            onClick={() => setPickerOpen(true)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{ cursor: 'pointer' }}
          >
            <Dragger
              {...uploadProps}
              style={{ 
                borderColor: isDragOver ? '#1677ff' : undefined,
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text" style={{ fontSize: 12 }}>Click or drag</p>
            </Dragger>
          </div>
        </Col>
      </Row>

      {/* Candidate thumbnails */}
      <div style={{ marginTop: 24 }}>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>Candidates</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {BANNER_FILES.map(file => (
            <div
              key={file.name}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              onClick={() => handleSelectFile(file)}
              style={{
                cursor: 'grab',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 40,
                  background: getBannerColor(file.name),
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                  marginBottom: 4,
                }}
              />
              <Text style={{ fontSize: 10 }}>{file.name}</Text>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Sample files"
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        footer={null}
        width={400}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {BANNER_FILES.map(file => (
            <div
              key={file.name}
              onClick={() => handleSelectFile(file)}
              style={{
                cursor: 'pointer',
                padding: 8,
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 50,
                  background: getBannerColor(file.name),
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
              <Text>{file.name}</Text>
            </div>
          ))}
        </div>
      </Modal>
    </Card>
  );
}
