package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 预约实体类
 * 预约号：12位数字
 */
@Data
@TableName("appointment")
public class Appointment {
    
    @TableId(value = "appointment_id", type = IdType.INPUT)
    private String appointmentId;

    private String patientId;

    private String doctorId;

    private Long scheduleId;

    private LocalDateTime appointmentTime;

    private String status;

    private String cancelReason;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /** 非数据库字段 */
    @TableField(exist = false)
    private String patientName;

    @TableField(exist = false)
    private String doctorName;

    @TableField(exist = false)
    private String departmentName;
}
