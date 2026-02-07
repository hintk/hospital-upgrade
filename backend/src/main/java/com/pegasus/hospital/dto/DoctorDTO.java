package com.pegasus.hospital.dto;

import lombok.Data;
import javax.validation.constraints.*;

/**
 * 医生DTO（用于导入和添加）
 */
@Data
public class DoctorDTO {

    @Pattern(regexp = "^\\d{8}$", message = "医生ID必须是8位数字")
    private String doctorId;

    @NotBlank(message = "姓名不能为空")
    @Size(max = 20, message = "姓名最多20个字符")
    private String name;

    @Size(min = 4, message = "密码不能少于4位")
    private String password;

    @NotNull(message = "科室ID不能为空")
    private Long departmentId;

    @Size(max = 200, message = "专长描述最多200个字符")
    private String specialty;
}
