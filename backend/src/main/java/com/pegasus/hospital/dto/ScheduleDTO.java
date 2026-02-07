package com.pegasus.hospital.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 排班DTO（用于导入和添加）
 */
@Data
public class ScheduleDTO {

    @NotBlank(message = "医生ID不能为空")
    private String doctorId;

    @NotNull(message = "排班日期不能为空")
    private LocalDate scheduleDate;

    @NotNull(message = "开始时间不能为空")
    private LocalTime startTime;

    @NotNull(message = "结束时间不能为空")
    private LocalTime endTime;

    private Integer maxPatients = 20;
}
