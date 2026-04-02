'use client';

/**
 * file_dropzone-antd-T07: Drag a logo SVG into the dropzone (dark theme, corner placement)
 *
 * setup_description: The UI is rendered in dark theme and the main card is anchored to the bottom-right of the viewport (placement=bottom_right).
 * Spacing is comfortable and the dropzone is default size.
 * Inside the card there is one AntD Upload.Dragger labeled "Brand assets" (accept=.svg,.png, multiple=false).
 * Below the drop area is a small "File tray" strip (part of the test harness) containing 3 draggable file tiles:
 * - logo.svg   ← TARGET
 * - logo-old.svg
 * - brand-guidelines.pdf
 * Each tile shows a file-type icon and the filename. The intended interaction is to drag a tile and drop it onto the dashed AntD dragger area.
 * On successful drop, the file appears in the AntD upload list with an upload progress line, then status "uploaded".
 * Initial state: no files uploaded in Brand assets.
 *
 * Success: The dropzone labeled "Brand assets" contains exactly one file: logo.svg with status "uploaded".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Card, Typography } from 'antd';
import { InboxOutlined, FileOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const FILE_TILES: SampleFile[] = [
  { name: 'logo.svg', type: 'image/svg+xml' },
  { name: 'logo-old.svg', type: 'image/svg+xml' },
  { name: 'brand-guidelines.pdf', type: 'application/pdf' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'logo.svg' &&
      fileList[0].status === 'done'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [fileList, completed, onSuccess]);

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
      
      const newFile: UploadFile = {
        uid: generateUid(),
        name: file.name,
        status: 'uploading',
        percent: 0,
      };
      
      setFileList([newFile]);
      
      await simulateUpload(300);
      setFileList([{ ...newFile, percent: 50 }]);
      await simulateUpload(300);
      setFileList([{ ...newFile, status: 'done', percent: 100 }]);
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
    accept: '.svg,.png',
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card 
      style={{ 
        width: 400,
        background: '#1f1f1f',
        borderColor: '#434343',
      }}
    >
      <Title level={5} style={{ marginBottom: 16, color: '#fff' }}>Brand assets</Title>
      
      <div 
        ref={dropzoneRef}
        data-testid="dropzone-brand-assets"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Dragger
          {...uploadProps}
          style={{ 
            cursor: 'pointer',
            background: isDragOver ? '#2a2a2a' : '#141414',
            borderColor: isDragOver ? '#1677ff' : '#434343',
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#666' }} />
          </p>
          <p className="ant-upload-text" style={{ color: '#999' }}>
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </div>

      {/* File tray */}
      <div style={{ marginTop: 16 }}>
        <Text style={{ color: '#999', fontSize: 12 }}>File tray</Text>
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginTop: 8,
          padding: 8,
          background: '#141414',
          borderRadius: 4,
        }}>
          {FILE_TILES.map(file => (
            <div
              key={file.name}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              style={{
                padding: '8px 12px',
                background: '#262626',
                borderRadius: 4,
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#fff',
                fontSize: 12,
              }}
            >
              {file.type === 'application/pdf' ? (
                <FilePdfOutlined style={{ color: '#ff4d4f' }} />
              ) : (
                <FileOutlined style={{ color: '#1677ff' }} />
              )}
              {file.name}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
