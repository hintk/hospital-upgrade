package com.pegasus.hospital.service;

import com.pegasus.hospital.dto.AppointmentCreateDTO;
import com.pegasus.hospital.entity.Appointment;
import java.util.List;

/**
 * 预约服务接口
 */
public interface AppointmentService {

    /**
     * 创建预约（核心功能，需要并发控制）
     */
    Appointment create(AppointmentCreateDTO dto);

    /**
     * 取消预约
     */
    void cancel(String appointmentId, String reason);

    /**
     * 完成预约
     */
    void complete(String appointmentId);

    /**
     * 根据预约号获取预约信息
     */
    Appointment getByAppointmentId(String appointmentId);

    /**
     * 根据患者ID获取预约列表
     */
    List<Appointment> listByPatientId(String patientId);

    /**
     * 根据医生ID获取预约列表
     */
    List<Appointment> listByDoctorId(String doctorId);

    /**
     * 获取所有预约记录（用于导出）
     */
    List<Appointment> listAll();

    /**
     * 获取指定月份的预约记录（用于报告）
     */
    List<Appointment> listByMonth(int year, int month);
}
