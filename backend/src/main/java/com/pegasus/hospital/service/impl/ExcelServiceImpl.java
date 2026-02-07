package com.pegasus.hospital.service.impl;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.service.ExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Excel导入导出服务实现类
 */
@Service
public class ExcelServiceImpl implements ExcelService {

    @Override
    public List<DoctorDTO> importDoctors(MultipartFile file) {
        List<DoctorDTO> doctors = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            // 跳过标题行，从第2行开始读取
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                DoctorDTO dto = new DoctorDTO();
                dto.setDoctorId(getCellValueAsString(row.getCell(0)));
                dto.setName(getCellValueAsString(row.getCell(1)));
                dto.setPassword(getCellValueAsString(row.getCell(2)));
                String deptIdStr = getCellValueAsString(row.getCell(3));
                if (deptIdStr != null && !deptIdStr.isEmpty()) {
                    dto.setDepartmentId(Long.parseLong(deptIdStr));
                }
                dto.setSpecialty(getCellValueAsString(row.getCell(4)));

                if (dto.getName() != null && !dto.getName().isEmpty()) {
                    doctors.add(dto);
                }
            }
        } catch (IOException e) {
            throw new BusinessException("读取Excel文件失败: " + e.getMessage());
        }
        return doctors;
    }

    @Override
    public List<ScheduleDTO> importSchedules(MultipartFile file) {
        List<ScheduleDTO> schedules = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                ScheduleDTO dto = new ScheduleDTO();
                dto.setDoctorId(getCellValueAsString(row.getCell(0)));
                
                String dateStr = getCellValueAsString(row.getCell(1));
                if (dateStr != null && !dateStr.isEmpty()) {
                    dto.setScheduleDate(LocalDate.parse(dateStr, dateFormatter));
                }
                
                String startTimeStr = getCellValueAsString(row.getCell(2));
                if (startTimeStr != null && !startTimeStr.isEmpty()) {
                    dto.setStartTime(LocalTime.parse(startTimeStr, timeFormatter));
                }
                
                String endTimeStr = getCellValueAsString(row.getCell(3));
                if (endTimeStr != null && !endTimeStr.isEmpty()) {
                    dto.setEndTime(LocalTime.parse(endTimeStr, timeFormatter));
                }
                
                String maxPatientsStr = getCellValueAsString(row.getCell(4));
                if (maxPatientsStr != null && !maxPatientsStr.isEmpty()) {
                    dto.setMaxPatients(Integer.parseInt(maxPatientsStr));
                }

                if (dto.getDoctorId() != null && !dto.getDoctorId().isEmpty()) {
                    schedules.add(dto);
                }
            }
        } catch (IOException e) {
            throw new BusinessException("读取Excel文件失败: " + e.getMessage());
        }
        return schedules;
    }

    @Override
    public void exportAppointments(List<Appointment> appointments, HttpServletResponse response) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("预约记录");

            // 创建标题行样式
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // 创建标题行
            Row headerRow = sheet.createRow(0);
            String[] headers = {"预约号", "患者ID", "患者姓名", "医生ID", "医生姓名", 
                    "科室", "预约时间", "状态", "创建时间"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // 填充数据
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            int rowNum = 1;
            for (Appointment apt : appointments) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(apt.getAppointmentId());
                row.createCell(1).setCellValue(apt.getPatientId());
                row.createCell(2).setCellValue(apt.getPatientName() != null ? apt.getPatientName() : "");
                row.createCell(3).setCellValue(apt.getDoctorId());
                row.createCell(4).setCellValue(apt.getDoctorName() != null ? apt.getDoctorName() : "");
                row.createCell(5).setCellValue(apt.getDepartmentName() != null ? apt.getDepartmentName() : "");
                row.createCell(6).setCellValue(apt.getAppointmentTime().format(formatter));
                row.createCell(7).setCellValue(apt.getStatus());
                row.createCell(8).setCellValue(apt.getCreatedAt().format(formatter));
            }

            // 自动调整列宽
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 设置响应头
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            String fileName = URLEncoder.encode("预约记录_" + LocalDate.now() + ".xlsx", "UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

            OutputStream out = response.getOutputStream();
            workbook.write(out);
            out.flush();
        } catch (IOException e) {
            throw new BusinessException("导出Excel失败: " + e.getMessage());
        }
    }

    @Override
    public void downloadDoctorTemplate(HttpServletResponse response) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("医生导入模板");

            // 创建标题行
            Row headerRow = sheet.createRow(0);
            String[] headers = {"医生ID(8位,可空)", "姓名(必填)", "密码(可空,默认123456)", 
                    "科室ID(必填)", "专长描述(可空)"};
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            // 添加示例数据
            Row exampleRow = sheet.createRow(1);
            exampleRow.createCell(0).setCellValue("10000009");
            exampleRow.createCell(1).setCellValue("示例医生");
            exampleRow.createCell(2).setCellValue("123456");
            exampleRow.createCell(3).setCellValue("1");
            exampleRow.createCell(4).setCellValue("擅长内科常见病诊治");

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            String fileName = URLEncoder.encode("医生导入模板.xlsx", "UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

            workbook.write(response.getOutputStream());
        } catch (IOException e) {
            throw new BusinessException("生成模板失败: " + e.getMessage());
        }
    }

    @Override
    public void downloadScheduleTemplate(HttpServletResponse response) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("排班导入模板");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"医生ID(必填)", "排班日期(必填,格式yyyy-MM-dd)", 
                    "开始时间(必填,格式HH:mm)", "结束时间(必填,格式HH:mm)", "最大预约数(可空,默认20)"};
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            Row exampleRow = sheet.createRow(1);
            exampleRow.createCell(0).setCellValue("10000001");
            exampleRow.createCell(1).setCellValue(LocalDate.now().plusDays(7).toString());
            exampleRow.createCell(2).setCellValue("08:00");
            exampleRow.createCell(3).setCellValue("12:00");
            exampleRow.createCell(4).setCellValue("20");

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            String fileName = URLEncoder.encode("排班导入模板.xlsx", "UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

            workbook.write(response.getOutputStream());
        } catch (IOException e) {
            throw new BusinessException("生成模板失败: " + e.getMessage());
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }
}
