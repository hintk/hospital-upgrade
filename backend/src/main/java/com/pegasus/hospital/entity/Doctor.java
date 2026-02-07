package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 医生实体类
 * 医生ID：8位数字
 */
@Data
@TableName("doctor")
public class Doctor {
    
    @TableId(value = "doctor_id", type = IdType.INPUT)
    private String doctorId;

    private String name;

    private String password;

    private Long departmentId;

    private String specialty;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /** 非数据库字段：科室名称 */
    @TableField(exist = false)
    private String departmentName;
}
