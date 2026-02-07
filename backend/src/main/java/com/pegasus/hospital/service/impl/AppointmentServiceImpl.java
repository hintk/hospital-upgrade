package com.pegasus.hospital.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.pegasus.hospital.dto.AppointmentCreateDTO;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.AppointmentMapper;
import com.pegasus.hospital.mapper.PatientMapper;
import com.pegasus.hospital.mapper.ScheduleMapper;
import com.pegasus.hospital.service.AppointmentService;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.service.ScheduleService;
import com.pegasus.hospital.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

/**
 * 预约服务实现类
 * 重点：预约时使用乐观锁控制并发
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentMapper appointmentMapper;

    @Autowired
    private ScheduleMapper scheduleMapper;

    @Autowired
    private PatientMapper patientMapper;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private ScheduleService scheduleService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private com.pegasus.hospital.metrics.AppointmentMetrics appointmentMetrics;

    @Override
    @Transactional
    public Appointment create(AppointmentCreateDTO dto) {
        String lockKey = "schedule:lock:" + dto.getScheduleId();
        String lockValue = UUID.randomUUID().toString();

        try {
            // 获取分布式锁（TTL 10秒，防止死锁）
            Boolean locked = redisTemplate.opsForValue().setIfAbsent(
                lockKey,
                lockValue,
                Duration.ofSeconds(10)
            );

            if (locked == null || !locked) {
                throw new BusinessException("系统繁忙，请稍候");
            }

            // 验证患者是否存在
            if (patientMapper.selectById(dto.getPatientId()) == null) {
                throw new BusinessException("患者不存在");
            }

            // 获取排班信息
            Schedule schedule = scheduleMapper.selectById(dto.getScheduleId());
            if (schedule == null || schedule.getStatus() == 0) {
                throw new BusinessException("该排班不存在或已停诊");
            }

            // 验证医生ID是否匹配
            if (!schedule.getDoctorId().equals(dto.getDoctorId())) {
                throw new BusinessException("医生ID与排班信息不匹配");
            }

            // 检查患者是否已在同一排班预约
            int existCount = appointmentMapper.countByPatientAndSchedule(dto.getPatientId(), dto.getScheduleId());
            if (existCount > 0) {
                throw new BusinessException("您已在该时段预约，不能重复预约");
            }

            // 检查患者是否已在同一时间段（同一天同一开始时间）预约了其他医生
            int timeSlotCount = appointmentMapper.countByPatientAndTimeSlot(
                    dto.getPatientId(), schedule.getScheduleDate(), schedule.getStartTime());
            if (timeSlotCount > 0) {
                throw new BusinessException("您在该时间段已有其他预约，同一时间段只能预约一个号源");
            }

            // 使用乐观锁尝试增加预约数（核心并发控制）
            // 注意：这里仍然保留数据库乐观锁作为最后一道防线
            int updateResult = scheduleMapper.incrementPatients(schedule.getId(), schedule.getVersion());
            if (updateResult == 0) {
                throw new BusinessException("预约失败：该时段号源已满或已被他人预约，请刷新后重试");
            }

            // 生成预约号
            Long maxId = appointmentMapper.getMaxAppointmentId();
            String appointmentId = IdGenerator.generateAppointmentId(maxId);

            // 创建预约
            Appointment appointment = new Appointment();
            appointment.setAppointmentId(appointmentId);
            appointment.setPatientId(dto.getPatientId());
            appointment.setDoctorId(dto.getDoctorId());
            appointment.setScheduleId(dto.getScheduleId());
            appointment.setAppointmentTime(LocalDateTime.of(schedule.getScheduleDate(), schedule.getStartTime()));
            appointment.setStatus("已预约");

            appointmentMapper.insert(appointment);
            return appointment;

        } finally {
            // 释放锁（只有持有者才能释放）
            Object currentValue = redisTemplate.opsForValue().get(lockKey);
            if (currentValue != null && lockValue.equals(currentValue.toString())) {
                redisTemplate.delete(lockKey);
            }
        }
    }

    @Override
    @Transactional
    public void cancel(String appointmentId, String reason) {
        Appointment appointment = appointmentMapper.selectById(appointmentId);
        if (appointment == null) {
            throw new BusinessException("预约记录不存在");
        }
        if (!"已预约".equals(appointment.getStatus())) {
            throw new BusinessException("只有'已预约'状态的预约才能取消");
        }

        // 检查是否在可取消时间内（预约时间前24小时）
        if (appointment.getAppointmentTime().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new BusinessException("距离预约时间不足1小时，无法取消");
        }

        // 释放号源
        scheduleMapper.decrementPatients(appointment.getScheduleId());

        // 更新预约状态
        appointment.setStatus("已取消");
        appointment.setCancelReason(reason);
        appointmentMapper.updateById(appointment);
    }

    @Override
    @Transactional
    public void complete(String appointmentId) {
        Appointment appointment = appointmentMapper.selectById(appointmentId);
        if (appointment == null) {
            throw new BusinessException("预约记录不存在");
        }
        if (!"已预约".equals(appointment.getStatus())) {
            throw new BusinessException("只有'已预约'状态的预约才能完成");
        }
        appointment.setStatus("已完成");
        appointmentMapper.updateById(appointment);
    }

    @Override
    public Appointment getByAppointmentId(String appointmentId) {
        Appointment appointment = appointmentMapper.selectById(appointmentId);
        if (appointment == null) {
            throw new BusinessException("预约记录不存在");
        }
        return appointment;
    }

    @Override
    public List<Appointment> listByPatientId(String patientId) {
        return appointmentMapper.selectByPatientId(patientId);
    }

    @Override
    public List<Appointment> listByDoctorId(String doctorId) {
        return appointmentMapper.selectByDoctorId(doctorId);
    }

    @Override
    public List<Appointment> listAll() {
        LambdaQueryWrapper<Appointment> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Appointment::getCreatedAt);
        return appointmentMapper.selectList(wrapper);
    }

    @Override
    public List<Appointment> listByMonth(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startTime = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endTime = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        return appointmentMapper.selectByTimeRange(startTime, endTime);
    }
}
