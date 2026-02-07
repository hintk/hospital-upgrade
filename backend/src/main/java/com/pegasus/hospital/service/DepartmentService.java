package com.pegasus.hospital.service;

import com.pegasus.hospital.entity.Department;
import java.util.List;

/**
 * 科室服务接口
 */
public interface DepartmentService {

    /**
     * 获取所有科室
     */
    List<Department> listAll();

    /**
     * 根据ID获取科室
     */
    Department getById(Long id);
}
