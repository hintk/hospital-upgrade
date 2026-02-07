package com.pegasus.hospital.controller;

import com.pegasus.hospital.vo.Result;
import com.pegasus.hospital.mapper.AppointmentMapper;
import com.pegasus.hospital.mapper.DoctorMapper;
import com.pegasus.hospital.mapper.PatientMapper;
import com.pegasus.hospital.mapper.ScheduleMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.entity.Doctor;
import com.pegasus.hospital.entity.Patient;
import com.pegasus.hospital.entity.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private AppointmentMapper appointmentMapper;

    @Autowired
    private DoctorMapper doctorMapper;

    @Autowired
    private PatientMapper patientMapper;

    @Autowired
    private ScheduleMapper scheduleMapper;

    @GetMapping("/home")
    public Result<Map<String, Object>> getHomeStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        // 今日就诊人数（已完成的预约）
        LambdaQueryWrapper<Appointment> completedWrapper = new LambdaQueryWrapper<>();
        completedWrapper.eq(Appointment::getStatus, "已完成");
        completedWrapper.ge(Appointment::getAppointmentTime, startOfDay);
        completedWrapper.lt(Appointment::getAppointmentTime, endOfDay);
        Long todayVisits = appointmentMapper.selectCount(completedWrapper);
        stats.put("todayVisits", todayVisits);

        // 在线专家（有排班的医生数）
        LambdaQueryWrapper<Schedule> scheduleWrapper = new LambdaQueryWrapper<>();
        scheduleWrapper.eq(Schedule::getScheduleDate, today);
        scheduleWrapper.eq(Schedule::getStatus, 1);
        Long onlineDoctors = scheduleMapper.selectCount(scheduleWrapper);
        stats.put("onlineDoctors", onlineDoctors);

        // 剩余号源（今日排班的剩余号源总和）
        LambdaQueryWrapper<Schedule> availableWrapper = new LambdaQueryWrapper<>();
        availableWrapper.eq(Schedule::getScheduleDate, today);
        availableWrapper.eq(Schedule::getStatus, 1);
        availableWrapper.gt(Schedule::getCurrentPatients, 0);
        var schedules = scheduleMapper.selectList(availableWrapper);
        int remainingSlots = 0;
        for (var schedule : schedules) {
            remainingSlots += (schedule.getMaxPatients() - schedule.getCurrentPatients());
        }
        // 如果没有排班，显示总可用号源
        if (schedules.isEmpty()) {
            LambdaQueryWrapper<Schedule> allTodayWrapper = new LambdaQueryWrapper<>();
            allTodayWrapper.eq(Schedule::getScheduleDate, today);
            allTodayWrapper.eq(Schedule::getStatus, 1);
            var allSchedules = scheduleMapper.selectList(allTodayWrapper);
            for (var schedule : allSchedules) {
                remainingSlots += (schedule.getMaxPatients() - schedule.getCurrentPatients());
            }
        }
        stats.put("remainingSlots", remainingSlots);

        return Result.success(stats);
    }

    @GetMapping("/report")
    public Result<Map<String, Object>> getReportStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDate firstDayOfLastMonth = firstDayOfMonth.minusMonths(1);
        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = today.plusDays(1).atStartOfDay();
        LocalDateTime startOfLastMonth = firstDayOfLastMonth.atStartOfDay();
        LocalDateTime endOfLastMonth = firstDayOfMonth.atStartOfDay();

        // 本月预约总量
        LambdaQueryWrapper<Appointment> monthAppointmentWrapper = new LambdaQueryWrapper<>();
        monthAppointmentWrapper.ge(Appointment::getCreatedAt, startOfMonth);
        monthAppointmentWrapper.lt(Appointment::getCreatedAt, endOfMonth);
        Long monthlyAppointments = appointmentMapper.selectCount(monthAppointmentWrapper);
        stats.put("monthlyAppointments", monthlyAppointments);

        // 上月预约总量（用于计算增长率）
        LambdaQueryWrapper<Appointment> lastMonthAppointmentWrapper = new LambdaQueryWrapper<>();
        lastMonthAppointmentWrapper.ge(Appointment::getCreatedAt, startOfLastMonth);
        lastMonthAppointmentWrapper.lt(Appointment::getCreatedAt, endOfLastMonth);
        Long lastMonthAppointments = appointmentMapper.selectCount(lastMonthAppointmentWrapper);
        int appointmentGrowth = lastMonthAppointments > 0 
            ? (int) ((monthlyAppointments - lastMonthAppointments) * 100 / lastMonthAppointments) 
            : 0;
        stats.put("appointmentGrowth", appointmentGrowth);

        // 本月新增患者数
        LambdaQueryWrapper<Patient> monthPatientWrapper = new LambdaQueryWrapper<>();
        monthPatientWrapper.ge(Patient::getCreatedAt, startOfMonth);
        monthPatientWrapper.lt(Patient::getCreatedAt, endOfMonth);
        Long newPatients = patientMapper.selectCount(monthPatientWrapper);
        stats.put("newPatients", newPatients);

        // 上月新增患者数（用于计算增长率）
        LambdaQueryWrapper<Patient> lastMonthPatientWrapper = new LambdaQueryWrapper<>();
        lastMonthPatientWrapper.ge(Patient::getCreatedAt, startOfLastMonth);
        lastMonthPatientWrapper.lt(Patient::getCreatedAt, endOfLastMonth);
        Long lastMonthPatients = patientMapper.selectCount(lastMonthPatientWrapper);
        int patientGrowth = lastMonthPatients > 0 
            ? (int) ((newPatients - lastMonthPatients) * 100 / lastMonthPatients) 
            : 0;
        stats.put("patientGrowth", patientGrowth);

        // 医生出诊人次（本月有排班的医生数）
        LambdaQueryWrapper<Schedule> doctorScheduleWrapper = new LambdaQueryWrapper<>();
        doctorScheduleWrapper.ge(Schedule::getScheduleDate, firstDayOfMonth);
        doctorScheduleWrapper.le(Schedule::getScheduleDate, today);
        doctorScheduleWrapper.eq(Schedule::getStatus, 1);
        doctorScheduleWrapper.select(Schedule::getDoctorId);
        doctorScheduleWrapper.groupBy(Schedule::getDoctorId);
        Long activeDoctors = scheduleMapper.selectCount(
            new LambdaQueryWrapper<Schedule>()
                .ge(Schedule::getScheduleDate, firstDayOfMonth)
                .le(Schedule::getScheduleDate, today)
                .eq(Schedule::getStatus, 1)
                .groupBy(Schedule::getDoctorId)
        );
        // 使用不同的方式统计：查询本月有排班的不同医生数
        var scheduleList = scheduleMapper.selectList(
            new LambdaQueryWrapper<Schedule>()
                .ge(Schedule::getScheduleDate, firstDayOfMonth)
                .le(Schedule::getScheduleDate, today)
                .eq(Schedule::getStatus, 1)
        );
        long uniqueDoctors = scheduleList.stream()
            .map(Schedule::getDoctorId)
            .distinct()
            .count();
        stats.put("activeDoctors", uniqueDoctors);

        return Result.success(stats);
    }
}
