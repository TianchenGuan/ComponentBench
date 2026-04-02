'use client';

/**
 * file_upload_button-antd-T10: Clear all uploaded files from a long list (dashboard)
 *
 * setup_description: The page is a dashboard layout with high clutter: a left navigation menu, 
 * a top header, and several statistic cards. In the main area, a card titled "Attachments" 
 * contains the target Ant Design Upload component in the default text-list style with multiple 
 * files enabled. On load, the upload list already contains a long set of files (about 8–12 items) 
 * and the list area is vertically scrollable within the card. Above the list there is a small 
 * text link/button labeled "Clear all" (part of the uploader's header controls). Clicking "Clear all" 
 * opens a confirmation pop-up asking to confirm clearing all files, with buttons "Cancel" and "Clear". 
 * After confirming, the list should become empty.
 *
 * Success: The "Attachments" uploader shows 0 files in its file list (completely cleared).
 *          The confirmation pop-up has been accepted (not canceled).
 */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Typography, Layout, Menu, Statistic, Row, Col, Popconfirm, Modal, List } from 'antd';
import { 
  UploadOutlined, 
  DashboardOutlined, 
  SettingOutlined, 
  UserOutlined,
  FileOutlined,
  TeamOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Sider, Header, Content } = Layout;
const { Title, Text } = Typography;

// Generate initial file list
const initialFiles: UploadFile[] = [
  { uid: '1', name: 'report_q1_2025.pdf', status: 'done' },
  { uid: '2', name: 'report_q2_2025.pdf', status: 'done' },
  { uid: '3', name: 'budget_forecast.xlsx', status: 'done' },
  { uid: '4', name: 'team_photo.jpg', status: 'done' },
  { uid: '5', name: 'contract_draft.docx', status: 'done' },
  { uid: '6', name: 'invoice_001.pdf', status: 'done' },
  { uid: '7', name: 'invoice_002.pdf', status: 'done' },
  { uid: '8', name: 'meeting_notes.txt', status: 'done' },
  { uid: '9', name: 'presentation_v2.pptx', status: 'done' },
  { uid: '10', name: 'logo_final.png', status: 'done' },
  { uid: '11', name: 'design_specs.pdf', status: 'done' },
  { uid: '12', name: 'user_data_export.csv', status: 'done' },
];

const SAMPLE_FILES: SampleFile[] = [
  { name: 'new_document.pdf', type: 'application/pdf' },
  { name: 'image.png', type: 'image/png' },
  { name: 'data.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>(initialFiles);
  const [completed, setCompleted] = useState(false);
  const [confirmAccepted, setConfirmAccepted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (fileList.length === 0 && confirmAccepted) {
      setCompleted(true);
      onSuccess();
    }
  }, [fileList, confirmAccepted, completed, onSuccess]);

  const handleClearAll = () => {
    setConfirmAccepted(true);
    setFileList([]);
  };

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setFileList((prev) => [...prev, newFile]);
    
    await simulateUpload(500);
    setFileList((prev) =>
      prev.map((f) => (f.uid === newFile.uid ? { ...f, status: 'done' } : f))
    );
  };

  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Left sidebar */}
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ padding: 16, fontWeight: 600 }}>Dashboard</div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['files']}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Overview' },
            { key: 'files', icon: <FileOutlined />, label: 'Files' },
            { key: 'team', icon: <TeamOutlined />, label: 'Team' },
            { key: 'users', icon: <UserOutlined />, label: 'Users' },
            { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
          ]}
        />
      </Sider>
      
      <Layout>
        {/* Top header */}
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: '16px 0' }}>File Management</Title>
        </Header>
        
        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          {/* Stats row */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic title="Total Files" value={fileList.length} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Storage Used" value="2.4 GB" />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Shared Files" value={5} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Team Members" value={8} />
              </Card>
            </Col>
          </Row>
          
          {/* Attachments card with upload list */}
          <Card 
            title="Attachments"
            extra={
              <Popconfirm
                title="Clear all files?"
                description="This will remove all files from the list."
                onConfirm={handleClearAll}
                okText="Clear"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  type="link" 
                  danger 
                  size="small"
                  icon={<DeleteOutlined />}
                >
                  Clear all
                </Button>
              </Popconfirm>
            }
          >
            <div 
              data-testid="uploader-attachments"
              style={{ maxHeight: 300, overflowY: 'auto' }}
              onClick={() => setPickerOpen(true)}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Add files</Button>
              </Upload>
            </div>
          </Card>
        </Content>
      </Layout>

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
    </Layout>
  );
}
