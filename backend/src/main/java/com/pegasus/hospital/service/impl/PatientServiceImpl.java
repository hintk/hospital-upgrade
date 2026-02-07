package com.pegasus.hospital.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.pegasus.hospital.dto.PatientRegisterDTO;
import com.pegasus.hospital.dto.PatientUpdateDTO;
import com.pegasus.hospital.entity.Patient;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.PatientMapper;
import com.pegasus.hospital.service.PatientService;
import com.pegasus.hospital.util.IdGenerator;
import com.pegasus.hospital.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * 患者服务实现类
 */
@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientMapper patientMapper;

    @Autowired
    private com.pegasus.hospital.util.PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Patient register(PatientRegisterDTO dto) {
        // 验证年龄（年满10岁）
        if (!ValidationUtil.isOldEnough(dto.getIdCard())) {
            throw new BusinessException("注册失败：年龄必须满10岁");
        }

        // 检查身份证号是否已注册（排除已注销的账号）
        LambdaQueryWrapper<Patient> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Patient::getIdCard, dto.getIdCard());
        wrapper.eq(Patient::getStatus, 1);  // 只检查未注销的账号
        if (patientMapper.selectCount(wrapper) > 0) {
            throw new BusinessException("该身份证号已注册");
        }

        // 生成患者ID
        Long maxId = patientMapper.getMaxPatientId();
        String patientId = IdGenerator.generatePatientId(maxId);

        // 创建患者对象
        Patient patient = new Patient();
        patient.setPatientId(patientId);
        patient.setName(dto.getName());
        // Use Bcrypt to encode password
        patient.setPassword(passwordEncoder.encodePassword(dto.getPassword()));
        patient.setIdCard(dto.getIdCard());
        patient.setPhone(dto.getPhone());
        patient.setGender(dto.getGender());
        patient.setBirthDate(ValidationUtil.parseBirthDateFromIdCard(dto.getIdCard()));
        patient.setStatus(1);

        patientMapper.insert(patient);
        return patient;
    }

    @Override
    public Patient login(String account, String password) {
        Patient patient = null;
        
        // 支持患者ID和手机号登录
        if (account.length() == 10 && account.matches("\\d+")) {
            // 10位数字，按患者ID查询
            patient = patientMapper.selectById(account);
        } else if (account.length() == 11 && account.matches("1[3-9]\\d{9}")) {
            // 11位手机号
            LambdaQueryWrapper<Patient> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Patient::getPhone, account);
            patient = patientMapper.selectOne(wrapper);
        }
        
        if (patient == null) {
            throw new BusinessException("账号不存在，请检查患者ID或手机号");
        }
        if (patient.getStatus() == 0) {
            throw new BusinessException("该账号已注销");
        }
        
        // Use Bcrypt to verify password
        if (!passwordEncoder.matches(password, patient.getPassword())) {
            throw new BusinessException("密码错误");
        }
        // 不返回密码
        patient.setPassword(null);
        return patient;
    }

    @Override
    public Patient getByPatientId(String patientId) {
        Patient patient = patientMapper.selectById(patientId);
        if (patient == null || patient.getStatus() == 0) {
            throw new BusinessException("患者不存在");
        }
        patient.setPassword(null);
        return patient;
    }

    @Override
    @Transactional
    public Patient update(String patientId, PatientUpdateDTO dto) {
        Patient patient = patientMapper.selectById(patientId);
        if (patient == null || patient.getStatus() == 0) {
            throw new BusinessException("患者不存在");
        }

        // 更新非空字段（ID和身份证号不可修改）
        if (StringUtils.hasText(dto.getName())) {
            patient.setName(dto.getName());
        }
        if (StringUtils.hasText(dto.getPassword())) {
            patient.setPassword(dto.getPassword());
        }
        if (StringUtils.hasText(dto.getPhone())) {
            patient.setPhone(dto.getPhone());
        }
        if (StringUtils.hasText(dto.getGender())) {
            patient.setGender(dto.getGender());
        }

        patientMapper.updateById(patient);
        patient.setPassword(null);
        return patient;
    }

    @Override
    @Transactional
    public void cancelAccount(String patientId) {
        Patient patient = patientMapper.selectById(patientId);
        if (patient == null) {
            throw new BusinessException("患者不存在");
        }
        patient.setStatus(0);
        patientMapper.updateById(patient);
    }
}
