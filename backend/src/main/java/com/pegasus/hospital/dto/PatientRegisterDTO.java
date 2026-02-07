package com.pegasus.hospital.dto;

import lombok.Data;
import javax.validation.constraints.*;

/**
 * 患者注册DTO
 */
@Data
public class PatientRegisterDTO {

    @NotBlank(message = "姓名不能为空")
    @Size(max = 20, message = "姓名最多20个字符")
    private String name;

    @NotBlank(message = "密码不能为空")
    @Size(min = 4, message = "密码不能少于4位")
    private String password;

    @NotBlank(message = "身份证号不能为空")
    @Pattern(regexp = "^\\d{18}$", message = "身份证号必须是18位数字")
    private String idCard;

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @NotBlank(message = "性别不能为空")
    @Pattern(regexp = "^[MF]$", message = "性别只能是M或F")
    private String gender;
}
