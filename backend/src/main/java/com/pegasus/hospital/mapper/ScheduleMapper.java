package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Schedule;
import org.apache.ibatis.annotations.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班Mapper接口
 */
@Mapper
public interface ScheduleMapper extends BaseMapper<Schedule> {

    @Select("SELECT s.*, d.name as doctor_name, dep.name as department_name " +
            "FROM schedule s " +
            "LEFT JOIN doctor d ON s.doctor_id = d.doctor_id " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE s.doctor_id = #{doctorId} AND s.schedule_date >= #{startDate} AND s.status = 1 " +
            "ORDER BY s.schedule_date, s.start_time")
    List<Schedule> selectByDoctorId(@Param("doctorId") String doctorId, @Param("startDate") LocalDate startDate);

    @Select("SELECT s.*, d.name as doctor_name, dep.name as department_name " +
            "FROM schedule s " +
            "LEFT JOIN doctor d ON s.doctor_id = d.doctor_id " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE s.schedule_date = #{date} AND s.status = 1 " +
            "ORDER BY dep.id, s.start_time")
    List<Schedule> selectByDate(@Param("date") LocalDate date);

    @Update("UPDATE schedule SET current_patients = current_patients + 1, version = version + 1 " +
            "WHERE id = #{id} AND current_patients < max_patients AND version = #{version}")
    int incrementPatients(@Param("id") Long id, @Param("version") Integer version);

    @Update("UPDATE schedule SET current_patients = current_patients - 1, version = version + 1 " +
            "WHERE id = #{id} AND current_patients > 0")
    int decrementPatients(@Param("id") Long id);
}
