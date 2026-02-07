package com.pegasus.hospital.dto;

import lombok.Data;
import javax.validation.constraints.*;

/**
 * 患者信息修改DTO（ID和身份证号不可修改）
 */
@Data
public class PatientUpdateDTO {

    @Size(max = 20, message = "姓名最多20个字符")
    private String name;

    @Size(min = 4, message = "密码不能少于4位")
    private String password;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Pattern(regexp = "^[MF]$", message = "性别只能是M或F")
    private String gender;
}
