package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Patient;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 患者Mapper接口
 */
@Mapper
public interface PatientMapper extends BaseMapper<Patient> {

    @Select("SELECT MAX(CAST(patient_id AS UNSIGNED)) FROM patient")
    Long getMaxPatientId();
}
