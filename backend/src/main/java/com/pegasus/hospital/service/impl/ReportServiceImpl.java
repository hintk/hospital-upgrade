package com.pegasus.hospital.service.impl;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.AppointmentMapper;
import com.pegasus.hospital.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * 报告生成服务实现类
 */
@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private AppointmentMapper appointmentMapper;

    @Override
    public void generateMonthlyReport(int year, int month, HttpServletResponse response) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startTime = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endTime = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        try {
            // 设置响应头
            response.setContentType("application/pdf");
            String fileName = URLEncoder.encode("月度统计报告_" + year + "年" + month + "月.pdf", "UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

            OutputStream out = response.getOutputStream();
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // 使用系统字体支持中文
            PdfFont font = PdfFontFactory.createFont("STSong-Light", "UniGB-UCS2-H");

            // 标题
            Paragraph title = new Paragraph("飞马星球医院月度统计报告")
                    .setFont(font)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            // 副标题
            Paragraph subtitle = new Paragraph(year + "年" + month + "月")
                    .setFont(font)
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(subtitle);

            document.add(new Paragraph("\n"));

            // 统计数据
            List<Map<String, Object>> deptStats = appointmentMapper.countByDepartment(startTime, endTime);
            List<Map<String, Object>> doctorStats = appointmentMapper.countByDoctor(startTime, endTime);

            // 科室预约统计表
            document.add(new Paragraph("一、各科室预约量统计").setFont(font).setFontSize(14).setBold());
            document.add(new Paragraph("\n"));

            Table deptTable = new Table(UnitValue.createPercentArray(new float[]{2, 1}))
                    .setWidth(UnitValue.createPercentValue(80));
            
            // 表头
            deptTable.addHeaderCell(new Cell().add(new Paragraph("科室名称").setFont(font))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
            deptTable.addHeaderCell(new Cell().add(new Paragraph("预约数量").setFont(font))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));

            int totalDept = 0;
            for (Map<String, Object> stat : deptStats) {
                String deptName = stat.get("department_name") != null ? 
                        stat.get("department_name").toString() : "未知科室";
                Long count = ((Number) stat.get("count")).longValue();
                totalDept += count;
                
                deptTable.addCell(new Cell().add(new Paragraph(deptName).setFont(font)));
                deptTable.addCell(new Cell().add(new Paragraph(count.toString()).setFont(font)));
            }
            
            // 合计行
            deptTable.addCell(new Cell().add(new Paragraph("合计").setFont(font).setBold()));
            deptTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalDept)).setFont(font).setBold()));

            document.add(deptTable);
            document.add(new Paragraph("\n\n"));

            // 医生工作量统计表
            document.add(new Paragraph("二、医生工作量统计").setFont(font).setFontSize(14).setBold());
            document.add(new Paragraph("\n"));

            Table doctorTable = new Table(UnitValue.createPercentArray(new float[]{1, 1.5f, 1.5f, 1}))
                    .setWidth(UnitValue.createPercentValue(100));
            
            doctorTable.addHeaderCell(new Cell().add(new Paragraph("医生ID").setFont(font))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
            doctorTable.addHeaderCell(new Cell().add(new Paragraph("医生姓名").setFont(font))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
            doctorTable.addHeaderCell(new Cell().add(new Paragraph("科室").setFont(font))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
            doctorTable.addHeaderCell(new Cell().add(new Paragraph("预约数量").setFont(font))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));

            for (Map<String, Object> stat : doctorStats) {
                String doctorId = stat.get("doctor_id") != null ? stat.get("doctor_id").toString() : "";
                String doctorName = stat.get("doctor_name") != null ? stat.get("doctor_name").toString() : "";
                String deptName = stat.get("department_name") != null ? stat.get("department_name").toString() : "";
                Long count = ((Number) stat.get("count")).longValue();

                doctorTable.addCell(new Cell().add(new Paragraph(doctorId).setFont(font)));
                doctorTable.addCell(new Cell().add(new Paragraph(doctorName).setFont(font)));
                doctorTable.addCell(new Cell().add(new Paragraph(deptName).setFont(font)));
                doctorTable.addCell(new Cell().add(new Paragraph(count.toString()).setFont(font)));
            }

            document.add(doctorTable);

            // 页脚
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("报告生成时间: " + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .setFont(font)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT));

            document.close();
        } catch (Exception e) {
            throw new BusinessException("生成PDF报告失败: " + e.getMessage());
        }
    }
}
