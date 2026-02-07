package com.pegasus.hospital.service;

import com.pegasus.hospital.dto.PatientRegisterDTO;
import com.pegasus.hospital.dto.PatientUpdateDTO;
import com.pegasus.hospital.entity.Patient;

/**
 * 患者服务接口
 */
public interface PatientService {

    /**
     * 患者注册
     */
    Patient register(PatientRegisterDTO dto);

    /**
     * 患者登录
     */
    Patient login(String patientId, String password);

    /**
     * 根据ID获取患者信息
     */
    Patient getByPatientId(String patientId);

    /**
     * 修改患者信息（ID和身份证号不可修改）
     */
    Patient update(String patientId, PatientUpdateDTO dto);

    /**
     * 注销账号
     */
    void cancelAccount(String patientId);
}
