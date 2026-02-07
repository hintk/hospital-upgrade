import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Upload, Button, message, Divider, Alert } from 'antd';
import { InboxOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/admin';

const { Dragger } = Upload;

const Import = () => {
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const navigate = useNavigate();

  const downloadTemplate = (type) => {
    const url = type === 'doctor' ? adminApi.getDoctorTemplate() : adminApi.getScheduleTemplate();
    window.open(url, '_blank');
  };

  const handleDoctorUpload = async ({ file, onSuccess, onError }) => {
    setDoctorLoading(true);
    try {
      const res = await adminApi.importDoctors(file);
      if (res && typeof res === 'object') {
        const { total, success, failed, errors = [] } = res;
        if (success === 0 && total > 0) {
          message.error(`导入失败：共 ${total} 条记录全部失败`);
          if (errors.length) {
            message.warning(`失败原因：${errors.slice(0, 3).join('；')}`);
          }
          onError(new Error('导入失败'));
          return;
        } else if (failed > 0) {
          message.warning(`医生数据导入完成：成功 ${success}，失败 ${failed}，共 ${total}`);
          if (errors.length) {
            message.warning(`部分失败原因：${errors.slice(0, 3).join('；')}`);
          }
        } else {
          message.success(`医生数据导入成功：共 ${success} 条记录`);
        }
      } else {
        message.success('医生数据导入成功');
      }
      onSuccess("ok");
      navigate('/admin/doctors');
    } catch (error) {
      onError(error);
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleScheduleUpload = async ({ file, onSuccess, onError }) => {
    setScheduleLoading(true);
    try {
      await adminApi.importSchedules(file);
      message.success('排班数据导入成功');
      onSuccess("ok");
      navigate('/admin/schedules');
    } catch (error) {
      onError(error);
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">数据导入</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 医生导入 */}
        <Card 
          title={<span className="font-bold flex items-center gap-2"><FileExcelOutlined className="text-blue-500" style={{fontSize: 20}}/> 批量导入医生</span>}
          className="shadow-sm border-border"
          extra={
            <Button 
              type="link" 
              icon={<DownloadOutlined />} 
              onClick={() => downloadTemplate('doctor')}
            >
              下载模板
            </Button>
          }
        >
          <Alert 
            message="注意：导入将会新增医生账号，重复的ID将会跳过或报错。" 
            type="info" 
            showIcon 
            className="mb-4" 
          />
          
          <Dragger 
            customRequest={handleDoctorUpload}
            showUploadList={false}
            accept=".xlsx,.xls"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-blue-500" />
            </p>
            <p className="ant-upload-text">点击或拖拽Excel文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持扩展名: .xlsx, .xls
            </p>
          </Dragger>
        </Card>

        {/* 排班导入 */}
        <Card 
          title={<span className="font-bold flex items-center gap-2"><FileExcelOutlined className="text-green-500" style={{fontSize: 20}}/> 批量导入排班</span>}
          className="shadow-sm border-border"
          extra={
            <Button 
              type="link" 
              icon={<DownloadOutlined />} 
              onClick={() => downloadTemplate('schedule')}
            >
              下载模板
            </Button>
          }
        >
          <Alert 
            message="注意：请确保Excel中的医生ID已存在，日期格式为 yyyy-MM-dd。" 
            type="warning" 
            showIcon 
            className="mb-4" 
          />

          <Dragger 
            customRequest={handleScheduleUpload}
            showUploadList={false}
            accept=".xlsx,.xls"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-green-500" />
            </p>
            <p className="ant-upload-text">点击或拖拽Excel文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持扩展名: .xlsx, .xls
            </p>
          </Dragger>
        </Card>
      </div>
    </div>
  );
};

export default Import;
