package com.pegasus.hospital.service;

import javax.servlet.http.HttpServletResponse;

/**
 * 报告生成服务接口
 */
public interface ReportService {

    /**
     * 生成月度统计报告PDF
     * @param year 年份
     * @param month 月份
     * @param response HTTP响应
     */
    void generateMonthlyReport(int year, int month, HttpServletResponse response);
}
