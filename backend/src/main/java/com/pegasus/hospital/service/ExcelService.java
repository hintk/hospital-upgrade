package com.pegasus.hospital.service;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Appointment;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Excel导入导出服务接口
 */
public interface ExcelService {

    /**
     * 从Excel导入医生数据
     */
    List<DoctorDTO> importDoctors(MultipartFile file);

    /**
     * 从Excel导入排班数据
     */
    List<ScheduleDTO> importSchedules(MultipartFile file);

    /**
     * 导出预约记录到Excel
     */
    void exportAppointments(List<Appointment> appointments, HttpServletResponse response);

    /**
     * 下载医生导入模板
     */
    void downloadDoctorTemplate(HttpServletResponse response);

    /**
     * 下载排班导入模板
     */
    void downloadScheduleTemplate(HttpServletResponse response);
}
