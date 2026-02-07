package com.pegasus.hospital.service;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.entity.Doctor;
import java.util.List;

/**
 * 医生服务接口
 */
public interface DoctorService {

    /**
     * 根据科室ID查询医生列表
     */
    List<Doctor> listByDepartmentId(Long departmentId);

    /**
     * 查询所有医生（带科室信息）
     */
    List<Doctor> listAll();

    /**
     * 根据医生ID获取医生信息
     */
    Doctor getByDoctorId(String doctorId);

    /**
     * 医生登录
     */
    Doctor login(String doctorId, String password);

    /**
     * 添加医生
     */
    Doctor add(DoctorDTO dto);

    /**
     * 批量添加医生
     */
    int batchAdd(List<DoctorDTO> doctors);

    /**
     * 更新医生信息
     */
    Doctor update(String doctorId, DoctorDTO dto);

    /**
     * 删除医生（逻辑删除）
     */
    void delete(String doctorId);
}
