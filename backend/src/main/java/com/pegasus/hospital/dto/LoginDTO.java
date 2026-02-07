package com.pegasus.hospital.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

/**
 * 登录DTO
 */
@Data
public class LoginDTO {

    @NotBlank(message = "用户ID不能为空")
    private String userId;

    @NotBlank(message = "密码不能为空")
    private String password;

    /** 用户类型: patient, doctor, admin */
    @NotBlank(message = "用户类型不能为空")
    private String userType;
}
