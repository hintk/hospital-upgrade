import { useState, useEffect } from 'react';
import { Card, DatePicker, Button, Statistic, Row, Col, Alert, Spin } from 'antd';
import { FileText, Download, TrendingUp, Users, Calendar } from 'lucide-react';
import { adminApi } from '../../api/admin';
import dayjs from 'dayjs';

const Reports = () => {
  const [reportDate, setReportDate] = useState(dayjs());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await adminApi.getReportStatistics();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    window.open(adminApi.exportAppointments(), '_blank');
  };

  const handleDownloadPDF = () => {
    const year = reportDate.year();
    const month = reportDate.month() + 1; // dayjs month is 0-indexed
    window.open(adminApi.getMonthlyReport(year, month), '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">统计报表</h1>

      {/* 统计概览 */}
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false} className="shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <Statistic 
                title={<span className="text-blue-100 flex items-center gap-2"><TrendingUp size={16}/> 本月预约总量</span>}
                value={stats?.monthlyAppointments ?? 0} 
                valueStyle={{ color: '#fff' }} 
              />
              <div className="mt-2 text-blue-100 text-xs">
                较上月 {stats?.appointmentGrowth >= 0 ? '+' : ''}{stats?.appointmentGrowth ?? 0}%
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className="shadow-sm bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <Statistic 
                title={<span className="text-purple-100 flex items-center gap-2"><Users size={16}/> 新增患者数</span>}
                value={stats?.newPatients ?? 0} 
                valueStyle={{ color: '#fff' }} 
              />
              <div className="mt-2 text-purple-100 text-xs">
                较上月 {stats?.patientGrowth >= 0 ? '+' : ''}{stats?.patientGrowth ?? 0}%
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className="shadow-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <Statistic 
                title={<span className="text-orange-100 flex items-center gap-2"><Calendar size={16}/> 医生出诊人次</span>}
                value={stats?.activeDoctors ?? 0} 
                valueStyle={{ color: '#fff' }} 
              />
              <div className="mt-2 text-orange-100 text-xs">本月有排班医生</div>
            </Card>
          </Col>
        </Row>
      </Spin>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 预约记录导出 */}
        <Card title="预约记录明细" className="shadow-sm border-border">
          <div className="flex flex-col gap-4">
            <Alert message="导出所有历史预约记录，生成 Excel 文件。" type="info" showIcon />
            <Button 
              type="primary" 
              icon={<Download size={16} />} 
              size="large"
              onClick={handleDownloadExcel}
              className="bg-green-600 hover:bg-green-700 w-full md:w-auto self-start"
            >
              导出 Excel 报表
            </Button>
          </div>
        </Card>

        {/* 月度报告生成 */}
        <Card title="月度运营报告" className="shadow-sm border-border">
          <div className="flex flex-col gap-4">
            <Alert message="生成包含各科室预约量、医生工作量的详细 PDF 报告。" type="info" showIcon />
            <div className="flex items-center gap-4">
              <span className="text-slate-600">选择月份：</span>
              <DatePicker 
                picker="month" 
                value={reportDate} 
                onChange={setReportDate} 
                allowClear={false}
              />
            </div>
            <Button 
              type="primary" 
              icon={<FileText size={16} />} 
              size="large"
              onClick={handleDownloadPDF}
              className="w-full md:w-auto self-start"
            >
              生成 PDF 报告
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
