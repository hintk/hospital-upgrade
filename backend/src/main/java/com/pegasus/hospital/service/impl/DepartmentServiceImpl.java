package com.pegasus.hospital.service.impl;

import com.pegasus.hospital.entity.Department;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.DepartmentMapper;
import com.pegasus.hospital.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;

import java.util.List;

/**
 * 科室服务实现类
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentMapper departmentMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public List<Department> listAll() {
        String cacheKey = "departments:all";
        
        // 先查缓存
        List<Department> departments = (List<Department>) redisTemplate.opsForValue().get(cacheKey);
        
        if (departments != null) {
            return departments;
        }
        
        // 缓存未命中，从数据库查询
        departments = departmentMapper.selectList(null);
        
        // 存入缓存，TTL 1小时
        redisTemplate.opsForValue().set(cacheKey, departments, Duration.ofHours(1));
        
        return departments;
    }

    public void invalidateDepartmentCache() {
        String cacheKey = "departments:all";
        redisTemplate.delete(cacheKey);
    }

    @Override
    public Department getById(Long id) {
        Department department = departmentMapper.selectById(id);
        if (department == null) {
            throw new BusinessException("科室不存在");
        }
        return department;
    }
}
