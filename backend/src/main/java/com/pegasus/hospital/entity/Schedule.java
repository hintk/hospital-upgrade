package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 排班实体类
 */
@Data
@TableName("schedule")
public class Schedule {
    
    @TableId(type = IdType.AUTO)
    private Long id;

    private String doctorId;

    private LocalDate scheduleDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer maxPatients;

    private Integer currentPatients;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @Version
    private Integer version;

    /** 非数据库字段：医生姓名 */
    @TableField(exist = false)
    private String doctorName;

    /** 非数据库字段：科室名称 */
    @TableField(exist = false)
    private String departmentName;
}
