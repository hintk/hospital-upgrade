package com.pegasus.hospital.service.impl;

import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.DoctorMapper;
import com.pegasus.hospital.mapper.ScheduleMapper;
import com.pegasus.hospital.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班服务实现类
 */
@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleMapper scheduleMapper;

    @Autowired
    private DoctorMapper doctorMapper;

    @Override
    public List<Schedule> listByDoctorId(String doctorId) {
        return scheduleMapper.selectByDoctorId(doctorId, LocalDate.now());
    }

    @Override
    public List<Schedule> listByDate(LocalDate date) {
        return scheduleMapper.selectByDate(date);
    }

    @Override
    public Schedule getById(Long id) {
        Schedule schedule = scheduleMapper.selectById(id);
        if (schedule == null) {
            throw new BusinessException("排班信息不存在");
        }
        return schedule;
    }

    @Override
    @Transactional
    public Schedule add(ScheduleDTO dto) {
        // 验证医生是否存在
        if (doctorMapper.selectById(dto.getDoctorId()) == null) {
            throw new BusinessException("医生不存在: " + dto.getDoctorId());
        }

        Schedule schedule = new Schedule();
        schedule.setDoctorId(dto.getDoctorId());
        schedule.setScheduleDate(dto.getScheduleDate());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setMaxPatients(dto.getMaxPatients() != null ? dto.getMaxPatients() : 20);
        schedule.setCurrentPatients(0);
        schedule.setStatus(1);
        schedule.setVersion(0);

        scheduleMapper.insert(schedule);
        return schedule;
    }

    @Override
    @Transactional
    public int batchAdd(List<ScheduleDTO> schedules) {
        int count = 0;
        for (ScheduleDTO dto : schedules) {
            try {
                add(dto);
                count++;
            } catch (Exception e) {
                System.err.println("添加排班失败: " + dto.getDoctorId() + " " + dto.getScheduleDate() 
                        + ", 原因: " + e.getMessage());
            }
        }
        return count;
    }

    @Override
    @Transactional
    public Schedule update(Long id, ScheduleDTO dto) {
        Schedule schedule = scheduleMapper.selectById(id);
        if (schedule == null) {
            throw new BusinessException("排班信息不存在");
        }

        if (dto.getScheduleDate() != null) {
            schedule.setScheduleDate(dto.getScheduleDate());
        }
        if (dto.getStartTime() != null) {
            schedule.setStartTime(dto.getStartTime());
        }
        if (dto.getEndTime() != null) {
            schedule.setEndTime(dto.getEndTime());
        }
        if (dto.getMaxPatients() != null) {
            schedule.setMaxPatients(dto.getMaxPatients());
        }

        scheduleMapper.updateById(schedule);
        return schedule;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Schedule schedule = scheduleMapper.selectById(id);
        if (schedule == null) {
            throw new BusinessException("排班信息不存在");
        }
        // 如果已有预约，不能直接删除
        if (schedule.getCurrentPatients() > 0) {
            throw new BusinessException("该排班已有预约，无法删除，请先处理相关预约");
        }
        schedule.setStatus(0);
        scheduleMapper.updateById(schedule);
    }
}
