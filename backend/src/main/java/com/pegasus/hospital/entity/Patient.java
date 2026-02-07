package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 患者实体类
 * 患者ID：10位数字
 */
@Data
@TableName("patient")
public class Patient {
    
    @TableId(value = "patient_id", type = IdType.INPUT)
    private String patientId;

    private String name;

    private String password;

    private String idCard;

    private String phone;

    private String gender;

    private LocalDate birthDate;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
