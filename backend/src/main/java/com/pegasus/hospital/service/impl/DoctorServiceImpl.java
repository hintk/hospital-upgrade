package com.pegasus.hospital.service.impl;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.entity.Doctor;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.DepartmentMapper;
import com.pegasus.hospital.mapper.DoctorMapper;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 医生服务实现类
 */
@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorMapper doctorMapper;

    @Autowired
    private DepartmentMapper departmentMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public List<Doctor> listByDepartmentId(Long departmentId) {
        return doctorMapper.selectByDepartmentId(departmentId);
    }

    @Override
    public List<Doctor> listAll() {
        String cacheKey = "doctors:all";

        // Check cache
        List<Doctor> doctors = (List<Doctor>) redisTemplate.opsForValue().get(cacheKey);
        if (doctors != null) {
            return doctors;
        }

        // Cache miss
        doctors = doctorMapper.selectAllWithDepartment();

        // Set cache with TTL
        redisTemplate.opsForValue().set(cacheKey, doctors, Duration.ofMinutes(30));

        return doctors;
    }

    @Override
    public Doctor getByDoctorId(String doctorId) {
        Doctor doctor = doctorMapper.selectById(doctorId);
        if (doctor == null || doctor.getStatus() == 0) {
            throw new BusinessException("医生不存在");
        }
        doctor.setPassword(null);
        return doctor;
    }

    @Override
    public Doctor login(String doctorId, String password) {
        Doctor doctor = doctorMapper.selectById(doctorId);
        if (doctor == null) {
            throw new BusinessException("医生ID不存在");
        }
        if (doctor.getStatus() == 0) {
            throw new BusinessException("该医生账号已停用");
        }
        if (!doctor.getPassword().equals(password)) {
            throw new BusinessException("密码错误");
        }
        doctor.setPassword(null);
        return doctor;
    }

    @Override
    @Transactional
    public Doctor add(DoctorDTO dto) {
        // 生成或使用指定的医生ID
        String doctorId = dto.getDoctorId();
        if (!StringUtils.hasText(doctorId)) {
            Long maxId = doctorMapper.getMaxDoctorId();
            doctorId = IdGenerator.generateDoctorId(maxId);
        } else {
            // 检查ID是否已存在
            if (doctorMapper.selectById(doctorId) != null) {
                throw new BusinessException("医生ID已存在: " + doctorId);
            }
        }

        // 验证科室ID是否有效
        if (dto.getDepartmentId() == null) {
            throw new BusinessException("科室ID不能为空");
        }
        if (departmentMapper.selectById(dto.getDepartmentId()) == null) {
            throw new BusinessException("科室ID不存在: " + dto.getDepartmentId());
        }

        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        doctor.setName(dto.getName());
        doctor.setPassword(dto.getPassword() != null ? dto.getPassword() : "123456");
        doctor.setDepartmentId(dto.getDepartmentId());
        doctor.setSpecialty(dto.getSpecialty());
        doctor.setStatus(1);

        doctorMapper.insert(doctor);
        doctor.setPassword(null);
        return doctor;
    }

    @Override
    @Transactional
    public int batchAdd(List<DoctorDTO> doctors) {
        int count = 0;
        for (DoctorDTO dto : doctors) {
            try {
                add(dto);
                count++;
            } catch (Exception e) {
                // 跳过失败的记录，继续处理
                System.err.println("添加医生失败: " + dto.getName() + ", 原因: " + e.getMessage());
            }
        }
        return count;
    }

    @Override
    @Transactional
    public Doctor update(String doctorId, DoctorDTO dto) {
        Doctor doctor = doctorMapper.selectById(doctorId);
        if (doctor == null) {
            throw new BusinessException("医生不存在");
        }

        if (StringUtils.hasText(dto.getName())) {
            doctor.setName(dto.getName());
        }
        if (StringUtils.hasText(dto.getPassword())) {
            doctor.setPassword(dto.getPassword());
        }
        if (dto.getDepartmentId() != null) {
            doctor.setDepartmentId(dto.getDepartmentId());
        }
        if (dto.getSpecialty() != null) {
            doctor.setSpecialty(dto.getSpecialty());
        }

        doctorMapper.updateById(doctor);
        doctor.setPassword(null);
        return doctor;
    }

    @Override
    @Transactional
    public void delete(String doctorId) {
        Doctor doctor = doctorMapper.selectById(doctorId);
        if (doctor == null) {
            throw new BusinessException("医生不存在");
        }
        doctor.setStatus(0);
        doctorMapper.updateById(doctor);
    }
}
