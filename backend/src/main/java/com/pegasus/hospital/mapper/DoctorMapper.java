package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Doctor;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 医生Mapper接口
 */
@Mapper
public interface DoctorMapper extends BaseMapper<Doctor> {

    @Select("SELECT MAX(CAST(doctor_id AS UNSIGNED)) FROM doctor")
    Long getMaxDoctorId();

    @Select("SELECT d.*, dep.name as department_name FROM doctor d " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE d.department_id = #{departmentId} AND d.status = 1")
    List<Doctor> selectByDepartmentId(Long departmentId);

    @Select("SELECT d.*, dep.name as department_name FROM doctor d " +
            "LEFT JOIN department dep ON d.department_id = dep.id " +
            "WHERE d.status = 1")
    List<Doctor> selectAllWithDepartment();
}
