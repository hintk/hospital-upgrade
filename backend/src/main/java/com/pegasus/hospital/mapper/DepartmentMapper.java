package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Department;
import org.apache.ibatis.annotations.Mapper;

/**
 * 科室Mapper接口
 */
@Mapper
public interface DepartmentMapper extends BaseMapper<Department> {
}
