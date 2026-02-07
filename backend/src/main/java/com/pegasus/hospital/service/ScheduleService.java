package com.pegasus.hospital.service;

import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Schedule;
import java.time.LocalDate;
import java.util.List;

/**
 * 排班服务接口
 */
public interface ScheduleService {

    /**
     * 根据医生ID查询排班
     */
    List<Schedule> listByDoctorId(String doctorId);

    /**
     * 根据日期查询排班
     */
    List<Schedule> listByDate(LocalDate date);

    /**
     * 根据ID获取排班
     */
    Schedule getById(Long id);

    /**
     * 添加排班
     */
    Schedule add(ScheduleDTO dto);

    /**
     * 批量添加排班
     */
    int batchAdd(List<ScheduleDTO> schedules);

    /**
     * 更新排班
     */
    Schedule update(Long id, ScheduleDTO dto);

    /**
     * 删除排班（停诊）
     */
    void delete(Long id);
}
