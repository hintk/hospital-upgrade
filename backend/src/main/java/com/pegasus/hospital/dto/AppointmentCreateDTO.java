package com.pegasus.hospital.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 创建预约DTO
 */
@Data
public class AppointmentCreateDTO {

    @NotBlank(message = "患者ID不能为空")
    private String patientId;

    @NotBlank(message = "医生ID不能为空")
    private String doctorId;

    @NotNull(message = "排班ID不能为空")
    private Long scheduleId;
}
