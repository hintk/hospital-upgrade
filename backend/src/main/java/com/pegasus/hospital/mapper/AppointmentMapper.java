package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Appointment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 预约Mapper接口
 */
@Mapper
public interface AppointmentMapper extends BaseMapper<Appointment> {

    @Select("SELECT MAX(CAST(appointment_id AS UNSIGNED)) FROM appointment")
    Long getMaxAppointmentId();

    @Select("SELECT a.*, p.name as patient_name, d.name as doctor_name, dep.name as department_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE a.patient_id = #{patientId} " +
            "ORDER BY a.created_at DESC")
    List<Appointment> selectByPatientId(@Param("patientId") String patientId);

    @Select("SELECT a.*, p.name as patient_name, d.name as doctor_name, dep.name as department_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE a.doctor_id = #{doctorId} " +
            "ORDER BY a.appointment_time")
    List<Appointment> selectByDoctorId(@Param("doctorId") String doctorId);

    @Select("SELECT COUNT(*) FROM appointment " +
            "WHERE patient_id = #{patientId} AND schedule_id = #{scheduleId} AND status = '已预约'")
    int countByPatientAndSchedule(@Param("patientId") String patientId, @Param("scheduleId") Long scheduleId);

    @Select("SELECT COUNT(*) FROM appointment a " +
            "JOIN schedule s ON a.schedule_id = s.id " +
            "WHERE a.patient_id = #{patientId} " +
            "AND a.status = '已预约' " +
            "AND s.schedule_date = #{scheduleDate} " +
            "AND s.start_time = #{startTime}")
    int countByPatientAndTimeSlot(@Param("patientId") String patientId, 
                                   @Param("scheduleDate") java.time.LocalDate scheduleDate,
                                   @Param("startTime") java.time.LocalTime startTime);

    @Select("SELECT a.*, p.name as patient_name, d.name as doctor_name, dep.name as department_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE a.created_at BETWEEN #{startTime} AND #{endTime} " +
            "ORDER BY a.created_at DESC")
    List<Appointment> selectByTimeRange(@Param("startTime") LocalDateTime startTime, 
                                        @Param("endTime") LocalDateTime endTime);

    @Select("SELECT dep.name as department_name, COUNT(*) as count " +
            "FROM appointment a " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE a.created_at BETWEEN #{startTime} AND #{endTime} " +
            "GROUP BY dep.id, dep.name " +
            "ORDER BY count DESC")
    List<Map<String, Object>> countByDepartment(@Param("startTime") LocalDateTime startTime,
                                                 @Param("endTime") LocalDateTime endTime);

    @Select("SELECT d.doctor_id, d.name as doctor_name, dep.name as department_name, COUNT(*) as count " +
            "FROM appointment a " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE a.created_at BETWEEN #{startTime} AND #{endTime} " +
            "GROUP BY d.doctor_id, d.name, dep.name " +
            "ORDER BY count DESC")
    List<Map<String, Object>> countByDoctor(@Param("startTime") LocalDateTime startTime,
                                             @Param("endTime") LocalDateTime endTime);
}
